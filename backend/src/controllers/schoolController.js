const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const School = require('../models/School');
const _ = require('lodash');
// Validation rules
exports.validateSchool = [
    body('name').notEmpty().withMessage('School name is required'),
    body('code').notEmpty().withMessage('School code is required'),
    body('is_active').optional().isIn(['Y', 'N']).withMessage('Status must be "Active" or "In Active"')
];

// Get all schools with pagination
exports.getAllSchools = async (req, res) => {
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

// Create a school
exports.createSchool = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => formattedErrors[err.path] = err.msg);
            return res.status(422).json({ errors: formattedErrors });
        }

        const existingSchool = await School.findOne({ where: { code: req.body.code } });
        if (existingSchool) {
            return res.status(422).json({ errors: { code: `School code "${req.body.code}" already exists.` } });
        }
        if (req.file) {
            req.body.image_path = req.file.filename;
        }


        const response = await School.create(_.pick(req.body, [
            'name', 'code', 'principal_name', 'phone', 'email',
            'city', 'state', 'established_year', 'type', 'is_active', 'image_path'
        ]));
        res.status(200).json({ message: 'School created successfully', item: response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    // }

};

// Update a school
// const { Op } = require('sequelize');

exports.updateSchool = async (req, res) => {
    try {
        const { id } = req.params;
        const school = await School.findByPk(id); // Find school by primary key
        if (!school) return res.status(404).json({ error: 'School not found' });
        console.log("req.body", req.body)
        // Check if new code is unique (excluding current school)
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

        await school.update(req.body);
        res.status(200).json({ message: 'School updated successfully', school });

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
