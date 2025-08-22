const { Op } = require('sequelize');
const Role = require('../../models/Role');
const { body, validationResult } = require('express-validator');

exports.validateRole = [
    body('role_name')
        .notEmpty().withMessage('Role name is required')
        .isLength({ min: 3 }).withMessage('Role name must be at least 3 characters'),
    body('role_description')
        .optional()
        .isLength({ max: 255 }).withMessage('Role description cannot exceed 255 characters'),
    body('isActive')
        .optional()
        .isIn(['Y', 'N']).withMessage('isActive must be "Y" or "N"')
];

exports.lists = async (req, res) => {
    try {

        const { rows } = await Role.findAndCountAll({
            attributes: [
                ['mst_role_id', 'value'],
                ['role_name', 'label'],
            ],
            order: [['mst_role_id', 'ASC']]
        });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};

exports.getAllRoles = async (req, res) => {
    try {
        console.log(req.params)

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        let where = {}; 
        if (req.query.name) { 
            where.role_name = { [Op.like]: `%${req.query.name}%` };
        }
        if (req.query.desc) { 
            where.role_description = { [Op.like]: `%${req.query.desc}%` };
        }
        const { count, rows } = await Role.findAndCountAll({
            limit,
            offset,
            where,
            order: [['mst_role_id', 'ASC']]
        });
        const totalPages = Math.ceil(count / limit);
        res.json({
            totalCount: count,
            totalPages,
            currentPage: page,
            items: rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.createRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            return res.status(422).json({ errors: formattedErrors });
        }

        const { role_name, role_description } = req.body;
        const tag = role_name.trim().toLowerCase().replace(/\s+/g, "-");
        const existingRole = await Role.findOne({ where: { role_name } });
        if (existingRole) {
            return res.status(422).json({ errors: { role_name: `${role_name} is already taken.` } });
        }
        const newRole = await Role.create({ role_name, role_description, tag, is_default: "N" });
        res.status(200).json({
            message: `Role "${role_name}" has been successfully created.`,
            role: newRole
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            return res.status(422).json({ errors: formattedErrors });
        }

        const { role_name, role_description, is_active } = req.body;
        const { id } = req.params;

        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }
        if (role_name && role_name !== role.role_name) {
            const existingRole = await Role.findOne({
                where: {
                    role_name,
                    mst_role_id: { [Op.ne]: id }
                }
            });
            if (existingRole) {
                return res.status(422).json({ errors: { role_name: `${role_name} is already taken.` } });
            }
        }

        role.role_name = role_name
        role.role_description = role_description
        role.isActive = is_active

        await role.save();

        res.status(200).json({
            message: `Role "${role.role_name}" has been successfully updated.`,
            role: {
                id: role.mst_role_id,
                name: role.role_name,
                description: role.role_description,
                isActive: role.isActive
            }
        });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};