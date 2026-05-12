const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const companyRoutes = require('./companyRoutes');
const jobRoutes = require('./jobRoutes');
const applicationRoutes = require('./applicationRoutes');
const aiRoutes = require('./aiRoutes');
const paymentRoutes = require('./paymentRoutes');
const mockInterviewRoutes = require('./mockInterviewRoutes');
const resumeRoutes = require('./resumeRoutes');
const chatRoutes = require('./chatRoutes');
const interviewRoutes = require('./interviewRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

// Mount routes
router.use('/user', authRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/company', companyRoutes);
router.use('/job', jobRoutes);
router.use('/application', applicationRoutes);
router.use('/ai', aiRoutes);
router.use('/payment', paymentRoutes);
router.use('/mock-interview', mockInterviewRoutes);
router.use('/resume', resumeRoutes);
router.use('/chat', chatRoutes);
router.use('/interview', interviewRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
