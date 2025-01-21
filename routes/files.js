const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/x-msdownload') return cb(new Error('Executable files are not allowed'));
    cb(null, true);
  },
});

router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    const file = await File.create({
      filename: req.file.filename,
      filepath: req.file.path,
      uploadedBy: req.user.id,
    });
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
