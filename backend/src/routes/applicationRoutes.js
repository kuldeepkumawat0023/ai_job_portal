const express = require('express');
const { applyJob, getAppliedJobs, getPipeline, getApplicants, updateStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/apply/:id', applyJob);                                                      // Candidate applies
router.get('/applied', getAppliedJobs);                                                   // Candidate's applications
router.get('/pipeline/:jobId', authorize('recruiter', 'admin'), getPipeline);             // Kanban pipeline
router.get('/:id/applicants', authorize('recruiter', 'admin'), getApplicants);            // Flat applicants list
router.put('/status/:id/update', authorize('recruiter', 'admin'), updateStatus);          // ATS status update

module.exports = router;
