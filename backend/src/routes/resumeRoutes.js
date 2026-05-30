const express = require('express');
const { uploadResume, analyzeResume, getResumeHistory, getMyResumes, deleteResume, setDefaultResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { checkUsageLimit } = require('../controllers/paymentController');
const { getCloudinarySignature } = require('../controllers/cloudinarySign');

const router = express.Router();

router.use(protect);

router.get('/cloudinary-sign', getCloudinarySignature); // Generate signed params for direct browser→Cloudinary upload
router.post('/upload', uploadResume);                   // Now accepts JSON { fileUrl } instead of multipart file
router.post('/analyze/:id', checkUsageLimit, analyzeResume);      // /resume/analyze/:id — AI analysis
router.get('/history', getResumeHistory);         // /resume/history — analyzed resumes
router.get('/my-resumes', getMyResumes);
router.put('/set-default/:id', setDefaultResume);
router.delete('/:id', deleteResume);

module.exports = router;
