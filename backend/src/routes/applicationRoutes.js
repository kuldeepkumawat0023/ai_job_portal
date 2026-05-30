const express = require('express');
const { applyJob, getAppliedJobs, getPipeline, getApplicants, updateStatus, getRecruiterApplications } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/apply/:id', applyJob);                                                      // Candidate applies
router.get('/applied', getAppliedJobs);                                                   // Candidate's applications
router.get('/recruiter/all', authorize('recruiter', 'admin', 'super_admin'), getRecruiterApplications);   // Recruiter gets all applications
router.get('/pipeline/:jobId', authorize('recruiter', 'admin', 'super_admin'), getPipeline);             // Kanban pipeline
router.get('/:id/applicants', authorize('recruiter', 'admin', 'super_admin'), getApplicants);            // Flat applicants list
router.put('/status/:id/update', authorize('recruiter', 'admin', 'super_admin'), updateStatus);          // ATS status update

module.exports = router;
