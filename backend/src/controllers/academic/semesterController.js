const { Op } = require('sequelize'); 
const { body, validationResult } = require('express-validator');
const Semester = require('../../models/Semester');
// Validation rules for Medium creation
exports.validate = [
    body('name').notEmpty().withMessage('Semester name is required'),
    body('start_month').notEmpty().withMessage('Field is required'),
    body('end_month').notEmpty().withMessage('Field is required'),
    body('is_active').optional().isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"')
];

// Get all Medium options (id and name)
exports.lists = async (req, res) => {
    try {
        const rows = await Semester.findAll({
            attributes: [
                ['mst_semester_id', 'value'],
                ['name', 'label']
            ],
            order: [['mst_semester_id', 'ASC']]
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

        const { count, rows } = await Semester.findAndCountAll({ where: { trn_school_id }, limit, offset, order: [['mst_semester_id', 'ASC']] });
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
        const { name, is_active = 'Y', start_month, end_month } = req.body;
        const existing = await Semester.findOne({ where: { name, trn_school_id } });
        if (existing) {
            return res.status(422).json({ errors: { name: `${name} already taken.` } });
        }

        await Semester.create({ name, trn_school_id, is_active, created_by, start_month, end_month });
        res.status(200).json({ message: `Semester "${name}" has been successfully created.` });
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
        const { trn_school_id, updated_by } = req;
        const { id } = req.params;

        const response = await Semester.findByPk(id);
        if (!response) return res.status(404).json({ error: 'Semester not found' }); 
        const duplicate = await Semester.findOne({
            where: {
                name,
                trn_school_id,
                mst_semester_id: { [Op.ne]: id }
            }
        });
        if (duplicate) {
            return res.status(422).json({ errors: { name: `${name} already taken.` } });
        }

        response.name = name;
        response.is_active = is_active;
        response.updated_by = updated_by;
        await response.save();

        res.status(200).json({
            message: `Semester "${name}" has been successfully updated.`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
