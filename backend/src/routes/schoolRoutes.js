const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const path = require('path');
const multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/logos'); // folder where logos will be stored
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // file name only
    }
});

// File filter (optional, only allow images)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

// Routes
router.get('/', schoolController.gets);
router.get('/list', schoolController.lists);

// Use `upload.single('logo')` for POST & PUT
router.post('/', upload.single('logo'), schoolController.validate, schoolController.create);
router.put('/:id', upload.single('logo'), schoolController.validate, schoolController.update);

router.delete('/:id', schoolController.deleteSchool);

module.exports = router;
