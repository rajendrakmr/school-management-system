const sequelize = require('../../config/db')
const { Op, Sequelize } = require('sequelize');
const { body, validationResult } = require('express-validator');
const SessionModel = require('../../models/academic/SessionModel');
const SchoolModel = require('../../models/SchoolModel');
const User = require('../../models/User');

const parseDMY = (value) => {
  if (!value) return false;
  const [day, month, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return !isNaN(date.getTime());
};

exports.validate = [
  body('name')
    .notEmpty().withMessage('Session name is required')
    .isLength({ min: 3 }).withMessage('Session name must be at least 3 characters long')
    .isLength({ max: 50 }).withMessage('Session name must not exceed 50 characters'),

  body('code')
    .notEmpty().withMessage('Session code is required')
    .isLength({ max: 10 }).withMessage('Code must not exceed 10 characters'),

  body('start_date')
    .notEmpty().withMessage('Start date is required')
    .custom(value => {
      if (!parseDMY(value)) throw new Error('Start date must be a valid date');
      return true;
    }),

  body('end_date')
    .notEmpty().withMessage('End date is required')
    .custom(value => {
      if (!parseDMY(value)) throw new Error('End date must be a valid date');
      return true;
    })
    .custom((value, { req }) => {
      const [sd, sm, sy] = req.body.start_date.split("/").map(Number);
      const [ed, em, ey] = value.split("/").map(Number);
      const startDate = new Date(sy, sm - 1, sd);
      const endDate = new Date(ey, em - 1, ed);

      if (endDate < startDate) {
        throw new Error('End date must be greater than or equal to Start date');
      }
      return true;
    }),

  body('trn_school_id')
    .notEmpty().withMessage('School/Branch is required'),

  body('is_active')
    .optional()
    .isIn(['Y', 'N']).withMessage('Status must be "Y" or "N"')
];
// ✅ Dropdown list (id + label)

exports.lists = async (req, res) => {
    try {
        let whereClause = { is_active: "Y" }
        if (req.query.branch_id) {
            whereClause.trn_school_id = req.query.branch_id;
        }
        if (req.body.trn_school_id) {
            whereClause.trn_school_id = req.body.trn_school_id;
        }
        const rows = await SessionModel.findAll({ 
            where:whereClause,
            attributes: [
                ['mst_session_id', 'value'],
                ['name', 'label']
            ],
            order: [['mst_session_id', 'ASC']]
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

        const { count, rows } = await SessionModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'mst_session_id',
                'code',
                'name',
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('start_date'), '%d/%m/%Y'), 'start_date'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('end_date'), '%d/%m/%Y'), 'end_date'],
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
            order: [['mst_session_id', 'DESC'], ["trn_school_id", 'ASC']],
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
            await t.rollback(); // rollback on validation error
            return res.status(422).json({ errors: formattedErrors });
        }

        const {
            name,
            code,
            start_date,
            end_date,
            trn_school_id,
            is_active = "Y"
        } = req.body;

        const { created_by, tenant } = req


        const existing = await SessionModel.findOne({ where: { code, trn_school_id }, transaction: t });

        if (existing) {
            await t.rollback();
            let me = tenant ? "for this tenant" : "";

            return res.status(422).json({
                errors: {
                    code: `Session with code "${code}" already exists ${me}`
                }
            });
        }
        const response = await SessionModel.create({
            name,
            code,
            start_date,
            end_date,
            trn_school_id,
            is_active,
            created_by
        }, { transaction: t });


        await t.commit();

        res.status(200).json({ message: `Session "${response.name}" has been successfully created.` });

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
            start_date,
            end_date,
            trn_school_id,
            is_active = "Y"
        } = req.body;

        const { updated_by, tenant } = req;


        const session = await SessionModel.findByPk(id, { transaction: t });
        if (!session) {
            await t.rollback();
            return res.status(404).json({ message: "Session not found" });
        }

        const existing = await SessionModel.findOne({
            where: { code, trn_school_id, mst_session_id: { [Op.ne]: id } },
            transaction: t
        });

        if (existing) {
            await t.rollback();
            let me = tenant ? "for this tenant" : "";
            return res.status(422).json({
                errors: {
                    code: `Another session with code "${code}" already exists ${me}`
                }
            });
        }


        await session.update(
            {
                name,
                code,
                start_date,
                end_date,
                trn_school_id,
                is_active,
                updated_by
            },
            { transaction: t }
        );

        await t.commit();

        res.status(200).json({
            message: `Session "${session.name}" has been successfully updated.`,
            data: session
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
        const session = await SessionModel.findByPk(id, { transaction: t });
        if (!session) {
            await t.rollback();
            return res.status(404).json({ error: `Session with id ${id} not found.` });
        }
        await session.destroy({ transaction: t });
        await t.commit();

        return res.status(200).json({
            message: `Session "${session.name}" has been successfully deleted.`
        });

    } catch (err) {
        await t.rollback();
        const errorMessage = err?.parent?.sqlMessage || err?.message || 'Unknown error';
        return res.status(500).json({ error: errorMessage });
    }
};