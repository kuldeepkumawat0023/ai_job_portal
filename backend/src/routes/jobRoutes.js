const express = require('express');
const { postJob, getAllJobs, getJobById, getAdminJobs, updateJob, deleteJob, approveJob, getRecommendedJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');
const { checkUsageLimit } = require('../controllers/paymentController');

const router = express.Router();

// Public routes
router.get('/all', getAllJobs); // General fetch, but we'll track if logged in via controller
router.get('/get/:id', getJobById);

// Protected routes
router.use(protect);

router.get('/recommended', authorize('candidate', 'admin'), checkUsageLimit, getRecommendedJobs);
router.post('/post', authorize('recruiter', 'admin'), postJob);
router.get('/admin/jobs', authorize('recruiter', 'admin'), getAdminJobs);
router.put('/update/:id', authorize('recruiter', 'admin'), updateJob);
router.delete('/delete/:id', authorize('recruiter', 'admin'), deleteJob);

router.put('/approve/:id', authorize('recruiter', 'admin'), approveJob);
module.exports = router;
