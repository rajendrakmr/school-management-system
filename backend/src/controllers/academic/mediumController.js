const { Op } = require('sequelize');
const Medium = require('../../models/Medium');
const { body, validationResult } = require('express-validator');

// Validation rules for Medium creation
exports.validateCreate = [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('is_active').optional().isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"')
];

// Get all Medium options (id and name)
exports.lists = async (req, res) => {
    try {
        const rows = await Medium.findAll({
            attributes: [
                ['mst_medium_id', 'value'],
                ['name', 'label']
            ],
            order: [['mst_medium_id', 'ASC']]
        });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Paginated list of Mediums
exports.gets = async (req, res) => {
    try {
        const { trn_school_id } = req
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Medium.findAndCountAll({ where: { trn_school_id }, limit, offset, order: [['mst_medium_id', 'ASC']] });
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

// Create Medium
exports.create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            return res.status(422).json({ errors: formattedErrors });
        }
        const { trn_school_id, created_by } = req

        const { name, code, is_active = 'Y' } = req.body;
        const existing = await Medium.findOne({ where: { name, trn_school_id } });
        if (existing) {
            return res.status(422).json({ errors: { name: `${name} already taken.` } });
        }
        const name_code = name.slice(0, 3).toUpperCase();
        const response = await Medium.create({ name, code: code ? code : name_code, trn_school_id, is_active, created_by });
        res.status(200).json({
            message: `Medium "${name}" has been successfully created.`,
            item: response
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Update Medium
exports.update = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array().reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {})
            });
        }

        const { trn_school_id, updated_by } = req
        const { name, is_active } = req.body;
        const { id } = req.params;

        const medium = await Medium.findByPk(id);
        if (!medium) return res.status(404).json({ error: 'Medium not found' }); 
        if (name && name !== medium.name) {
            const existing = await Medium.findOne({
                where: {
                    name,
                    trn_school_id: trn_school_id,
                    mst_medium_id: { [Op.ne]: id }   
                }
            });
            if (existing) {
                return res.status(422).json({ errors: { name: `${name} already exists for this school.` } });
            }
        }

        // Update fields
        medium.name = name;
        medium.is_active = is_active;
        medium.updated_by = updated_by;
        await medium.save();

        res.status(200).json({
            message: `Medium "${medium.name}" has been successfully updated.`, 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

