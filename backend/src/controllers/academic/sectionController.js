const { Op } = require('sequelize');
const Medium = require('../../models/Medium');
const { body, validationResult } = require('express-validator');
const Section = require('../../models/Section');
// Validation rules for Medium creation
exports.validate = [
    body('name').notEmpty().withMessage('Section name is required'),
    body('is_active').optional().isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"')
];

// Get all Medium options (id and name)
exports.lists = async (req, res) => {
    try {
        const rows = await Section.findAll({
            attributes: [
                ['mst_section_id', 'value'],
                ['name', 'label']
            ],
            order: [['mst_section_id', 'ASC']]
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

        const { count, rows } = await Section.findAndCountAll({ where: { trn_school_id }, limit, offset, order: [['mst_section_id', 'ASC']] });
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
        const { trn_school_id, created_by } = req;
        const { name, is_active = 'Y' } = req.body;
        const existing = await Section.findOne({ where: { name, trn_school_id } });
        if (existing) {
            return res.status(422).json({ errors: { name: `${name} already taken.` } });
        }

        await Section.create({ name, trn_school_id, is_active, created_by });
        res.status(200).json({
            message: `Section "${name}" has been successfully created.`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Section
exports.update = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array().reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {})
            });
        }

        const { name, is_active } = req.body;
        const { trn_school_id, created_by } = req;
        const { id } = req.params;

        const section = await Section.findByPk(id);
        if (!section) return res.status(404).json({ error: 'Section not found' });

        // Check if another section with same name exists in the same school
        const duplicate = await Section.findOne({
            where: {
                name,
                trn_school_id,
                 mst_section_id: { [Op.ne]: id } 
            }
        });
        if (duplicate) {
            return res.status(422).json({ errors: { name: `${name} already taken.` } });
        }

        section.name = name || section.name;
        section.is_active = is_active || section.is_active;
        section.created_by = created_by || section.created_by;
        await section.save();

        res.status(200).json({
            message: `Section "${name}" has been successfully updated.`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
