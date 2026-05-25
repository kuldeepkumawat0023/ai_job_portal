const multer = require('multer');
const path = require('path');

// Memory storage — files stored as Buffer in req.file.buffer
// Optimized for streaming to Cloudinary and serverless compatibility
const storage = multer.memoryStorage();

/**
 * File filter to handle both images and resumes
 */
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpg, png, webp) and documents (pdf, doc, docx) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max limit
  fileFilter: fileFilter
});

// For backward compatibility or specific usage
const uploadImage = upload;
const uploadResume = upload;

module.exports = { upload, uploadImage, uploadResume };
