const { Op, Sequelize } = require('sequelize');
const { body, validationResult } = require('express-validator');
const School = require('../models/SchoolModel');
const _ = require('lodash');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
const path = require('path');
const fs = require('fs');
// Validation rules
exports.validate = [
    body('email').notEmpty().withMessage('Email ID is required'),
    body('principal_name').notEmpty().withMessage('Principal name is required'),
    body('school_name').notEmpty().withMessage('School name is required'),
    body('school_code').notEmpty().withMessage('School code is required'),
    body('is_active').optional().isIn(['Y', 'N']).withMessage('Status must be "Active" or "In Active"')
];

// Get all schools with pagination

exports.lists = async (req, res) => {
    try {
        const schools = await School.findAll({
            attributes: [
                ['trn_school_id', 'value'],
                [Sequelize.literal("CONCAT(school_name, '(', school_code, ')')"), 'label']
            ],
            order: [['trn_school_id', 'ASC']]
        });
        res.json(schools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// exports.gets = async (req, res) => {
//     try {
//         const { trn_school_id } = req
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const offset = (page - 1) * limit;
//         let whereClause = {};
//         if (trn_school_id) {
//             whereClause.trn_school_id = trn_school_id;
//         }
//         const { count, rows } = await School.findAndCountAll(
//             {
//                 where: whereClause,
//                 limit,
//                 offset,
//                 attributes: [
//                 'trn_school_id',
//                 'school_name',
//                 'email',
//                 'school_code',
//                 'city', 
//                 'state',
//                 'established_year',
//                 'type',
//                 'image_path',
//                 'is_active',
//                 ['school_name','branch'],
//                  ['email','branch_email'],
//                   ['image_path','branch_image']
//             ],
//                 order: [['trn_school_id', 'ASC']]
//             }
//         );


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

// const School = require('../models/SchoolModel');
// const User = require('../models/User');

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

        const { count, rows } = await School.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'trn_school_id',
                'school_name',
                'email',
                'principal_name',
                'school_code',
                'city',
                'state',
                'established_year',
                'type',
                'image_path',
                'is_active',
                ['school_name', 'branch'],
                ['email', 'branch_email'],
                ['image_path', 'branch_image'],
                // [Sequelize.col('users.phone'), 'mobile_no']   // ✅ flatten phone directly
            ],
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: ['phone'],    // don’t include users[] array, only expose via col()
                }
            ],
            order: [['trn_school_id', 'ASC']],
            distinct: true
        });


        // const totalPages = Math.ceil(count / limit);
        res.json({
            totalCount: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            items: rows.map(s => ({
                ...s.get(),
                phone: s.users.length > 0 ? s.users[0].phone : null   // ✅ pick first phone
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => formattedErrors[err.path] = err.msg);
            return res.status(422).json({ errors: formattedErrors });
        }

        const { principal_name, email, phone } = req.body;
        const existingSchool = await School.findOne({
            where: { school_code: req.body.school_code },
            transaction
        });
        if (existingSchool) {
            await transaction.rollback();
            return res.status(422).json({ errors: { school_code: `School code "${req.body.school_code}" already exists.` } });
        }
        if (req.file) req.body.image_path = req.file.filename;
        req.body.created_by = req.created_by;
        const schoolData = _.pick(req.body, [
            'school_name', 'principal_name', 'email', 'school_code', 'city', 'state', 'established_year',
            'type', 'is_active', 'image_path', 'created_by'
        ]);
        if (req.file) {
            const uploadsDir = path.join(__dirname, "../../uploads/logos"); // changed for consistency
            // if (!fs.existsSync(uploadsDir)) {
            //     fs.mkdirSync(uploadsDir, { recursive: true });
            // }

            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const filename = uniqueSuffix + path.extname(req.file.originalname);
            const filepath = path.join(uploadsDir, filename);

            await fs.promises.writeFile(filepath, req.file.buffer); // ✅ async

            req.body.image_path = `/logos/${filename}`; // ✅ matches dir
        }

        const newSchool = await School.create(schoolData, { transaction });
        let existUser = await User.findOne({ where: { email }, transaction });
        let newUser = null;
        if (existUser) {
            await transaction.rollback();
            return res.status(422).json({
                errors: { email: `User with email "${email}" already taken.` }
            });
        } else {
            const saltRounds = 10;
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash('Test123', saltRounds);

            newUser = await User.create({
                first_name: principal_name,
                email,
                phone,
                password_hash: hashedPassword,
                trn_school_id: newSchool.trn_school_id
            }, { transaction });
            newSchool.principal_user_id = newUser.trn_user_id;
            await newSchool.save({ transaction });
        }

        await transaction.commit();
        res.status(200).json({
            message: `"${req.body.school_name}" school has been successfully created.`,
        });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ error: err.message });
    }
};


// const path = require("path");
// const fs = require("fs");
// const { Op } = require("sequelize");

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const school = await School.findByPk(id);

        if (!school) {
            return res.status(404).json({ error: "School not found" });
        }

        // ✅ Check unique school code
        if (req.body.code && req.body.code !== school.code) {
            const existingSchool = await School.findOne({
                where: {
                    code: req.body.code,
                    id: { [Op.ne]: id } // ✅ ensure correct PK field
                }
            });
            if (existingSchool) {
                return res.status(422).json({
                    errors: { code: `School code "${req.body.code}" already exists.` }
                });
            }
        }

        // ✅ Handle logo upload if provided
        if (req.file) {
            const uploadsDir = path.join(__dirname, "../../uploads/logos"); // changed for consistency
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const filename = uniqueSuffix + path.extname(req.file.originalname);
            const filepath = path.join(uploadsDir, filename);

            await fs.promises.writeFile(filepath, req.file.buffer); // ✅ async

            req.body.image_path = `/logos/${filename}`; // ✅ matches dir
        }

        // ✅ update `updated_by` if middleware added it
        if (req.updated_by) {
            req.body.updated_by = req.updated_by;
        }

        await school.update(req.body);

        res.status(200).json({
            message: `School "${req.body.school_name || school.school_name}" has been successfully updated.`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};




// Delete a school
exports.deleteSchool = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await School.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ error: 'School not found' });

        res.status(200).json({ message: 'School deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
