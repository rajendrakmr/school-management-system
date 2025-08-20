const express = require('express');
const router = express.Router();
const rbacController = require('../controllers/accessPermission/rbacController');
const verifyToken = require('../middlewares/authMiddleware'); // agar token verify karna ho
const roleHasPermissionController = require('../controllers/accessPermission/roleHasPermissionController');
// Create role with validation
router.post(
    '/',             // optional middleware
    rbacController.validateRole, // array of validation functions
    rbacController.createRole    // actual controller function
);

router.put(
     '/:id',
                    // optional middleware
    rbacController.validateRole, // array of validation functions
    rbacController.updateRole    // actual controller function
);

// Get all roles
router.get('/', rbacController.getAllRoles);
router.get('/list', rbacController.lists); 
router.post('/assign', roleHasPermissionController.createRoleHasPermission);
router.get('/has-permissions', roleHasPermissionController.getRoleHasPermissions);

module.exports = router;
