const { Op } = require('sequelize');
const Role = require('../models/Role');
const { body, validationResult } = require('express-validator');

exports.validateRole = [
    body('mst_role_id').notEmpty().withMessage('Role must be required'),
    body('mst_permission_id').notEmpty().withMessage('Permission must be required')
];
const RoleHasPermission = require('../models/RoleHasPermission');
const Permission = require('../models/Permission');
Role.hasMany(RoleHasPermission, { foreignKey: 'mst_role_id' });
RoleHasPermission.belongsTo(Role, { foreignKey: 'mst_role_id' });

// One-to-Many from Permission to RoleHasPermission
Permission.hasMany(RoleHasPermission, { foreignKey: 'mst_permission_id' });
RoleHasPermission.belongsTo(Permission, { foreignKey: 'mst_permission_id' });
exports.getRoleHasPermissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Fetch RoleHasPermission rows with associated Role & Permission
        const rows = await RoleHasPermission.findAll({
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




exports.createRoleHasPermission = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            return res.status(422).json({ errors: formattedErrors });
        }

        const { mst_role_id, permissions } = req.body;
        const role = await Role.findOne({ where: { mst_role_id } });
        if (Array.isArray(permissions) && permissions.length > 0) {
            await RoleHasPermission.destroy({
                where: {
                    mst_role_id: mst_role_id,
                    mst_permission_id: { [Op.notIn]: permissions }
                }
            });

            // Add new permissions if not exists
            for (const permId of permissions) {
                await RoleHasPermission.findOrCreate({
                    where: {
                        mst_role_id: mst_role_id,
                        mst_permission_id: permId
                    },
                    defaults: {
                        mst_role_id: mst_role_id,
                        mst_permission_id: permId
                    }
                });
            }
        } else {
            // If no permissions provided, remove all existing permissions for this role
            await RoleHasPermission.destroy({ where: { mst_role_id: mst_role_id } });
        }

        res.status(200).json({
            message: `Role "${role.role_name}" has been successfully updated with permissions.`,
            role_id: mst_role_id
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// exports.updateRoleHasPermission = async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             const formattedErrors = {};
//             errors.array().forEach(err => {
//                 formattedErrors[err.path] = err.msg;
//             });
//             return res.status(422).json({ errors: formattedErrors });
//         }

//         const { role_name, role_description, isActive } = req.body;
//         const { id } = req.params;

//         const role = await Role.findByPk(id);
//         if (!role) {
//             return res.status(404).json({ error: 'Role not found' });
//         }
//         if (role_name && role_name !== role.role_name) {
//             const existingRole = await Role.findOne({
//                 where: {
//                     role_name,
//                     mst_role_id: { [Op.ne]: id }  // Use imported Op
//                 }
//             });
//             if (existingRole) {
//                 return res.status(422).json({ errors: { role_name: `${role_name} is already taken.` } });
//             }
//         }

//         role.role_name = role_name || role.role_name;
//         role.role_description = role_description || role.role_description;
//         role.isActive = isActive || role.isActive;

//         await role.save();

//         res.status(200).json({
//             message: `Role "${role.role_name}" has been successfully updated.`,
//             role: {
//                 id: role.mst_role_id,
//                 name: role.role_name,
//                 description: role.role_description,
//                 isActive: role.isActive
//             }
//         });


//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };