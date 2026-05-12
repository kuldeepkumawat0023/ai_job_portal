const Interview = require('../models/Interview');
const Job = require('../models/Job');
const User = require('../models/User');
const sendEmail = require('../config/email');

// @desc    Schedule an interview
// @route   POST /api/v1/interview/schedule
// @access  Private/Recruiter
exports.scheduleInterview = async (req, res, next) => {
  try {
    const { jobId, candidateId, companyId, date, time, mode, meetingLink } = req.body;

    if (!jobId || !candidateId || !companyId || !date || !time) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Missing required fields', data: null });
    }

    const interview = await Interview.create({
      jobId,
      candidateId,
      companyId,
      date,
      time,
      mode,
      meetingLink: mode !== 'In-person' ? (meetingLink || `https://meet.google.com/${Math.random().toString(36).substring(7)}`) : null
    });

    // Notify Candidate
    const candidate = await User.findById(candidateId);
    const job = await Job.findById(jobId);

    const emailHtml = `
      <h2>Interview Scheduled!</h2>
      <p>Hello ${candidate.fullname},</p>
      <p>Your interview for the position <strong>${job.title}</strong> has been scheduled.</p>
      <ul>
        <li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Mode:</strong> ${mode}</li>
        ${interview.meetingLink ? `<li><strong>Link:</strong> <a href="${interview.meetingLink}">${interview.meetingLink}</a></li>` : ''}
      </ul>
      <p>Good luck!</p>
    `;

    sendEmail({
      email: candidate.email,
      subject: `Interview Invitation: ${job.title}`,
      html: emailHtml
    }).catch(err => console.log('Email Error:', err));

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Interview scheduled successfully',
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my interviews
// @route   GET /api/v1/interview/my-interviews
// @access  Private
exports.getMyInterviews = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.user.role === 'recruiter') {
      const Company = require('../models/Company');
      const company = await Company.findOne({ userId: req.user.id });
      if (!company) {
        return res.status(404).json({ success: false, statusCode: 404, message: 'Company profile not found for recruiter', data: null });
      }
      query = { companyId: company._id };
    } else {
      query = { candidateId: req.user.id };
    }
    
    const interviews = await Interview.find(query)
      .populate('jobId', 'title')
      .populate('candidateId', 'fullname email profilePhoto')
      .populate('companyId', 'name logo')
      .sort('-date');

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Interviews fetched successfully',
      data: interviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview status
// @route   PUT /api/v1/interview/:id/status
// @access  Private
exports.updateInterviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const interview = await Interview.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!interview) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Interview not found', data: null });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Status updated',
      data: interview
    });
  } catch (error) {
    next(error);
  }
};
