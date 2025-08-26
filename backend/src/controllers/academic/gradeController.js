

const sequelize = require('../../config/db')
const { Op, Sequelize } = require('sequelize');
const { body, validationResult } = require('express-validator');
const GradeModel = require('../../models/academic/GradeModel');
const SchoolModel = require('../../models/SchoolModel');
const User = require('../../models/UserModel');
const reMessage = "Grade"
exports.validate = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('min_percentage')
        .notEmpty().withMessage('Minimum percentage is required')
        .isFloat({ min: 0, max: 100 }).withMessage('Minimum percentage must be between 0 and 100'),
    body('max_percentage')
        .notEmpty().withMessage('Maximum percentage is required')
        .isFloat({ min: 0, max: 100 }).withMessage('Maximum percentage must be between 0 and 100')
        .custom((value, { req }) => {
            if (parseFloat(value) < parseFloat(req.body.min_percentage)) {
                throw new Error('Maximum percentage must be greater than or equal to minimum percentage');
            }
            return true;
        }),

    body('remark')
        .optional()
        .isLength({ max: 100 }).withMessage('Remark must not exceed 100 characters'),
    body('trn_school_id')
        .notEmpty().withMessage('School/Branch is required'),
    body('is_active')
        .optional()
        .isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"')

];


exports.lists = async (req, res) => {
    try {
        const rows = await GradeModel.findAll({
            attributes: [
                ['mst_grade_id', 'value'],
                ['name', 'label']
            ],
            order: [['mst_grade_id', 'ASC']]
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

        const { count, rows } = await GradeModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'mst_grade_id',
                'min_percentage',
                'max_percentage',
                'name',
                'is_active',
                'trn_school_id',
                [Sequelize.col('branch.school_name'), 'branch'],
                [Sequelize.col('branch.email'), 'branch_email'],
                [Sequelize.col('branch.image_path'), 'branch_image'],
                [Sequelize.col('CreatedBy.first_name'), 'created_by'],
                [Sequelize.col('UpdatedBy.first_name'), 'updated_by']
            ],
            include: [
                { model: User, as: 'CreatedBy', attributes: [] },
                { model: User, as: 'UpdatedBy', attributes: [] },
                { model: SchoolModel, as: 'branch', attributes: [] }
            ],
            order: [['mst_grade_id', 'DESC'], ["trn_school_id", 'ASC']],
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
            min_percentage,
            max_percentage,
            trn_school_id,
            is_active = "Y",
        } = req.body;

        const { created_by, tenant } = req
        const existing = await GradeModel.findOne({ where: { name, trn_school_id }, transaction: t });

        if (existing) {
            await t.rollback();
            let me = !tenant ? "for this tenant" : "";

            return res.status(422).json({
                errors: {
                    name: `${reMessage} name "${name}" already exists ${me}`
                }
            });
        }
        const response = await GradeModel.create({
            name,
            min_percentage,
            max_percentage,
            trn_school_id,
            is_active,
            created_by
        }, { transaction: t });


        await t.commit();

        res.status(200).json({ message: `${reMessage} name "${response.name}" has been successfully created.` });

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
            min_percentage,
            max_percentage,
            trn_school_id,
            is_active = "Y",
        } = req.body;

        const { updated_by, tenant } = req;


        const response = await GradeModel.findByPk(id, { transaction: t });
        if (!response) {
            await t.rollback();
            return res.status(404).json({ message: "Data not found" });
        }

        const existing = await GradeModel.findOne({
            where: { name, trn_school_id, mst_grade_id: { [Op.ne]: id } },
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
                min_percentage,
                max_percentage,
                trn_school_id,
                trn_school_id,
                is_active,
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
        const response = await GradeModel.findByPk(id, { transaction: t });
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