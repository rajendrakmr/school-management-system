const User = require('../models/User');
const UserHasRole = require('../models/UserHasRole');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const sequelize = require('../config/db'); 
const { Permission, Module } = require('../models');
const Role = require('../models/Role');

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


User.hasMany(UserHasRole, { foreignKey: 'trn_user_id' });
UserHasRole.belongsTo(User, { foreignKey: 'trn_user_id' });
Role.hasMany(UserHasRole, { foreignKey: 'mst_role_id' });
UserHasRole.belongsTo(Role, { foreignKey: 'mst_role_id' });

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
        const trn_user_id = user.trn_user_id
        const query = `          
                    SELECT ur.mst_role_id,
                    JSON_ARRAYAGG(rp.mst_permission_id) as permissionID
                    FROM   erp_trn_user_has_roles ur 
                    JOIN erp_mst_role_has_permissions as rp
                        ON rp.mst_role_id = ur.mst_role_id 
                    WHERE ur.trn_user_id=:trn_user_id
                    GROUP BY ur.mst_role_id;
                `;

        const menu = await sequelize.query(query, {
            replacements: { trn_user_id },
            type: sequelize.QueryTypes.SELECT
        });
        const permissionID = menu.length > 0 ? menu[0]?.permissionID : [];
        const modules = await Module.findAll({
            attributes: ['module_name', 'has_child'],
            order: [['mst_module_id', 'ASC']],
            include: [{
                model: Permission,
                as: 'permissions',
                attributes: ['permission_name', 'path_url'],
                where: {
                    mst_permission_id: permissionID
                },
                required: true,
                order: [['permissions.mst_permission_id', 'ASC']],
            }] 
        });
        const nav = modules.map(mod => {
            if (mod.has_child === 'Y' && mod.permissions.length > 0) {
                return {
                    name: mod.module_name,
                    path: `/${mod.module_name.toLowerCase().replace(/\s+/g, '-')}`,
                    icon: null,
                    children: mod.permissions.map(p => ({
                        name: p.permission_name,
                        path: p.path_url
                    }))
                };
            } else {
                return {
                    name: mod.module_name,
                    path: mod.permissions[0]?.path_url || '/',
                    icon: null, // optional
                    isParent: true
                };
            }
        });
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 12 * 60 * 60 * 1000
        });
        const currentUrl = `${req.protocol}://${req.get('host')}`;  
       const userObj = user.toJSON ? user.toJSON() : { ...user };

// Add logo URL
userObj.logo = `${currentUrl}/uploads/logos/logo.png`;

// Remove sensitive data
delete userObj.password_hash;
        res.json({ message: 'Logins successful', token, user:userObj, menu: nav });
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
