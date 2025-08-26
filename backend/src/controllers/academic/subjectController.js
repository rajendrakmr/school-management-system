const sequelize = require('../../config/db')
const { Op, Sequelize } = require('sequelize');
const { body, validationResult } = require('express-validator');
// const SubjectModel = require('../../models/academic/SubjectModel');
// const SchoolModel = require('../models/SchoolModel');
const User = require('../../models/UserModel');
const DepartmentModel = require('../../models/academic/DepartmentModel');
const SubjectModel = require('../../models/academic/SubjectModel');
const SchoolModel = require('../../models/SchoolModel');
 
const reMessage = "Subject"
exports.validate = [
    body('name')
        .notEmpty().withMessage('Subject name is required')
        .isLength({ min: 3 }).withMessage('Subject name must be at least 3 characters long')
        .isLength({ max: 50 }).withMessage('Subject name must not exceed 50 characters'),
  body('mst_department_id')
        .notEmpty().withMessage('Department is required'),
    body('code')
        .notEmpty().withMessage('Subject Code is is required')
        .isLength({ max: 10 }).withMessage('Subject Code must not exceed 10 characters'),
    body('trn_school_id').notEmpty().withMessage('School/Branch is required'),
    body('is_active')
        .optional()
        .isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"')
];


exports.lists = async (req, res) => {
    try {
         let whereClause = { is_active: "Y" }
        if (req.query.branch_id) {
            whereClause.trn_school_id = req.query.branch_id;
        }
        if (req.body.trn_school_id) {
            whereClause.trn_school_id = req.body.trn_school_id;
        }
        const rows = await SubjectModel.findAll({
            where:whereClause,
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

        const { count, rows } = await SubjectModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'mst_subject_id', 
                'mst_department_id',
                'code',
                'practical_marks',
                'theory_marks',
                'max_marks',
                'name',
                'is_active',
                'trn_school_id', 
                 [Sequelize.col('subject_type'), 'type'],
                [Sequelize.col('department.name'), 'department'],
                [Sequelize.col('branch.school_name'), 'branch'],
                [Sequelize.col('branch.email'), 'branch_email'],
                [Sequelize.col('branch.image_path'), 'branch_image'],
                [Sequelize.col('CreatedBy.first_name'), 'created_by'],
                [Sequelize.col('UpdatedBy.first_name'), 'updated_by']
            ],
            include: [
                // { model: MediumModel, as: 'medium', attributes: [] },
                { model: DepartmentModel, as: 'department', attributes: [] },
                { model: User, as: 'CreatedBy', attributes: [] },
                { model: User, as: 'UpdatedBy', attributes: [] },
                { model: SchoolModel, as: 'branch', attributes: [] }
            ],
            order: [['mst_subject_id', 'DESC'], ["trn_school_id", 'ASC']],
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
            max_marks = null,
            practical_marks = null,
            theory_marks = null,
            type,
            trn_school_id,
            is_active = "Y",
            mst_department_id,
        } = req.body;

        const { created_by, tenant } = req
        const existing = await SubjectModel.findOne({ where: { mst_department_id,name, trn_school_id }, transaction: t });

        if (existing) {
            await t.rollback();
            let me = !tenant ? "for this tenant" : "";

            return res.status(422).json({
                errors: {
                    name: `${reMessage} name "${name}" already exists ${me}`
                }
            });
        }
        const response = await SubjectModel.create({
            max_marks,
            practical_marks,
            theory_marks,
            name,
            code,
            trn_school_id,
            mst_department_id,
            subject_type:type,
            is_active,
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
            type,
            name,
            code,
            max_marks = null,
            practical_marks = null,
            theory_marks = null,
            trn_school_id,
            is_active = "Y",
            mst_department_id
        } = req.body;

        const { updated_by, tenant } = req;


        const response = await SubjectModel.findByPk(id, { transaction: t });
        if (!response) {
            await t.rollback();
            return res.status(404).json({ message: "Data not found" });
        }

        const existing = await SubjectModel.findOne({
            where: { name,mst_department_id, trn_school_id, mst_subject_id: { [Op.ne]: id } },
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
                subject_type:type,
                max_marks,
                practical_marks,
                theory_marks,
                name,
                code,
                trn_school_id,
                mst_department_id,
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
        const response = await SubjectModel.findByPk(id, { transaction: t });
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