const { Op } = require('sequelize');
const Medium = require('../../models/Medium');
const { body, validationResult } = require('express-validator');

// Validation rules for Medium creation
exports.validateMedium = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    // body('trn_school_id').notEmpty().withMessage('School ID is required'),
    body('is_active').optional().isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"')
];

// Get all Medium options (id and name)
exports.getMediumList = async (req, res) => {
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
exports.getAllMediums = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Medium.findAndCountAll({ limit, offset, order: [['mst_medium_id', 'ASC']] });
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
exports.createMedium = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            return res.status(422).json({ errors: formattedErrors });
        }

        // Default trn_school_id is null and is_active = 'Y' if not provided
        const { name, trn_school_id = null, is_active = 'Y' } = req.body;

        const existing = await Medium.findOne({ where: { name, trn_school_id } });
        if (existing) {
            return res.status(422).json({ errors: { name: `${name} already exists.` } });
        }

        const response = await Medium.create({ name, code: name, trn_school_id, is_active });
        res.status(200).json({
            message: `Medium "${name}" has been successfully created.`,
            item: response
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Medium
exports.updateMedium = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array().reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {})
            });
        }

        const { name, is_active } = req.body;
        const { id } = req.params;

        const medium = await Medium.findByPk(id);
        if (!medium) return res.status(404).json({ error: 'Medium not found' });

        // Check for duplicate name except current medium
        if (name && name !== medium.name) {
            const existing = await Medium.findOne({
                where: {
                    name,
                    trn_school_id: medium.trn_school_id,
                    mst_medium_id: { [Op.ne]: id }  // Exclude current ID
                }
            });
            if (existing) {
                return res.status(422).json({ errors: { name: `${name} already exists for this school.` } });
            }
        }

        // Update fields
        medium.name = name || medium.name;
        medium.is_active = is_active || medium.is_active;
        await medium.save();

        res.status(200).json({
            message: `Medium "${medium.name}" has been successfully updated.`,
            item: medium
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

