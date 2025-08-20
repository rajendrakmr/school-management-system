const { Op } = require('sequelize');
const Permission = require('../../models/Permission');
const { body, validationResult } = require('express-validator');

// Validation rules for permission creation
exports.validatePermission = [
    body('permission_name')
        .notEmpty().withMessage('Permission name is required')
        .isLength({ min: 3 }).withMessage('Permission must be at least 3 characters'),
    body('permission_description')
        .optional()
        .isLength({ max: 255 }).withMessage('Permission description cannot exceed 255 characters'),
    body('path_url')
        .optional()
        .isLength({ max: 50 }).withMessage('Path URL cannot exceed 50 characters'),
    body('is_active')
        .optional()
        .isIn(['Y', 'N']).withMessage('is_active must be "Y" or "N"')
];

// Get all permissions with pagination
const Module = require('../../models/Module'); // Module model

exports.getAllPermissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Permission.findAndCountAll({
            limit,
            offset,
            order: [['mst_permission_id', 'ASC']],
            include: [
                {
                    model: Module,
                    as: 'module', // jo alias aapne belongsTo me diya tha
                    attributes: ['mst_module_id', 'module_name'] // sirf ye fields fetch karna
                }
            ]
        });

        const flattenedRows = rows.map(permission => {
            const permissionData = permission.toJSON();
            return {
                ...permissionData,
                module_name: permissionData.module?.module_name || null
            };
        });
        const totalPages = Math.ceil(count / limit);

        res.json({
            totalCount: count,
            totalPages,
            currentPage: page,
            items: flattenedRows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Create a new permission
exports.createPermission = async (req, res) => {
    try {
        console.log('req.body',req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            return res.status(422).json({ errors: formattedErrors });
        }

        const { permission_name, permission_description,mst_module_id, path_url, is_active } = req.body;

        const existingPermission = await Permission.findOne({ where: { permission_name } });
        if (existingPermission) {
            return res.status(422).json({ errors: { permission_name: `${permission_name} is already taken.` } });
        }

        const newPermission = await Permission.create({ permission_name,mst_module_id, permission_description, path_url, is_active });

        res.status(200).json({
            message: `Permission "${permission_name}" has been successfully created.`,
            permission: newPermission
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update permission
exports.updatePermission = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            return res.status(422).json({ errors: formattedErrors });
        }

        const { permission_name, permission_description,mst_module_id , path_url, is_active } = req.body;
        const { id } = req.params;

        const permission = await Permission.findByPk(id);
        if (!permission) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        if (permission_name && permission_name !== permission.permission_name) {
            const existingPermission = await Permission.findOne({
                where: {
                    permission_name,
                    mst_permission_id: { [Op.ne]: id }
                }
            });
            if (existingPermission) {
                return res.status(422).json({ errors: { permission_name: `${permission_name} is already taken.` } });
            }
        }

        permission.permission_name = permission_name || permission.permission_name;
        permission.permission_description = permission_description || permission.permission_description;
        permission.path_url = path_url || permission.path_url;
          permission.mst_module_id  = mst_module_id  || permission.mst_module_id ;
        permission.is_active = is_active || permission.is_active;

        await permission.save();

        res.status(200).json({
            message: `Permission "${permission.permission_name}" has been successfully updated.`,
            permission
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete permission
exports.deletePermission = async (req, res) => {
    try {
        const { id } = req.params;

        const permission = await Permission.findByPk(id);
        if (!permission) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        await permission.destroy();

        res.status(200).json({ message: 'Permission deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.getPermissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Permission.findAndCountAll({
            limit,
            offset,
            order: [['mst_permission_id', 'ASC']],
            include: [
                {
                    model: Module,
                    as: 'module', // jo alias aapne belongsTo me diya tha
                    attributes: ['mst_module_id', 'module_name'] // sirf ye fields fetch karna
                }
            ]
        });

        const flattenedRows = rows.map(permission => {
            const permissionData = permission.toJSON();
            return {
                ...permissionData,
                module_name: permissionData.module?.module_name || null
            };
        });
        const totalPages = Math.ceil(count / limit);

        res.json({
            totalCount: count,
            totalPages,
            currentPage: page,
            items: flattenedRows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};