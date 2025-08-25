const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const path = require('path'); 
const multer = require('multer');

// Use memory storage for now
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB max
});

// Routes
router.get('/', schoolController.gets);
router.get('/list', schoolController.lists);

router.post(
  '/',
  upload.single('logo'),
  schoolController.validate,
  schoolController.create
);

router.put(
  '/:id',
  upload.single('logo'),
  schoolController.validate,
  schoolController.update
);

// Multer error handler (for image filter / file size)
router.delete('/:id', schoolController.deleteSchool);
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes("Only image files")) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});


module.exports = router;
