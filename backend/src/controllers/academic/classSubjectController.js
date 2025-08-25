const sequelize = require('../../config/db')
const { Op, Sequelize } = require('sequelize');
const { body, validationResult } = require('express-validator');
const ClassModel = require('../../models/academic/ClassModel');
const SchoolModel = require('../../models/SchoolModel');
const User = require('../../models/User');
const SessionModel = require('../../models/academic/SessionModel');  
const ClassSubjectModel = require('../../models/academic/ClassSubject');
const SubjectModel = require('../../models/academic/SubjectModel');

const reMessage = "Class subject"
exports.validate = [
    body('mst_session_id')
        .notEmpty().withMessage('Field session is required')
        .isInt().withMessage('Field session must be a valid ID'),

    body('mst_class_id')
        .notEmpty().withMessage('Field class is required')
        .isInt().withMessage('Field class must be a valid ID'),

    body('mst_subject_id')
        .notEmpty().withMessage('Field subject is required')
        .isInt().withMessage('Field subject must be a valid ID'),

    body('theory_marks')
        .notEmpty().withMessage('Field theory marks are required')
        .isInt({ min: 0, max: 100 }).withMessage('Field theory marks must be between 0 and 100'),

    body('practical_marks')
        .notEmpty().withMessage('Field practical marks are required')
        .isInt({ min: 0, max: 100 }).withMessage('Field practical marks must be between 0 and 100'),

    body('max_marks')
        .notEmpty().withMessage('Field full marks are required')
        .isInt({ min: 0, max: 100 }).withMessage('Field full marks must be between 0 and 100'),

    body('name')
        .notEmpty().withMessage('Field name is required')
        .isLength({ min: 3, max: 50 }).withMessage('Field name must be between 3 and 50 characters'),

    body('code')
        .optional()
        .isLength({ max: 10 }).withMessage('Field code must not exceed 10 characters'),

    body('trn_school_id')
        .notEmpty().withMessage('Field branch is required')
        .isInt().withMessage('Field branch must be a valid ID'),

    body('is_active')
        .optional()
        .isIn(['Y', 'N']).withMessage('Field status must be "Y" or "N"')
];




exports.lists = async (req, res) => {
    try {
        let whereClause = { is_active: "Y" }
        if (req.query.session_id) {
            whereClause.mst_session_id = req.query.session_id;
        }
        if (req.body.trn_school_id) {
            whereClause.trn_school_id = req.body.trn_school_id;
        }
        const rows = await ClassModel.findAll({
            where: whereClause,
            attributes: [
                ['mst_class_id', 'value'],
                ['name', 'label']
            ],
            order: [['mst_class_id', 'ASC']]
        });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.gets = async (req, res) => {
    try {
        const { trn_school_id } = req;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (trn_school_id) {
            whereClause.trn_school_id = trn_school_id;
        }

        const { count, rows } = await ClassSubjectModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'mst_class_subject_id',
                'mst_class_id',
                'mst_subject_id',
                'mst_stream_id',
                'mst_session_id',
                'name',
                'code',
                'theory_marks',
                'max_marks',
                'is_optional',
                'practical_marks',
                'is_active',
                'trn_school_id',
                [Sequelize.col('session.name'), 'session'],
                [Sequelize.col('class.name'), 'class'],
                [Sequelize.col('subject.name'), 'subject'],
                [Sequelize.col('branch.school_name'), 'branch'],
                [Sequelize.col('branch.email'), 'branch_email'],
                [Sequelize.col('branch.image_path'), 'branch_image'],
                [Sequelize.col('CreatedBy.first_name'), 'created_by'],
                [Sequelize.col('UpdatedBy.first_name'), 'updated_by']
            ],
            include: [
                { model: SubjectModel, as: 'subject', attributes: [] },
                { model: ClassModel, as: 'class', attributes: [] },
                { model: SessionModel, as: 'session', attributes: [] },
                { model: User, as: 'CreatedBy', attributes: [] },
                { model: SchoolModel, as: 'branch', attributes: [] },
                { model: User, as: 'UpdatedBy', attributes: [] },

            ],
            // group: ['ClassModel.mst_class_id'], // 🔹 Group by required for aggregation
            order: [['mst_class_id', 'DESC'], ['trn_school_id', 'ASC']],
            raw: true,
            subQuery: false
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

// ------------------- Create Class -------------------
exports.create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array().reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {})
            });
        }

        const { created_by } = req;
        const {
            mst_class_id,
            mst_subject_id,
            mst_session_id,
            mst_stream_id = null,
            name,
            code,
            theory_marks,
            max_marks,
            practical_marks,
            is_active = 'Y',
            trn_school_id
        } = req.body;

        const existing = await ClassSubjectModel.findOne({
            where: { name, mst_class_id, mst_subject_id, trn_school_id },
            transaction: t
        });
        if (existing) {
            return res.status(422).json({ errors: { name: `${name} with class,subject already exists with same name` } });
        }


        await ClassSubjectModel.create({
            code: code || name.slice(0, 3).toUpperCase(),
            mst_class_id,
            mst_subject_id,
            mst_session_id,
            mst_stream_id,
            name,
            code,
            theory_marks,
            max_marks,
            practical_marks,
            is_active,
            trn_school_id,
            created_by
        }, { transaction: t });

        await t.commit();
        res.status(200).json({ message: `${reMessage} "${name}" has been successfully created for selected sections.` });

    } catch (err) {
        await t.rollback();
        console.log(err)
        const errorMessage = err?.parent?.sqlMessage || err?.message || 'Unknown error';
        res.status(500).json({ error: errorMessage });
    }
};

