const express = require('express');
const router = express.Router();  
const mediumController = require('../controllers/academic/mediumController');
const sectionController = require('../controllers/academic/sectionController');
const subjectController = require('../controllers/academic/subjectController');
const semesterController = require('../controllers/academic/semesterController');
const streamController = require('../controllers/academic/streamController');
const shiftController = require('../controllers/academic/shiftController');
const classController = require('../controllers/academic/classController');
const sessionController = require('../controllers/academic/sessionController');
const departmentController = require('../controllers/academic/departmentController');
const periodController = require('../controllers/academic/periodController');
const gradeController = require('../controllers/academic/gradeController');



// periods
router.get('/grades', gradeController.gets);
router.post('/grades',gradeController.validate,gradeController.create );
router.get('/grades/list', gradeController.lists); 
router.put('/grades/:id', gradeController.validate, gradeController.update );  

// periods
router.get('/periods', periodController.gets);
router.post('/periods',periodController.validate,periodController.create );
router.get('/periods/list', periodController.lists); 
router.put('/periods/:id', periodController.validate, periodController.update );  

// departments
router.get('/departments', departmentController.gets);
router.post('/departments',departmentController.validate,departmentController.create );
router.get('/departments/list', departmentController.lists); 
router.put('/departments/:id', departmentController.validate, departmentController.update );  

//  session
router.get('/sessions', sessionController.gets);
router.post('/sessions',sessionController.validate,sessionController.create );
router.get('/sessions/list', sessionController.lists); 
router.put('/sessions/:id', sessionController.validate, sessionController.update );  



//  mediums
router.get('/semesters/list', semesterController.lists); 
router.get('/semesters', semesterController.gets);
router.post('/semesters',semesterController.validate,semesterController.create );
router.put('/semesters/:id', semesterController.validate, semesterController.update );  


// semester

router.get('/mediums/list', mediumController.lists); 
router.get('/mediums', mediumController.gets);
router.post('/mediums',mediumController.validate,mediumController.create );
router.put('/mediums/:id', mediumController.validate, mediumController.update );  


// Stream
router.get('/streams/list', streamController.lists); 
router.get('/streams', streamController.gets);
router.post('/streams',streamController.validate,streamController.create );
router.put('/streams/:id', streamController.validate, streamController.update ); 


// Shift time
router.get('/shifts/list', shiftController.lists); 
router.get('/shifts', shiftController.gets);
router.post('/shifts',shiftController.validate,shiftController.create );
router.put('/shifts/:id', shiftController.validate, shiftController.update ); 

router.get('/classes/list', classController.lists); 
router.get('/classes', classController.gets);
router.post('/classes',classController.validate,classController.create );
router.put('/classes/:id', classController.validate, classController.update );
const multer = require('multer');


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
