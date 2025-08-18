const express = require('express');
const router = express.Router();
// const rbacController = require('../controllers/rbacController');
// const verifyToken = require('../middlewares/authMiddleware'); // agar token verify karna ho
const mediumController = require('../../controllers/academic/mediumController');
 

router.get('/list', mediumController.getMediumList); 
router.get('/', mediumController.getAllMediums);
router.post('/',mediumController.validateMedium,mediumController.createMedium );
router.put('/:id', mediumController.validateMedium,  mediumController.updateMedium );  

module.exports = router;
