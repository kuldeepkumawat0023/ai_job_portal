const express = require('express');
const { getCandidateStats, getRecruiterStats, getRecruiterAnalytics } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/candidate', authorize('candidate', 'admin'), getCandidateStats);
router.get('/recruiter', authorize('recruiter', 'admin'), getRecruiterStats);
router.get('/analytics', authorize('recruiter', 'admin'), getRecruiterAnalytics);

module.exports = router;
