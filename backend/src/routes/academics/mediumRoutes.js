const express = require('express');
const router = express.Router();  
const mediumController = require('../../controllers/academic/mediumController');
 

router.get('/list', mediumController.getMediumList); 
router.get('/', mediumController.getAllMediums);
router.post('/',mediumController.validateMedium,mediumController.createMedium );
router.put('/:id', mediumController.validateMedium,  mediumController.updateMedium );  

module.exports = router;
