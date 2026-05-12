const Application = require('../models/Application');
const Job = require('../models/Job');
const sendEmail = require('../config/email');

// @desc    Apply for a job
// @route   POST /api/v1/application/apply/:id
// @access  Private/Candidate
exports.applyJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const applicantId = req.user.id;

    if (!jobId) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Job ID is required', data: null });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Job not found', data: null });
    }

    const existingApplication = await Application.findOne({ jobId, applicantId });
    if (existingApplication) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'You have already applied for this job', data: null });
    }

    const application = await Application.create({ jobId, applicantId });

    job.applications.push(application._id);
    await job.save();

    const applicationHtmlMessage = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f7f6; }
        .content { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; }
        .header { color: #667eea; margin-bottom: 20px; }
        .details { color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2 class="header">Application Submitted!</h2>
          <h3>Hello, ${req.user.fullname}!</h3>
          <p class="details">You have successfully applied for <strong>${job.title}</strong>.</p>
          <p class="details">The recruiter will review your profile shortly. Track your status in your dashboard.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    sendEmail({
      email: req.user.email,
      subject: `Application Submitted Successfully - ${job.title}`,
      html: applicationHtmlMessage
    }).catch(err => console.log('Failed to send application email:', err));

    res.status(201).json({ success: true, statusCode: 201, message: 'Applied successfully', data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs applied by user (Candidate view)
// @route   GET /api/v1/application/applied
// @access  Private/Candidate
exports.getAppliedJobs = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicantId: req.user.id })
      .sort('-createdAt')
      .populate({ path: 'jobId', populate: { path: 'companyId', select: 'name logo' } });

    res.status(200).json({ success: true, statusCode: 200, message: 'Applied jobs fetched successfully', data: applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Kanban Pipeline for a job (Recruiter view) — grouped by status
// @route   GET /api/v1/application/pipeline/:jobId
// @access  Private/Recruiter
exports.getPipeline = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Job not found', data: null });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized', data: null });
    }

    const applications = await Application.find({ jobId })
      .populate('applicantId', 'fullname email profilePhoto resume skills experience bio')
      .sort('-createdAt');

    // Group by ATS status for Kanban board
    const pipeline = {
      pending: [],
      shortlisted: [],
      interview: [],
      hired: [],
      rejected: []
    };

    applications.forEach(app => {
      const status = app.status || 'pending';
      if (pipeline[status]) {
        pipeline[status].push(app);
      } else {
        pipeline['pending'].push(app);
      }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Kanban pipeline fetched successfully',
      data: pipeline
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applicants for a job (flat list)
// @route   GET /api/v1/application/:id/applicants
// @access  Private/Recruiter
exports.getApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: 'applications',
      populate: { path: 'applicantId', select: 'fullname email profilePhoto resume skills experience bio' },
      options: { sort: { createdAt: -1 } }
    });

    if (!job) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Job not found', data: null });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized access to applicants list', data: null });
    }

    res.status(200).json({ success: true, statusCode: 200, message: 'Applicants fetched successfully', data: job.applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (ATS: Shortlist, Interview, Hire, Reject)
// @route   PUT /api/v1/application/status/:id/update
// @access  Private/Recruiter
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    const allowedStatuses = ['pending', 'shortlisted', 'interview', 'hired', 'rejected'];
    if (!status || !allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ success: false, statusCode: 400, message: `Status must be one of: ${allowedStatuses.join(', ')}`, data: null });
    }

    const application = await Application.findById(applicationId).populate('jobId');
    if (!application) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Application not found', data: null });
    }

    if (application.jobId.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized to update application status', data: null });
    }

    application.status = status.toLowerCase();
    await application.save();

    res.status(200).json({ success: true, statusCode: 200, message: 'Application status updated successfully', data: application });
  } catch (error) {
    next(error);
  }
};
