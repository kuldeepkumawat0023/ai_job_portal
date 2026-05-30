const express = require('express');
const { scheduleInterview, getMyInterviews, updateInterviewStatus, submitInterviewFeedback, confirmInterest } = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/schedule', authorize('recruiter', 'admin', 'super_admin'), scheduleInterview);
router.get('/my-interviews', getMyInterviews);
router.put('/:id/status', authorize('recruiter', 'admin', 'super_admin'), updateInterviewStatus);
router.put('/:id/feedback', submitInterviewFeedback);
router.put('/:id/confirm', authorize('candidate', 'admin', 'super_admin'), confirmInterest);

module.exports = router;

