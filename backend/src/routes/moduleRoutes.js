const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
 
router.get('/list', moduleController.getAllModules);    // Delete permission

module.exports = router;
