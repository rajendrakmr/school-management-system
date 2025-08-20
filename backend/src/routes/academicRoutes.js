const express = require('express');
const router = express.Router();  
const mediumController = require('../controllers/academic/mediumController');
const sectionController = require('../controllers/academic/sectionController');
const subjectController = require('../controllers/academic/subjectController');
const semesterController = require('../controllers/academic/semesterController');



//  mediums
router.get('/semesters/list', semesterController.lists); 
router.get('/semesters', semesterController.gets);
router.post('/semesters',semesterController.validate,semesterController.create );
router.put('/semesters/:id', semesterController.validate, semesterController.update );  


// semester

router.get('/mediums/list', mediumController.lists); 
router.get('/mediums', mediumController.gets);
router.post('/mediums',mediumController.validateCreate,mediumController.create );
router.put('/mediums/:id', mediumController.validateCreate, mediumController.update );  

const path = require('path');
const multer = require('multer');

// Set storage engine
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/academics'); // folder where logos will be stored
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname)); // file name only
//     }
// });

// // File filter (optional, only allow images)
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed!'), false);
//     }
// };
const storage = multer.memoryStorage(); // store file in memory temporarily
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
};
const upload = multer({ storage, fileFilter });


// const upload = multer({ storage, fileFilter });

router.get('/subjects/list', subjectController.lists); 
router.get('/subjects', subjectController.gets);
router.post('/subjects',upload.single('image'),subjectController.validate,subjectController.create );
router.put('/subjects/:id',upload.single('image'), subjectController.validate, subjectController.update );  

router.get('/sections/list', sectionController.lists); 
router.get('/sections', sectionController.gets);
router.post('/sections',sectionController.validate,sectionController.create );
router.put('/sections/:id', sectionController.validate, sectionController.update );  

module.exports = router;
