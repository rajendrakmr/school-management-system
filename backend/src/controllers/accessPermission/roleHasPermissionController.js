const { Op } = require('sequelize');
const Role = require('../../models/Role');
const { body, validationResult } = require('express-validator');

exports.validateRole = [
    body('mst_role_id').notEmpty().withMessage('Role must be required'),
    body('mst_permission_id').notEmpty().withMessage('Permission must be required')
];
const RoleHasPermission = require('../../models/RoleHasPermission');
const Permission = require('../../models/Permission');
const UserHasRole = require('../../models/UserHasRole');
const sequelize = require('../../config/db');
const User = require('../../models/User');
Role.hasMany(RoleHasPermission, { foreignKey: 'mst_role_id' });
RoleHasPermission.belongsTo(Role, { foreignKey: 'mst_role_id' });

Permission.hasMany(RoleHasPermission, { foreignKey: 'mst_permission_id' });
RoleHasPermission.belongsTo(Permission, { foreignKey: 'mst_permission_id' });


exports.getRoleHasPermissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;


        const query = `
                SELECT 
                    t2.role_name,
                    JSON_ARRAYAGG(t3.permission_name) as permissions,
                    t1.mst_role_id, 
                    JSON_ARRAYAGG(t1.mst_permission_id) AS mst_permission_id
                FROM erp_mst_role_has_permissions AS t1
                INNER JOIN erp_mst_roles AS t2 
                    ON t1.mst_role_id = t2.mst_role_id
                INNER JOIN erp_mst_permissions AS t3 
                    ON t1.mst_permission_id = t3.mst_permission_id
                GROUP BY t1.mst_role_id
                ORDER BY t1.mst_role_id 
                LIMIT :limit OFFSET :offset
                `;

        const usersWithRoles = await sequelize.query(query, {
            replacements: { limit, offset },
            type: sequelize.QueryTypes.SELECT
        });

        res.json({
            totalCount: usersWithRoles.length, // optional, can fetch separately
            currentPage: page,
            items: usersWithRoles
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }

};



exports.getUserHasRole = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Fetch RoleHasPermission rows with associated Role & Permission
        const rows = await User.findAll({
            include: [
                { model: Role, attributes: ['mst_role_id', 'role_name'] },
                { model: Permission, attributes: ['mst_permission_id', 'permission_name'] }
            ],
            offset,
            limit,
            order: [['mst_role_id', 'ASC']] // optional: order by role
        });

        // Group rows by role
        const grouped = {};
        rows.forEach(row => {
            const roleData = row.erp_mst_role;
            if (!roleData) return;
            const roleId = roleData.mst_role_id;

            if (!grouped[roleId]) {
                grouped[roleId] = {
                    mst_role_id: roleId,
                    role_name: roleData.role_name,
                    permissions: []
                };
            }

            if (row.Permission) {
                grouped[roleId].permissions.push({
                    mst_permission_id: row.Permission.mst_permission_id,
                    permission_name: row.Permission.permission_name
                });
            }
        });

        const items = Object.values(grouped);

        // Correct total count of distinct roles
        const totalCount = await Role.count();

        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            totalCount,
            totalPages,
            currentPage: page,
            items,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

User.hasMany(UserHasRole, { foreignKey: 'trn_user_id' });
UserHasRole.belongsTo(User, { foreignKey: 'trn_user_id' });
Role.hasMany(UserHasRole, { foreignKey: 'mst_role_id' });
UserHasRole.belongsTo(Role, { foreignKey: 'mst_role_id' });

exports.getUserHasRole = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;


        const query = `
                SELECT 
                    u.trn_user_id,
                    u.first_name,
                    u.email,
                    JSON_ARRAYAGG(r.role_name) AS role_names,
                    JSON_ARRAYAGG(r.mst_role_id) AS mst_role_id
                FROM erp_trn_users u
                JOIN erp_trn_user_has_roles ur 
                    ON u.trn_user_id = ur.trn_user_id
                LEFT JOIN erp_mst_roles r
                    ON ur.mst_role_id = r.mst_role_id
                GROUP BY u.trn_user_id
                ORDER BY u.trn_user_id ASC
                LIMIT :limit OFFSET :offset
                `;

        const usersWithRoles = await sequelize.query(query, {
            replacements: { limit, offset },
            type: sequelize.QueryTypes.SELECT
        });

        res.json({
            totalCount: usersWithRoles.length, // optional, can fetch separately
            currentPage: page,
            items: usersWithRoles
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.createRoleHasPermission = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.param] = err.msg;
            });
            return res.status(422).json({ errors: formattedErrors });
        }

        const { mst_role_id, permissions } = req.body;

        if (!mst_role_id || !Array.isArray(permissions)) {
            return res.status(400).json({ error: "Role ID and permissions are required." });
        }

        // Filter permissions: only include if at least one can_* field is 'Y'
        const filteredPermissions = permissions.filter(perm =>
            perm.can_view === 'Y' ||
            perm.can_create === 'Y' ||
            perm.can_update === 'Y' ||
            perm.can_delete === 'Y' ||
            perm.can_edit === 'Y'
        );

        if (filteredPermissions.length === 0) {

            return res.status(422).json({ errors: { permissions: "At least one permission must be checked." } });
        }

        // Prepare array for bulk insert/update
        const bulkData = filteredPermissions.map(perm => ({
            mst_role_id,
            mst_permission_id: perm.mst_permission_id,
            can_view: perm.can_view || 'N',
            can_create: perm.can_create || 'N',
            can_update: perm.can_update || 'N',
            can_delete: perm.can_delete || 'N',
            can_edit: perm.can_edit || 'N',
            created_at: new Date(),
            updated_at: new Date(),
        }));

        await RoleHasPermission.bulkCreate(bulkData, {
            updateOnDuplicate: ['can_view', 'can_create', 'can_update', 'can_delete', 'can_edit', 'updated_at'],
            transaction: t
        });

        // Remove permissions not included in the request
        const permIds = filteredPermissions.map(p => p.mst_permission_id);
        await RoleHasPermission.destroy({
            where: {
                mst_role_id,
                mst_permission_id: { [Op.notIn]: permIds },
            },
            transaction: t
        });

        await t.commit();
        res.status(200).json({ message: "Role permissions successfully updated." });

    } catch (err) {
        await t.rollback();
        console.error('Error updating role permissions:', err);
        res.status(500).json({ error: err.message });
    }
};
