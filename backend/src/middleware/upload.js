const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Storage configuration for Images (Profile Photos)
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai_job_portal/profiles',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Storage configuration for Resumes (PDFs)
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai_job_portal/resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw', // Critical for non-image files like PDF
  },
});

const uploadImage = multer({ storage: imageStorage });
const uploadResume = multer({ storage: resumeStorage });

module.exports = { uploadImage, uploadResume };
