const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const School = require('../models/School');
const _ = require('lodash');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
// Validation rules
exports.validate = [
    body('email').notEmpty().withMessage('Email ID is required'),
    body('principal_name').notEmpty().withMessage('Principal name is required'),
    body('school_name').notEmpty().withMessage('School name is required'),
    body('school_code').notEmpty().withMessage('School code is required'),
    body('is_active').optional().isIn(['Y', 'N']).withMessage('Status must be "Active" or "In Active"')
];

// Get all schools with pagination
exports.gets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await School.findAndCountAll({
            limit,
            offset,
            order: [['trn_school_id', 'ASC']]
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
    const transaction = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => formattedErrors[err.path] = err.msg);
            return res.status(422).json({ errors: formattedErrors });
        }

        const { principal_name, email } = req.body;
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
            'school_name', 'school_code', 'city', 'state', 'established_year',
            'type', 'is_active', 'image_path', 'created_by'
        ]);
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
            const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

            newUser = await User.create({
                first_name: principal_name,
                email,
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

 

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const school = await School.findByPk(id); // Find school by primary key
        if (!school) return res.status(404).json({ error: 'School not found' });

        if (req.body.code && req.body.code !== school.code) {
            const existingSchool = await School.findOne({
                where: {
                    code: req.body.code,
                    trn_school_id: { [Op.ne]: id } // exclude current school
                }
            });
            if (existingSchool) {
                return res.status(422).json({ errors: { code: `School code "${req.body.code}" already exists.` } });
            }
        }

        // Handle logo upload
        if (req.file) {
            req.body.image_path = req.file.filename;
        }
        if (req.updated_by) {
            req.body.updated_by = req.updated_by;
        }

        await school.update(req.body);
        res.status(200).json({
            message: `School "${req.body.school_name}" has been successfully updated.`,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
