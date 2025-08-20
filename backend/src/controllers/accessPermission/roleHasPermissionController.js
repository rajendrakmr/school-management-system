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

        const { trn_user_id, mst_role_id } = req.body;

        if (Array.isArray(mst_role_id) && mst_role_id.length > 0) {
            // Fetch current roles for the user
            const existingRoles = await UserHasRole.findAll({
                where: { trn_user_id },
                transaction: t
            });

            const existingRoleIds = existingRoles.map(r => r.mst_role_id);

            // Delete roles that are no longer in the new list
            const rolesToDelete = existingRoleIds.filter(id => !mst_role_id.includes(id));
            if (rolesToDelete.length > 0) {
                await UserHasRole.destroy({
                    where: {
                        trn_user_id,
                        mst_role_id: rolesToDelete
                    },
                    transaction: t
                });
            }

            // Insert only new roles that the user doesn't already have
            const rolesToAdd = mst_role_id.filter(id => !existingRoleIds.includes(id)).map(roleId => ({
                trn_user_id,
                mst_role_id: roleId
            }));

            if (rolesToAdd.length > 0) {
                await UserHasRole.bulkCreate(rolesToAdd, { transaction: t });
            }

        } else {
            // If empty array, remove all roles for this user
            await UserHasRole.destroy({
                where: { trn_user_id },
                transaction: t
            });
        }

        await t.commit();
        res.status(200).json({ message: `Access policies successfully updated.` });

    } catch (err) {
        await t.rollback();
        console.error('Error updating roles:', err);
        res.status(500).json({ error: err.message });
    }
};

