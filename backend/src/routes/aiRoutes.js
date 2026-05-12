const express = require('express');
const { matchJobWithResume, generateJobDescription, getCoachingTips, generateInterviewQuestions } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Candidate & Admin
router.post('/match-job/:jobId', matchJobWithResume);
router.get('/coaching-tips', getCoachingTips);
router.post('/interview-questions', generateInterviewQuestions);

// Recruiter & Admin
router.post('/generate-job-desc', authorize('recruiter', 'admin'), generateJobDescription);

module.exports = router;
