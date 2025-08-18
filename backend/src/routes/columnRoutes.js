const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', settingController.getColumn); 
router.post('/', settingController.updateColumn); 
// router.put('/:type', settingController.updateColumn); 
router.delete('/:id', settingController.deleteColumn); 
module.exports = router;
