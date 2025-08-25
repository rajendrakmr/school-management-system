const sequelize = require('../../config/db')
const { Op, Sequelize } = require('sequelize');
const { body, validationResult } = require('express-validator');
const MediumModel = require('../../models/academic/MediumModel');
const School = require('../../models/School');
const User = require('../../models/User');


exports.validate = [
    body('name')
        .notEmpty().withMessage('Medium name is required')
        .isLength({ min: 3 }).withMessage('Medium name must be at least 3 characters long')
        .isLength({ max: 50 }).withMessage('Medium name must not exceed 50 characters'),

    body('code')
        .isLength({ max: 10 }).withMessage('Code must not exceed 10 characters'),
    body('trn_school_id')
        .notEmpty().withMessage('School/Branch is required'),
    body('is_active')
        .optional()
        .isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"')
];


exports.lists = async (req, res) => {
    try {
        const rows = await MediumModel.findAll({
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



// ✅ Paginated list with associations
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

        const { count, rows } = await MediumModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'mst_medium_id',
                'code',
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
                { model: School, as: 'branch', attributes: [] }
            ],
            order: [['mst_medium_id', 'DESC'], ["trn_school_id", 'ASC']],
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
            trn_school_id,
            is_active = "Y"
        } = req.body;

        const { created_by, tenant } = req 
        const existing = await MediumModel.findOne({ where: { name, trn_school_id }, transaction: t });

        if (existing) {
            await t.rollback();
            let me = !tenant ? "for this tenant" : "";

            return res.status(422).json({
                errors: {
                    code: `Medium name "${name}" already exists ${me}`
                }
            });
        }
        const response = await MediumModel.create({
            name,
            code, 
            trn_school_id,
            is_active,
            created_by
        }, { transaction: t });


        await t.commit();

        res.status(200).json({ message: `Medium "${response.name}" has been successfully created.` });

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
            code, 
            trn_school_id,
            is_active = "Y"
        } = req.body;

        const { updated_by, tenant } = req;


        const response = await MediumModel.findByPk(id, { transaction: t });
        if (!response) {
            await t.rollback();
            return res.status(404).json({ message: "Data not found" });
        }

        const existing = await MediumModel.findOne({
            where: { name, trn_school_id, mst_medium_id: { [Op.ne]: id } },
            transaction: t
        });

        if (existing) {
            await t.rollback();
            let me = !tenant ? "for this tenant" : "";
            return res.status(422).json({
                errors: {
                    code: `Medium name "${name}" already exists ${me}`
                }
            });
        }


        await response.update(
            {
                name,
                code, 
                trn_school_id,
                is_active,
                updated_by
            },
            { transaction: t }
        );

        await t.commit();

        res.status(200).json({
            message: `Medium "${name}" has been successfully updated.`, 
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
        const response = await MediumModel.findByPk(id, { transaction: t });
        if (!response) {
            await t.rollback();
            return res.status(404).json({ error: `Data with id ${id} not found.` });
        }
        await response.destroy({ transaction: t });
        await t.commit();

        return res.status(200).json({
            message: `Medium "${session.name}" has been successfully deleted.`
        });

    } catch (err) {
        await t.rollback();
        const errorMessage = err?.parent?.sqlMessage || err?.message || 'Unknown error';
        return res.status(500).json({ error: errorMessage });
    }
};