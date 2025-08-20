const User = require('../models/User');
const UserHasRole = require('../models/UserHasRole');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const { fn, col } = require('sequelize');

exports.validatePermission = [
    body('permission_name')
        .notEmpty().withMessage('Permission name is required')
        .isLength({ min: 3 }).withMessage('Permission must be at least 3 characters'),
    body('permission_description')
        .optional()
        .isLength({ max: 255 }).withMessage('Permission description cannot exceed 255 characters'),
    body('path_url')
        .optional()
        .isLength({ max: 50 }).withMessage('Path URL cannot exceed 50 characters'),
    body('is_active')
        .optional()
        .isIn(['Y', 'N']).withMessage('is_active must be "Y" or "N"')
];

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.lists = async (req, res) => {
    try {
        const { limit = 10, page = 1, search = "" } = req.query;
        const offset = (page - 1) * limit;
        const where = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};
        const { rows: users, count: total } = await User.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["created_at", "DESC"]],
            attributes: [
                ['trn_user_id', 'value'],
                [fn("concat", col("first_name"), "-", col("email")), "label"]
            ]
        });
        res.json({
            data: users,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Signup / Create user
exports.signup = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password_hash: hashedPassword
        });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(400).json({ error: 'Invalid credentials' });
        const token = jwt.sign(
            { user_id: user.trn_user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Assign role to user
exports.assignRole = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;
        const assign = await UserHasRole.create({ trn_user_id: user_id, mst_role_id: role_id });
        res.json(assign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
