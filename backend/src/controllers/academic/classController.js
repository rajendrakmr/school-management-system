const sequelize = require('../../config/db')
const { Op, Sequelize } = require('sequelize');
const { body, validationResult } = require('express-validator');
const ClassModel = require('../../models/academic/ClassModel');
const SchoolModel = require('../../models/SchoolModel');
const User = require('../../models/User');
const SessionModel = require('../../models/academic/SessionModel');
const MediumModel = require('../../models/academic/MediumModel');
const ShiftModel = require('../../models/academic/ShiftModel');
const ClassSectionModel = require('../../models/academic/ClassSectionModel');
const SectionModel = require('../../models/academic/SectionModel');

const reMessage = "Class"
// const { body } = require('express-validator');

exports.validate = [
    body('mst_session_id')
        .notEmpty().withMessage('Session is required')
        .isInt().withMessage('Session must be a valid ID'),
    body('mst_medium_id')
        .notEmpty().withMessage('Medium is required')
        .isInt().withMessage('Medium must be a valid ID'),
    body('mst_shift_id')
        .notEmpty().withMessage('Shift is required')
        .isInt().withMessage('Shift must be a valid ID'),
    body('name')
        .notEmpty().withMessage('Class name is required')
        .isLength({ min: 3 }).withMessage('Class name must be at least 3 characters long')
        .isLength({ max: 50 }).withMessage('Class name must not exceed 50 characters'),
    body('code')
        .optional()
        .isLength({ max: 10 }).withMessage('Code must not exceed 10 characters'),
    body('trn_school_id')
        .notEmpty().withMessage('School/Branch is required')
        .isInt().withMessage('School/Branch must be a valid ID'),
    body('sections')
        .isArray({ min: 1 }).withMessage('At least one section must be selected'),
    body('sections.*')
        .isInt().withMessage('Each section must be a valid ID'),
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




// exports.gets = async (req, res) => {
//     try {
//         const { trn_school_id } = req;
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const offset = (page - 1) * limit;

//         let whereClause = {};
//         if (trn_school_id) {
//             whereClause.trn_school_id = trn_school_id;
//         }

//         const { count, rows } = await ClassModel.findAndCountAll({
//             where: whereClause,
//             limit,
//             offset,
//             attributes: [
//                 'mst_class_id',
//                 'mst_medium_id',
//                 'mst_session_id',
//                 'mst_shift_id',
//                 'name',
//                 'code',
//                 'order_no',
//                 'is_active',
//                 'trn_school_id',
//                 [Sequelize.col('shift.name'), 'shift'],
//                 [Sequelize.col('medium.name'), 'medium'],
//                 [Sequelize.col('session.name'), 'session'],
//                 [Sequelize.col('branch.school_name'), 'branch'],
//                 [Sequelize.col('branch.email'), 'branch_email'],
//                 [Sequelize.col('branch.image_path'), 'branch_image'],
//                 [Sequelize.col('CreatedBy.first_name'), 'created_by'],
//                 [Sequelize.col('UpdatedBy.first_name'), 'updated_by']
//             ],
//             include: [
//                 { model: MediumModel, as: 'medium', attributes: [] },
//                 { model: ShiftModel, as: 'shift', attributes: [] },
//                 { model: SessionModel, as: 'session', attributes: [] },
//                 { model: User, as: 'CreatedBy', attributes: [] },
//                 { model: User, as: 'UpdatedBy', attributes: [] },
//                 { model: School, as: 'branch', attributes: [] }
//             ],
//             order: [['mst_class_id', 'DESC'], ["trn_school_id", 'ASC']],
//             raw: true
//         });

//         const totalPages = Math.ceil(count / limit);

//         res.json({
//             totalCount: count,
//             totalPages,
//             currentPage: page,
//             items: rows
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };


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

        const { count, rows } = await ClassModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'mst_class_id',
                'mst_medium_id',
                'mst_shift_id',
                'mst_session_id',
                'name',
                'code',
                'is_active',
                'trn_school_id',
                [Sequelize.col('session.name'), 'session'],
                [Sequelize.col('shift.name'), 'shift'],
                [Sequelize.col('medium.name'), 'medium'],
                [Sequelize.col('branch.school_name'), 'branch'],
                [Sequelize.col('branch.email'), 'branch_email'],
                [Sequelize.col('branch.image_path'), 'branch_image'],
                [Sequelize.col('CreatedBy.first_name'), 'created_by'],
                [Sequelize.col('UpdatedBy.first_name'), 'updated_by'],
                // 🔹 JSON aggregation directly in attributes
                [Sequelize.fn('JSON_ARRAYAGG', Sequelize.col('ClassSectionModels.section.name')), 'section'],
                [Sequelize.fn('JSON_ARRAYAGG', Sequelize.col('ClassSectionModels.section.mst_section_id')), 'sections']
            ],
            include: [
                { model: MediumModel, as: 'medium', attributes: [] },
                { model: SessionModel, as: 'session', attributes: [] },
                { model: ShiftModel, as: 'shift', attributes: [] },
                { model: User, as: 'CreatedBy', attributes: [] },
                { model: User, as: 'UpdatedBy', attributes: [] },
                { model: SchoolModel, as: 'branch', attributes: [] },
                {
                    model: ClassSectionModel,
                    as: 'ClassSectionModels',
                    attributes: [],
                    include: [
                        { model: SectionModel, as: 'section', attributes: [] }
                    ]
                }
            ],
            group: ['ClassModel.mst_class_id'], // 🔹 Group by required for aggregation
            order: [['mst_class_id', 'DESC'], ['trn_school_id', 'ASC']],
            raw: true,
            subQuery: false
        });

        const totalPages = Math.ceil(count.length / limit);

        res.json({
            totalCount: count.length,
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
            mst_shift_id,
            mst_medium_id,
            mst_session_id,
            name,
            code,
            sections = [],
            is_active = 'Y',
            trn_school_id
        } = req.body;
        if (!Array.isArray(sections) || sections.length === 0) {
            return res.status(422).json({ errors: { sections: 'At least one section must be selected' } });
        }
        const existing = await ClassModel.findOne({
            where: { name, mst_medium_id, trn_school_id },
            transaction: t
        });
        if (existing) {
            return res.status(422).json({ errors: { name: `${name} already exists with same name` } });
        }


        const newClass = await ClassModel.create({
            name,
            code: code || name.slice(0, 3).toUpperCase(),
            mst_medium_id,
            mst_shift_id,
            mst_session_id,
            trn_school_id,
            is_active,
            created_by
        }, { transaction: t });

        const sectionRecords = sections.map(sectionId => ({

            mst_section_id: sectionId,
            trn_school_id,
            mst_class_id: newClass.mst_class_id,
            is_active,
            created_by
        }));

        await ClassSectionModel.bulkCreate(sectionRecords, { transaction: t });

        await t.commit();
        res.status(200).json({ message: `${reMessage} "${name}" has been successfully created for selected sections.` });

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
            name,
            code,
            mst_shift_id,
            mst_medium_id,
            mst_session_id,
            sections = [],
            is_active,
            trn_school_id
        } = req.body;
        const { id } = req.params;

        const cls = await ClassModel.findByPk(id, { transaction: t });
        if (!cls) {
            await t.rollback();
            return res.status(404).json({ error: 'Class not found' });
        }

        // 🔹 Check duplicate name (for same school + medium)
        if (name && name !== cls.name) {
            const existing = await ClassModel.findOne({
                where: {
                    name,
                    mst_medium_id,
                    trn_school_id,
                    mst_class_id: { [Op.ne]: id }
                },
                transaction: t
            });
            if (existing) {
                await t.rollback();
                return res.status(422).json({ errors: { name: `${name} already exists for this medium.` } });
            }
        }

        // 🔹 Update Class details
        cls.name = name;
        cls.code = code;
        cls.mst_session_id = mst_session_id
        cls.mst_medium_id = mst_medium_id;
        cls.mst_shift_id = mst_shift_id;
        cls.is_active = is_active;
        cls.updated_by = updated_by;
        await cls.save({ transaction: t });

        // 🔹 Update Class Sections (Replace all old sections)
        if (Array.isArray(sections) && sections.length > 0) {
            await ClassSectionModel.destroy({ where: { mst_class_id: id, trn_school_id }, transaction: t });

            const sectionRecords = sections.map(sectionId => ({
                mst_section_id: sectionId,
                trn_school_id,
                mst_class_id: cls.mst_class_id,
                is_active,
                updated_by
            }));
            await ClassSectionModel.bulkCreate(sectionRecords, { transaction: t });
        }

        await t.commit();
        res.status(200).json({
            message: `${reMessage} "${cls.name}" has been successfully updated with selected sections.`,
            data: { updatedClass: cls }
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