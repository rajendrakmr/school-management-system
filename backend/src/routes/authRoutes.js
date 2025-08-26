const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
// Public routes
const { validateSignUp,validateLogin } = authController;
router.post('/signup',validateSignUp, authController.signup);
router.post('/login',validateLogin, authController.login);
 
router.post("/refresh", authController.refresh);

// Protected routes
router.get('/', verifyToken, userController.getAllUsers);
router.post('/assign-role', verifyToken, userController.assignRole);

module.exports = router;
