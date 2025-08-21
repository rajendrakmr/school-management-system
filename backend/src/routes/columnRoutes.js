const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController'); 

router.get('/', settingController.gets); 
router.get('/list', settingController.lists); 
router.post('/update', settingController.saveUpdateRecord);
router.post('/', settingController.update);    
// router.delete('/:id', settingController.delete); 
module.exports = router;
