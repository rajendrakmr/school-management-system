const { Op } = require('sequelize');
const Medium = require('../../models/Medium');
const { body, validationResult } = require('express-validator');
const Subject = require('../../models/Subject');
const User = require('../../models/User');
const path = require('path');
const fs = require('fs');
// Validation rules for Subject creation/updation
exports.validate = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('mst_medium_id')
        .notEmpty().withMessage('Medium is required'),
    body('type')
        .notEmpty().withMessage('Subject type is required "Practical" or "Theory"')
        .isIn(['practical', 'theory']).withMessage('Type must be "Practical" or "Theory"'),
    body('is_active')
        .optional()
        .isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"')
];

// Get list of subjects (for dropdowns, etc.)
exports.lists = async (req, res) => {
    try {
        const rows = await Subject.findAll({
            attributes: [
                ['mst_subject_id', 'value'],
                ['name', 'label']
            ],
            order: [['mst_subject_id', 'ASC']]
        });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
Subject.belongsTo(Medium, { foreignKey: 'mst_medium_id' });
Subject.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
Subject.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
const { Sequelize } = require('sequelize');

exports.gets = async (req, res) => {
    try {
        const { trn_school_id } = req;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Subject.findAndCountAll({
            where: { trn_school_id },
            limit,
            offset,
            attributes: [
                'mst_subject_id',
                'trn_school_id',
                'mst_medium_id',
                'code',
                'name',
                'image_path',
                'type',
                'is_active',
                'created_by',
                'updated_by',
                [Sequelize.col('Medium.name'), 'medium_name'],
                [Sequelize.col('CreatedBy.first_name'), 'created_by'],
                [Sequelize.col('UpdatedBy.first_name'), 'updated_by']
            ],
            include: [
                { model: Medium, attributes: [] },          // just used for join
                { model: User, as: 'CreatedBy', attributes: [] },
                { model: User, as: 'UpdatedBy', attributes: [] }
            ],
            order: [['mst_subject_id', 'ASC']],
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


// Create a new Subject
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
        if (req.file) {
            const uploadsDir = path.join(__dirname, '../../../uploads/academics');
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const filename = uniqueSuffix + path.extname(req.file.originalname);
            const filepath = path.join(uploadsDir, filename);
            fs.writeFileSync(filepath, req.file.buffer);
            req.body.image_path = `/academics/${filename}`;
        }
        const { name, is_active = 'Y', mst_medium_id, type, image_path, code } = req.body;

        // Check if the subject already exists
        const existing = await Subject.findOne({ where: { name, trn_school_id, mst_medium_id } });
        if (existing) {
            return res.status(422).json({ errors: { name: `${name} already taken.` } });
        }

        await Subject.create({ name, trn_school_id, mst_medium_id, type, is_active, code, image_path, created_by });

        res.status(200).json({
            message: `Subject "${name}" has been successfully created.`
        });
    } catch (err) {
        console.log('errerr', err)
        res.status(500).json({ error: err.message });
    }
};

// Update an existing Subject
exports.update = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array().reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {})
            });
        }

        const { name, is_active, mst_medium_id, type } = req.body;
        const { trn_school_id, updated_by } = req;
        const { id } = req.params;

        const subject = await Subject.findByPk(id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        const duplicate = await Subject.findOne({
            where: {
                name,
                trn_school_id,
                mst_medium_id,
                mst_subject_id: { [Op.ne]: id }
            }
        });
        if (duplicate) return res.status(422).json({ errors: { name: `${name} already taken.` } });

        // Only save image if it exists AND validations pass
        if (req.file) {
            const uploadsDir = path.join(__dirname, '../../../uploads/academics');
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const filename = uniqueSuffix + path.extname(req.file.originalname);
            const filepath = path.join(uploadsDir, filename);

            // Write the buffer to disk
            fs.writeFileSync(filepath, req.file.buffer);
            subject.image_path = `/academics/${filename}`;
        }

        // Update other fields
        subject.name = name;
        subject.type = type;
        subject.is_active = is_active;
        subject.updated_by = updated_by;

        await subject.save();

        res.status(200).json({ message: `Subject "${subject.name}" has been successfully updated.` });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};
