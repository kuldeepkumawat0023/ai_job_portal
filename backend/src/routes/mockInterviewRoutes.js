const express = require('express');
const { generateQuestions, submitAnswer, getInterviewResult, getMySessions } = require('../controllers/mockInterviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/generate', generateQuestions);
router.post('/:id/submit', submitAnswer);
router.get('/:id/result', getInterviewResult);
router.get('/my-sessions', getMySessions);

module.exports = router;
