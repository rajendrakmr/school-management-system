const sequelize = require('../../config/db')
const { Op, Sequelize } = require('sequelize');
const { body, validationResult } = require('express-validator');

const PlanModel = require('../../models/subscriptions/PlanModel');
const UserModel = require('../../models/UserModel');

const mesageName = "Plan";
exports.validate = [
    body('name')
        .notEmpty().withMessage('Field name is required')
        .isLength({ min: 3 }).withMessage('Field name must be at least 3 characters long')
        .isLength({ max: 50 }).withMessage('Field name must not exceed 50 characters'),
    body('code')
        .notEmpty().withMessage('Field code is required')
        .isLength({ max: 10 }).withMessage('Field code must not exceed 10 characters'),
    body('price')
        .notEmpty().withMessage('Field price is required')
        .isDecimal().withMessage('Field price must be a valid number'),
    body('currency')
        .notEmpty().withMessage('Field currency is required')
        .isLength({ max: 10 }).withMessage('Field currency must not exceed 10 characters'),
    body('billing_cycle')
        .notEmpty().withMessage('Field billing cycle is required')
        .isIn(['monthly', 'quarterly', 'yearly']).withMessage('Field billing cycle must be monthly, quarterly, or yearly'),
    body('max_student')
        .notEmpty().withMessage('Field max student is required')
        .isInt({ min: 0 }).withMessage('Field max student must be a valid number'),
    body('is_active')
        .optional()
        .isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"'),
];

exports.lists = async (req, res) => {
    try {
        let whereClause = { is_active: "Y" }
        const rows = await PlanModel.findAll({
            where: whereClause,
            attributes: [
                ['mst_plan_id', 'value'],
                ['name', 'label']
            ],
            order: [['mst_plan_id', 'ASC']]
        });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.gets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (req.trn_school_id) {
            whereClause.trn_school_id = req.trn_school_id;
        }

        const { count, rows } = await PlanModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'mst_plan_id',
                'code',
                'name',
                'description',
                'price',
                'currency',
                'max_student',
                'max_teacher',
                'billing_cycle',
                'feature',
                'trial_days',
                'is_active',
                [Sequelize.col('CreatedBy.first_name'), 'created_by'],
                [Sequelize.col('UpdatedBy.first_name'), 'updated_by']
            ],
            include: [
                { model: UserModel, as: 'CreatedBy', attributes: [] },
                { model: UserModel, as: 'UpdatedBy', attributes: [] }
            ],
            order: [['mst_plan_id', 'DESC']],
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
            code,
            description,
            price,
            trial_days,
            currency = 'USD',
            max_student = 0,
            max_teacher = 0,
            billing_cycle = 'monthly',
            feature,
            trn_school_id,
            is_active = "Y"
        } = req.body;

        const { created_by, tenant } = req;
        const existing = await PlanModel.findOne({
            where: { name },
            transaction: t
        });

        if (existing) {
            await t.rollback();
            let me = tenant ? "for this tenant" : "";
            return res.status(422).json({
                errors: {
                    code: `${mesageName} with code "${code}" already exists ${me}`
                }
            });
        }


        const response = await PlanModel.create({
            name,
            code,
            description,
            price,
            currency,
            max_student,
            max_teacher,
            billing_cycle,
            trial_days,
            // feature,
            is_active,
            created_by
        }, { transaction: t });

        await t.commit();

        res.status(201).json({
            message: `${mesageName} "${response.name}" has been successfully created.`,
            data: response
        });

    } catch (err) {
        await t.rollback();
        const errorMessage = err?.parent?.sqlMessage || err?.message || 'Unknown error';
        res.status(500).json({ error: errorMessage });
    }
};


exports.update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        // ✅ Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            await t.rollback();
            return res.status(422).json({ errors: formattedErrors });
        }

        const { id } = req.params; // mst_plan_id
        const {
            name,
            code,
            description,
            price,
            currency,
            max_student,
            max_teacher,
            billing_cycle,
            trial_days,
            is_active = "Y"
        } = req.body;

        const { updated_by } = req;

        const plan = await PlanModel.findByPk(id, { transaction: t });
        if (!plan) {
            await t.rollback();
            return res.status(404).json({ error: "Plan not found" });
        }
        if (code) {
            const existing = await PlanModel.findOne({
                where: {
                    name,
                    mst_plan_id: { [Op.ne]: id }
                },
                transaction: t
            });
            if (existing) {
                await t.rollback();
                return res.status(422).json({
                    errors: {
                        code: `${mesageName} with code "${code}" already exists`
                    }
                });
            }
        }


        await plan.update({
            name,
            code,
            description,
            price,
            currency,
            max_student,
            max_teacher,
            billing_cycle,
            // feature,
            trial_days,
            is_active,
            updated_by
        }, { transaction: t });

        await t.commit();

        res.status(200).json({
            message: `${mesageName} "${plan.name}" has been successfully updated.`,

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
        const response = await PlanModel.findByPk(id, { transaction: t });
        if (!response) {
            await t.rollback();
            return res.status(404).json({ error: `${mesageName} with id ${id} not found.` });
        }
        await response.destroy({ transaction: t });
        await t.commit();

        return res.status(200).json({
            message: `Session "${response.name}" has been successfully deleted.`
        });

    } catch (err) {
        await t.rollback();
        const errorMessage = err?.parent?.sqlMessage || err?.message || 'Unknown error';
        return res.status(500).json({ error: errorMessage });
    }
};