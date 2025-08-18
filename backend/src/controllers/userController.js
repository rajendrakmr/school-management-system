const User = require('../models/User');
const UserHasRole = require('../models/UserHasRole');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Signup / Create user
exports.signup = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
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
