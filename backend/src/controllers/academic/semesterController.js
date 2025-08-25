const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const Semester = require('../../models/Semester');
const School = require('../../models/School');
const User = require('../../models/User');
const { Sequelize } = require('sequelize');
// Validation rules for Medium creation
exports.validate = [
    body('name')
        .notEmpty().withMessage('Semester name is required')
        .isLength({ min: 3 }).withMessage('Semester name must be at least 3 characters long')
        .isLength({ max: 50 }).withMessage('Semester name must not exceed 50 characters'),,
    body('start_month').notEmpty().withMessage('Field is required'),
    body('end_month').notEmpty().withMessage('Field is required'),
    body('trn_school_id').notEmpty().withMessage('Branch is required'),
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
Semester.belongsTo(School, { as: 'branch', foreignKey: 'trn_school_id' });
Semester.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
Semester.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
exports.gets = async (req, res) => {
    try {
        const { trn_school_id } = req
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        let whereClause = {};
        if (trn_school_id) {
            whereClause.trn_school_id = trn_school_id;
        }
        const { count, rows } = await Semester.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'mst_semester_id',
                'trn_school_id', 
                'start_month',
                'name',
                'end_month', 
                'is_active',
                'created_by',
                'updated_by',
                [Sequelize.col('branch.school_name'), 'branch'],
                [Sequelize.col('branch.email'), 'branch_email'],
                [Sequelize.col('branch.image_path'), 'branch_image'], 
                [Sequelize.col('CreatedBy.first_name'), 'created_by'],
                [Sequelize.col('UpdatedBy.first_name'), 'updated_by']
            ],
            include: [         // just used for join
                { model: User, as: 'CreatedBy', attributes: [] },
                { model: User, as: 'UpdatedBy', attributes: [] },
                { model: School, as: 'branch', attributes: [] }
            ],
            order: [['mst_semester_id', 'DESC'],['trn_school_id', 'ASC']],
            raw: true
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
        const { created_by } = req;
        const { name, is_active = 'Y', start_month, end_month,trn_school_id } = req.body;
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

        const { name, is_active = 'Y', start_month, end_month ,trn_school_id} = req.body;
        const {  updated_by } = req;
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
        response.trn_school_id = trn_school_id;
        response.start_month = start_month;
        response.end_month = end_month;
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
