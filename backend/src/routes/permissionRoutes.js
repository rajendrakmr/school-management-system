const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/accessPermission/permissionController');
const moduleController = require('../controllers/moduleController');
// Validation middleware
const { validatePermission } = permissionController;

// Routes for permissions
router.get('/nav', moduleController.getMenuNav); 
router.get('/menu', moduleController.getAllPermissionsTree); 
router.get('/', permissionController.getAllPermissions);          // Get all permissions
router.post('/', validatePermission, permissionController.createPermission);  // Create new permission
router.put('/:id', validatePermission, permissionController.updatePermission); // Update permission
router.delete('/:id', permissionController.deletePermission);     // Delete permission

module.exports = router;
