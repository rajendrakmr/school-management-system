const sequelize = require('../../config/db')
const { Op, Sequelize } = require('sequelize');
const { body, validationResult } = require('express-validator');
const StreamModel = require('../../models/academic/StreamModel');
const SchoolModel = require('../../models/SchoolModel');
const User = require('../../models/UserModel');
const SessionModel = require('../../models/academic/SessionModel'); 
const ClassModel = require('../../models/academic/ClassModel');

const reMessage = "Stream"
// const { body } = require('express-validator');

exports.validate = [
    body('mst_session_id')
        .notEmpty().withMessage('Field session is required')
        .isInt().withMessage('Field session must be a valid ID'),
    body('mst_class_id')
        .notEmpty().withMessage('Field class is required')
        .isInt().withMessage('Field class must be a valid ID'),
    body('name')
        .notEmpty().withMessage('Field name is required')
        .isLength({ min: 3 }).withMessage('Field name must be at least 3 characters long')
        .isLength({ max: 50 }).withMessage('Field name must not exceed 50 characters'),
    body('code')
        .optional()
        .isLength({ max: 10 }).withMessage('Code must not exceed 10 characters'),
    body('trn_school_id')
        .notEmpty().withMessage('Field branch is required')
        .isInt().withMessage('Field branch must be a valid ID'),
    body('is_active')
        .optional()
        .isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"')
];



exports.lists = async (req, res) => {
    try {
        const rows = await StreamModel.findAll({
            where: { is_active: "y" },
            attributes: [
                ['mst_stream_id', 'value'],
                ['name', 'label']
            ],
            order: [['mst_stream_id', 'ASC']]
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

        const { count, rows } = await StreamModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'mst_class_id',
                'mst_stream_id',
                'mst_session_id',
                'name',
                'code',
                'is_active',
                'trn_school_id',
                [Sequelize.col('class.name'), 'class'],
                [Sequelize.col('session.name'), 'session'],
                [Sequelize.col('branch.school_name'), 'branch'],
                [Sequelize.col('branch.email'), 'branch_email'],
                [Sequelize.col('branch.image_path'), 'branch_image'],
                [Sequelize.col('CreatedBy.first_name'), 'created_by'],
                [Sequelize.col('UpdatedBy.first_name'), 'updated_by'],
            ],
            include: [
                { model: SessionModel, as: 'session', attributes: [] },
                { model: ClassModel, as: 'class', attributes: [] },
                { model: User, as: 'CreatedBy', attributes: [] },
                { model: User, as: 'UpdatedBy', attributes: [] },
                { model: SchoolModel, as: 'branch', attributes: [] },

            ],

            order: [['mst_stream_id', 'DESC'], ['trn_school_id', 'ASC']],
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
            mst_session_id,
            name,
            code,
            is_active = 'Y',
            trn_school_id
        } = req.body;

        const existing = await StreamModel.findOne({
            where: { name, mst_session_id, mst_class_id, trn_school_id },
            transaction: t
        });
        if (existing) {
            return res.status(422).json({ errors: { name: `${name} already exists with same name` } });
        }


        await StreamModel.create({
            name,
            code: code || name.slice(0, 3).toUpperCase(),
            mst_class_id,
            mst_session_id,
            trn_school_id,
            is_active,
            created_by
        }, { transaction: t });



        await t.commit();
        res.status(200).json({ message: `${reMessage} "${name}" has been successfully created` });

    } catch (err) {
        await t.rollback();
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
            mst_session_id,
            name,
            code,
            is_active = 'Y',
            trn_school_id
        } = req.body;
        const { id } = req.params;

        const response = await StreamModel.findByPk(id, { transaction: t });
        if (!response) {
            await t.rollback();
            return res.status(404).json({ error: 'Session not found' });
        }


        const existing = await StreamModel.findOne({
            where: {
                name,
                mst_class_id,
                trn_school_id,
                mst_stream_id: { [Op.ne]: id }
            },
            transaction: t
        });
        if (existing) {
            await t.rollback();
            return res.status(422).json({ errors: { name: `${name} already exists for this stream.` } });
        }


        await response.update(
            {
                code: code || name.slice(0, 3).toUpperCase(),
                mst_class_id,
                mst_session_id,
                name,
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
        console.log(err)
        await t.rollback();
        const errorMessage = err?.parent?.sqlMessage || err?.message || 'Unknown error';
        res.status(500).json({ error: errorMessage });
    }
};


exports.delete = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const response = await StreamModel.findByPk(id, { transaction: t });
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