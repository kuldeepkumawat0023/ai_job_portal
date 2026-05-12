const express = require('express');
const { scheduleInterview, getMyInterviews, updateInterviewStatus } = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/schedule', authorize('recruiter', 'admin'), scheduleInterview);
router.get('/my-interviews', getMyInterviews);
router.put('/:id/status', authorize('recruiter', 'admin'), updateInterviewStatus);

module.exports = router;
