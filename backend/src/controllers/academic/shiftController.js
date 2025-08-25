const sequelize = require('../../config/db')
const { Op, Sequelize } = require('sequelize');
const { body, validationResult } = require('express-validator');
const ShiftModel = require('../../models/academic/ShiftModel');
const School = require('../../models/School');
const User = require('../../models/User');
const SessionModel = require('../../models/academic/SessionModel');

const reMessage = "Shift"
exports.validate = [
    body('mst_session_id').notEmpty().withMessage('Session is required'),  
    body('name')
        .notEmpty().withMessage('Shift name is required')
        .isLength({ min: 3 }).withMessage('Shift name must be at least 3 characters long')
        .isLength({ max: 50 }).withMessage('Shift name must not exceed 50 characters'),

    body('start_time')
        .notEmpty().withMessage('Start time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
        .withMessage('Start time must be in HH:mm or HH:mm:ss format'),

    body('end_time')
        .notEmpty().withMessage('End time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
        .withMessage('End time must be in HH:mm or HH:mm:ss format')
        .custom((value, { req }) => {
            const normalize = (time) => time.length === 5 ? time + ':00' : time; // HH:mm → HH:mm:ss
            const start = new Date(`1970-01-01T${normalize(req.body.start_time)}`);
            const end = new Date(`1970-01-01T${normalize(value)}`);

            if (end <= start) {
                throw new Error('End time must be greater than Start time');
            }
            return true;
        }),

    body('trn_school_id')
        .notEmpty().withMessage('School/Branch is required'),

    body('is_active')
        .optional()
        .isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"')
];



exports.lists = async (req, res) => {
    try {
         let whereClause = { is_active: "Y" }
        if (req.query.session_id) {
            whereClause.mst_session_id = req.query.session_id;
        }
        const rows = await ShiftModel.findAll({
            where:whereClause,
            attributes: [
                ['mst_shift_id', 'value'],
                ['name', 'label']
            ],
            order: [['mst_shift_id', 'ASC']]
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

        const { count, rows } = await ShiftModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'mst_shift_id',
                'mst_session_id',
                'name',
                'start_time',
                'end_time',
                'is_active',
                'trn_school_id',
                [Sequelize.col('session.name'), 'session'],
                [Sequelize.col('branch.school_name'), 'branch'],
                [Sequelize.col('branch.email'), 'branch_email'],
                [Sequelize.col('branch.image_path'), 'branch_image'],
                [Sequelize.col('CreatedBy.first_name'), 'created_by'],
                [Sequelize.col('UpdatedBy.first_name'), 'updated_by']
            ],
            include: [
                { model: SessionModel, as: 'session', attributes: [] },
                { model: User, as: 'CreatedBy', attributes: [] },
                { model: User, as: 'UpdatedBy', attributes: [] },
                { model: School, as: 'branch', attributes: [] }
            ],
            order: [['mst_shift_id', 'DESC'], ["trn_school_id", 'ASC']],
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
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            await t.rollback();
            return res.status(422).json({ errors: formattedErrors });
        }

        const {
            name,
            mst_session_id,
            trn_school_id,
            is_active = "Y",
            start_time = "",
            end_time = ""
        } = req.body;

        const { created_by, tenant } = req
        const existing = await ShiftModel.findOne({ where: { name,mst_session_id, trn_school_id }, transaction: t });

        if (existing) {
            await t.rollback();
            let me = !tenant ? "for this tenant" : "";

            return res.status(422).json({
                errors: {
                    name: `${reMessage} name "${name}" already exists ${me}`
                }
            });
        }
        const response = await ShiftModel.create({
            name,
            trn_school_id,
            is_active,
            start_time,
            mst_session_id,
            end_time,
            created_by
        }, { transaction: t });


        await t.commit();

        res.status(200).json({ message: `${reMessage} "${response.name}" has been successfully created.` });

    } catch (err) {
        await t.rollback();
        const errorMessage = err?.parent?.sqlMessage || err?.message || 'Unknown error';
        res.status(500).json({ error: errorMessage });
    }
};

exports.update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            await t.rollback();
            return res.status(422).json({ errors: formattedErrors });
        }

        const { id } = req.params;
        const {
            name,
            start_time,
            end_time,
            trn_school_id,
            is_active = "Y",
            mst_session_id
        } = req.body;

        const { updated_by, tenant } = req;


        const response = await ShiftModel.findByPk(id, { transaction: t });
        if (!response) {
            await t.rollback();
            return res.status(404).json({ message: "Data not found" });
        }

        const existing = await ShiftModel.findOne({
            where: { name, mst_session_id,trn_school_id, mst_shift_id: { [Op.ne]: id } },
            transaction: t
        });

        if (existing) {
            await t.rollback();
            let me = !tenant ? "for this tenant" : "";
            return res.status(422).json({
                errors: {
                    name: `${reMessage} name "${name}" already exists ${me}`
                }
            });
        }


        await response.update(
            {
                name,
                trn_school_id,
                mst_session_id,
                is_active,
                start_time,
                end_time,
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
        const errorMessage = err?.parent?.sqlMessage || err?.message || "Unknown error";
        res.status(500).json({ error: errorMessage });
    }
};


exports.delete = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const response = await ShiftModel.findByPk(id, { transaction: t });
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