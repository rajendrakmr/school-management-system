const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

// Public routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected routes
router.get('/', verifyToken, userController.getAllUsers);
router.post('/assign-role', verifyToken, userController.assignRole);

module.exports = router;
