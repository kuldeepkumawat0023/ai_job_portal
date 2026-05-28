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

router.get('/recommended', authorize('candidate', 'admin', 'super_admin'), checkUsageLimit, getRecommendedJobs);
router.post('/post', authorize('recruiter', 'admin', 'super_admin'), postJob);
router.get('/admin/jobs', authorize('recruiter', 'admin', 'super_admin'), getAdminJobs);
router.put('/update/:id', authorize('recruiter', 'admin', 'super_admin'), updateJob);
router.delete('/delete/:id', authorize('recruiter', 'admin', 'super_admin'), deleteJob);

router.put('/approve/:id', authorize('recruiter', 'admin', 'super_admin'), approveJob);
module.exports = router;