// ------------------- Update Class -------------------
exports.update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array().reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {})
            });
        }

        const { updated_by } = req;
        const {
            mst_class_id,
            mst_subject_id,
            mst_session_id,
            mst_stream_id = null,
            name,
            code,
            theory_marks,
            max_marks,
            practical_marks,
            is_active = 'Y',
            trn_school_id
        } = req.body;
        const { id } = req.params;

        const response = await ClassSubjectModel.findByPk(id, { transaction: t });
        if (!response) {
            await t.rollback();
            return res.status(404).json({ error: 'Class not found' });
        }


        const existing = await ClassSubjectModel.findOne({
            where: {
                name, mst_class_id, mst_subject_id, trn_school_id,
                mst_class_subject_id: { [Op.ne]: id }
            },
            transaction: t
        });
        if (existing) {
            await t.rollback();
            return res.status(422).json({ errors: { name: `${name} with class,subject already exists with same name` } });
        }


        await response.update(
            {
                code: code || name.slice(0, 3).toUpperCase(),
                mst_class_id,
                mst_subject_id,
                mst_session_id,
                mst_stream_id,
                name,
                code,
                theory_marks,
                max_marks,
                practical_marks,
                is_active,
                trn_school_id,
                updated_by
            },
            { transaction: t }
        );

      
 

        await t.commit();
        res.status(200).json({
            message: `${reMessage} "${name}" has been successfully updated.`, 
        });

    } catch (err) {
        await t.rollback();
        const errorMessage = err?.parent?.sqlMessage || err?.message || 'Unknown error';
        res.status(500).json({ error: errorMessage });
    }
};


exports.delete = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const response = await ClassModel.findByPk(id, { transaction: t });
        if (!response) {
            await t.rollback();
            return res.status(404).json({ error: `Data with id ${id} not found.` });
        }
        await response.destroy({ transaction: t });
        await t.commit();

        return res.status(200).json({
            message: `${reMessage} "${session.name}" has been successfully deleted.`
        });

    } catch (err) {
        await t.rollback();
        const errorMessage = err?.parent?.sqlMessage || err?.message || 'Unknown error';
        return res.status(500).json({ error: errorMessage });
    }
};