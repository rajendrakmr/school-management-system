const User = require('../models/User');
const UserHasRole = require('../models/UserHasRole');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const sequelize = require('../config/db');

exports.validateSignUp = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email formate'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('first_name')
        .notEmpty().withMessage('First name is required')
        .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
    body('last_name')
        .notEmpty().withMessage('Last name is required')
        .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
];

exports.validateLogin = [
    body('email').notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];


// Signup / Create user
exports.signup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { first_name, last_name, email, password, mst_role_id } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            return res.status(422).json({ errors: formattedErrors });
        }
        const existRes = await User.findOne({ where: { email }, transaction: t });
        if (existRes) {
            return res.status(422).json({ errors: { email: `${email} is already taken.` } });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // create user within transaction
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password_hash: hashedPassword
        }, { transaction: t });

        // assign role within transaction
        if (mst_role_id) {
            await UserHasRole.create({
                mst_role_id,
                trn_user_id: newUser.trn_user_id
            }, { transaction: t });
        }


        await t.commit(); // commit if all succeed

        res.status(200).json({
            message: `Account "${email}" has been successfully created.`
        });
    } catch (err) {
        await t.rollback(); // rollback on error
        res.status(500).json({ error: err.message });
    }
}

// Login user
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const { validationResult } = require('express-validator');
// const User = require('../models/User');

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });
            return res.status(422).json({ errors: formattedErrors });
        }

        const { email, password } = req.body;
        const user = await User.findOne({
            where: { email },
            attributes: ['trn_user_id', 'email', "trn_school_id", "password_hash", "first_name", "last_name", "phone"]
        });

        if (!user) {
            return res.status(422).json({
                errors: { email: 'Please enter registered email.' }
            });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(422).json({
                errors: { password: `Password does not match with ${email}` }
            });
        }



        // Generate JWT
        const token = jwt.sign({ trn_user_id: user.trn_user_id, trn_school_id: user?.trn_school_id || null, password_hash: user.password_hash }, process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 12 * 60 * 60 * 1000
        });
        res.json({ message: 'Login successful', token, user });
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
