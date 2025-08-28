const sequelize = require('../../config/db')
const { Op, Sequelize } = require('sequelize');
const { body, validationResult } = require('express-validator');

const PlanModel = require('../../models/subscriptions/PlanModel');
const UserModel = require('../../models/UserModel');
const SubscriberModel = require('../../models/subscriptions/SubscriberModel');
const { SchoolModel } = require('../../models');

const mesageName = "Plan";
function parseDMY(value) {
    const parts = value.split("/");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    return (
        date &&
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year
    )
        ? date
        : null;
}

exports.validate = [
    body("email")
        .notEmpty().withMessage("Admin email is required")
        .isEmail().withMessage("Please enter a valid email"),

    body("admin_name")
        .notEmpty().withMessage("Admin name is required")
        .isLength({ min: 3 }).withMessage("Admin name must be at least 3 characters long")
        .isLength({ max: 50 }).withMessage("Admin name must not exceed 50 characters"),

    body("subscription_start")
        .notEmpty().withMessage("Subscription start date is required")
        .custom((value) => {
            if (!parseDMY(value)) {
                throw new Error("Subscription start date must be a valid date in DD/MM/YYYY format");
            }
            return true;
        }),

    body("subscription_end")
        .notEmpty().withMessage("Subscription end date is required")
        .custom((value, { req }) => {
            const startDate = parseDMY(req.body.subscription_start);
            const endDate = parseDMY(value);
            if (!endDate) throw new Error("Subscription end date must be a valid date in DD/MM/YYYY format");
            if (startDate && endDate < startDate) {
                throw new Error("Subscription end date must be greater than or equal to start date");
            }
            return true;
        }),

    body("payment_status")
        .notEmpty().withMessage("Payment status is required")
        .isIn(["pending", "success", "failed", "refunded"]).withMessage("Payment status must be one of: pending, success, failed, refunded"),

    body("mst_plan_id")
        .notEmpty().withMessage("Plan ID is required")
        .isInt().withMessage("Plan ID must be a valid integer"),

    body("trn_school_id")
        .notEmpty().withMessage("School/Branch ID is required")
        .isInt().withMessage("School/Branch ID must be a valid integer"),

    body("is_active")
        .optional()
        .isIn(["Y", "N"]).withMessage('Status must be "Y" or "N"'),
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


        const { count, rows } = await SubscriberModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'mst_plan_id',
                'trn_school_id',
                'admin_name',
                'email',
                'organization_name',
                'phone_no',
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('subscription_start'), '%d/%m/%Y'), 'subscription_start'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('subscription_end'), '%d/%m/%Y'), 'subscription_end'],
             
                'is_active',
                 [Sequelize.col('branch.school_name'), 'branch'],
                [Sequelize.col('branch.email'), 'branch_email'],
                [Sequelize.col('branch.image_path'), 'branch_image'], 
                [Sequelize.col('Plan.name'), 'plan'],
                [Sequelize.col('CreatedBy.first_name'), 'created_by'],
                [Sequelize.col('UpdatedBy.first_name'), 'updated_by']
            ],
            include: [
                { model: SchoolModel, as: 'branch', attributes: [] },
                { model: PlanModel, as: 'Plan', attributes: [] },
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

    const { id } = req.params; // mst_subscriber_id
    const {
      admin_name,
      email,
      organization_name = "test",
      phone_no,
      subscription_start,
      subscription_end,
      mst_plan_id,
      feature,
      trn_school_id,
      is_active = "Y",
    } = req.body;

    const { updated_by } = req;

    const subscriber = await SubscriberModel.findByPk(id, { transaction: t });
    if (!subscriber) {
      await t.rollback();
      return res.status(404).json({ error: "Subscriber not found" });
    }

    // 🔑 check duplicate email except self
    const existing = await SubscriberModel.findOne({
      where: {
        email,
        mst_subscriber_id: { [Op.ne]: id }
      },
      transaction: t
    });

    if (existing) {
      await t.rollback();
      return res.status(422).json({
        errors: {
          email: `Subscriber with email "${email}" already exists`
        }
      });
    }

    await subscriber.update({
      admin_name,
      email,
      organization_name,
      phone_no,
      subscription_start,
      subscription_end,
      mst_plan_id,
      feature,
      trn_school_id,
      is_active,
      updated_by
    }, { transaction: t });

    await t.commit();

    res.status(200).json({
      message: `Subscriber "${subscriber.admin_name}" has been successfully updated.`,
      data: subscriber
    });

  } catch (err) {
    await t.rollback();
    const errorMessage = err?.parent?.sqlMessage || err?.message || 'Unknown error';
    res.status(500).json({ error: errorMessage });
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
      admin_name,
      email,
      organization_name = "test",
      phone_no,
      subscription_start,
      subscription_end,
      mst_plan_id,
      feature,
      trn_school_id,
      is_active = "Y",
    } = req.body;

    const { created_by, tenant } = req;

    // 🔑 check duplicate by email
    const existing = await SubscriberModel.findOne({
      where: { email },
      transaction: t
    });

    if (existing) {
      await t.rollback();
      let me = tenant ? "for this tenant" : "";
      return res.status(422).json({
        errors: {
          email: `Subscriber with email "${email}" already exists ${me}`
        }
      });
    }

    const response = await SubscriberModel.create({
      admin_name,
      email,
      organization_name,
      phone_no,
      subscription_start,
      subscription_end,
      mst_plan_id,
      feature,
      trn_school_id,
      is_active,
      created_by
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: `Subscriber "${response.admin_name}" has been successfully created.`,
      data: response
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