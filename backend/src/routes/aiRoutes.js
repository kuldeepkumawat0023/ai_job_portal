const express = require('express');
const aiController = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Candidate & Admin
router.post('/chat', aiController.chatWithAI);
router.get('/chat-history', aiController.getAIChatHistory);
router.post('/match-job/:jobId', aiController.matchJobWithResume);
router.get('/coaching-tips', aiController.getCoachingTips);
router.get('/career-suggestions', aiController.getCareerSuggestions);
router.post('/interview-questions', aiController.generateInterviewQuestions);
router.post('/resume-questions/:resumeId', protect, aiController.generateResumeQuestions);
router.post('/analyze-answer', protect, aiController.analyzeInterviewAnswer);
router.post('/real-interview-feedback', protect, aiController.analyzeRealInterviewFeedback);
router.post('/optimize-portfolio', protect, aiController.optimizePortfolioContent);

// Recruiter & Admin
router.post('/generate-job-desc', authorize('recruiter', 'admin'), aiController.generateJobDescription);

module.exports = router;
