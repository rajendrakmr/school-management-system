const express = require('express');
const router = express.Router();  
const planController = require('../controllers/subscriptions/planController');
const subscriberController = require('../controllers/subscriptions/subscriberController');
 

router.get('/subscribers', subscriberController.gets);
router.post('/subscribers',subscriberController.validate,subscriberController.create );
router.get('/subscribers/list', subscriberController.lists); 
router.put('/subscribers/:id', subscriberController.validate, subscriberController.update );  

// periods
router.get('/plans', planController.gets);
router.post('/plans',planController.validate,planController.create );
router.get('/plans/list', planController.lists); 
router.put('/plans/:id', planController.validate, planController.update );  




 
module.exports = router;
