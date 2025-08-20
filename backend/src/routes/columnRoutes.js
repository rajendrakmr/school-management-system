const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/',verifyToken, settingController.getColumn); 
router.post('/',verifyToken, settingController.updateColumn); 
// router.put('/:type', settingController.updateColumn); 
router.delete('/:id',verifyToken, settingController.deleteColumn); 
module.exports = router;
