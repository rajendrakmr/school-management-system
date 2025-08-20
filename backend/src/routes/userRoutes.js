const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const roleHasPermissionController = require('../controllers/accessPermission/roleHasPermissionController');
// const verifyToken = require('../middlewares/authMiddleware');

// Public routes
router.get('/list', userController.lists); 
router.get('/roles', roleHasPermissionController.getUserHasRole); 
module.exports = router;
