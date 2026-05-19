const Interview = require('../models/Interview');
const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');
const Application = require('../models/Application');
const sendEmail = require('../config/email');

// @desc    Schedule an interview
// @route   POST /api/v1/interview/schedule
// @access  Private/Recruiter
exports.scheduleInterview = async (req, res, next) => {
  try {
    const { jobId, candidateId, date, time, mode, meetingLink, interviewer } = req.body;

    if (!jobId || !candidateId || !date || !time) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Missing required fields: jobId, candidateId, date, time', data: null });
    }

    // Auto-resolve companyId: first from job, then from recruiter's company profile
    let resolvedCompanyId = req.body.companyId || null;

    if (!resolvedCompanyId) {
      // Try to get companyId from the job itself
      const job = await Job.findById(jobId).select('companyId postedBy');
      if (job && job.companyId) {
        resolvedCompanyId = job.companyId;
      } else {
        // Fallback: get from recruiter's own company profile
        const recruiterCompany = await Company.findOne({ userId: req.user.id }).select('_id');
        if (recruiterCompany) {
          resolvedCompanyId = recruiterCompany._id;
        }
      }
    }

    if (!resolvedCompanyId) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'No company profile found. Please create a company profile first.', data: null });
    }

    const interview = await Interview.create({
      jobId,
      candidateId,
      companyId: resolvedCompanyId,
      date,
      time,
      mode: 'Google Meet',
      meetingLink: meetingLink || `https://meet.google.com/${Math.random().toString(36).substring(3, 6)}-${Math.random().toString(36).substring(3, 7)}-${Math.random().toString(36).substring(3, 6)}`,
      interviewer: interviewer || 'Recruiter'
    });

    // Auto-update Application status to 'interview' so FeedbackView shows this candidate
    await Application.findOneAndUpdate(
      { jobId, applicantId: candidateId },
      { status: 'interview' },
      { new: true }
    );

    // Notify Candidate
    const candidate = await User.findById(candidateId);
    const jobDoc = await Job.findById(jobId);
    const companyDoc = await Company.findById(resolvedCompanyId).select('name logo location website industry');

    const companyName = companyDoc?.name || 'The Company';
    const companyLogo = companyDoc?.logo || '';
    const jobTitle = jobDoc?.title || 'Interview Invitation';
    const jobLocation = jobDoc?.location || companyDoc?.location || 'Location TBD';
    const jobCategory = jobDoc?.category || 'General';
    const jobType = (jobDoc?.jobType || ['Full-time']).join(', ');
    const jobSalary = jobDoc?.salary || 'As Per Interview';
    const jobExperience = jobDoc?.experience !== undefined ? `${jobDoc.experience}+ years` : 'Fresher';
    const formattedDate = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const meetLink = interview.meetingLink;

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Interview Invitation — ${jobTitle}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f6;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#4648d4,#8127cf);padding:28px 32px;text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.85);font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">AI JobFit — Interview Invitation</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:900;">You're Invited to Interview!</h1>
            </td>
          </tr>

          <!-- Hi Candidate -->
          <tr>
            <td style="padding:28px 32px 8px;">
              <p style="margin:0;color:#1e293b;font-size:15px;">Hi <strong style="color:#0f172a;">${candidate?.fullname || 'Candidate'}</strong>,</p>
              <p style="margin:8px 0 0;color:#475569;font-size:13.5px;line-height:1.6;">
                You have been invited for an interview. Here are the complete details:
              </p>
            </td>
          </tr>

          <!-- Company Card -->
          <tr>
            <td style="padding:16px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;">
                
                <!-- Company Header -->
                <tr>
                  <td style="padding:24px 20px 16px;text-align:center;">
                    <div style="margin:0 auto 12px;width:64px;height:64px;">
                      ${companyLogo
                        ? `<img src="${companyLogo}" alt="${companyName}" width="64" height="64" style="border-radius:12px;object-fit:cover;border:1px solid #e2e8f0;display:block;margin:0 auto;" />`
                        : `<div style="width:64px;height:64px;border-radius:12px;background:linear-gradient(135deg,#4648d4,#8127cf);display:block;margin:0 auto;font-size:26px;font-weight:900;color:white;text-align:center;line-height:64px;">${companyName[0] || 'C'}</div>`
                      }
                    </div>
                    <p style="margin:0;color:#0f172a;font-size:20px;font-weight:900;text-align:center;">${companyName}</p>
                    <p style="margin:6px 0 0;color:#d97706;font-size:12px;font-weight:700;text-align:center;">⭐ AI-Verified Company</p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="padding:0 20px;"><div style="border-top:1px solid #e2e8f0;"></div></td></tr>

                <!-- Job Title -->
                <tr>
                  <td style="padding:16px 20px 8px;">
                    <h2 style="margin:0;color:#0f172a;font-size:17px;font-weight:900;line-height:1.4;">${jobTitle}</h2>
                  </td>
                </tr>

                <!-- Job Details Grid -->
                <tr>
                  <td style="padding:4px 20px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:5px 0;color:#475569;font-size:13px;font-weight:500;">
                          📍 Location: <span style="color:#0f172a;font-weight:700;">${jobLocation}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#475569;font-size:13px;font-weight:500;">
                          💼 Experience: <span style="color:#0f172a;font-weight:700;">${jobExperience}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#475569;font-size:13px;font-weight:500;">
                          💰 Salary Range: <span style="color:#0f172a;font-weight:700;">${jobSalary}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#475569;font-size:13px;font-weight:500;">
                          🏢 Job Type: <span style="color:#0f172a;font-weight:700;">${jobType}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#475569;font-size:13px;font-weight:500;">
                          🏷️ Category: <span style="color:#0f172a;font-weight:700;">${jobCategory}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Schedule Details -->
                <tr>
                  <td style="padding:0 20px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border:1px dashed #0284c7;border-radius:10px;">
                      <tr>
                        <td style="padding:14px 16px;">
                          <p style="margin:0;color:#0284c7;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">Interview Schedule</p>
                          <p style="margin:6px 0 0;color:#0369a1;font-size:15px;font-weight:800;">📅 ${formattedDate} &nbsp;|&nbsp; 🕐 ${time}</p>
                          <p style="margin:6px 0 0;color:#0369a1;font-size:12px;font-weight:600;">Mode: Google Meet &nbsp;•&nbsp; Interviewer: ${interview.interviewer}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- I'm Interested Button -->
          <tr>
            <td style="padding:8px 32px 4px;text-align:center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/candidate/interviews?confirm=${interview._id}" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#4648d4,#8127cf);color:#ffffff;font-size:15px;font-weight:900;text-decoration:none;padding:16px 48px;border-radius:50px;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(70,72,212,0.25);">
                I'm Interested
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 32px 28px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748b;font-weight:500;">You will get a reminder mail for this interview</p>
            </td>
          </tr>

          <!-- Meet Link Button -->
          ${meetLink ? `
          <tr>
            <td style="padding:0 32px 28px;text-align:center;">
              <a href="${meetLink}" target="_blank" style="display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;color:#475569;font-size:12px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;letter-spacing:1px;">
                🎥 Join Google Meet — ${meetLink}
              </a>
            </td>
          </tr>` : ''}

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:18px 32px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#64748b;font-size:11px;font-weight:500;">© AI JobFit — Precision Hiring & AI Recruitment</p>
              <p style="margin:4px 0 0;color:#4648d4;font-size:11px;font-weight:700;">aijobfit.com</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    if (candidate?.email) {
      sendEmail({
        email: candidate.email,
        subject: `🎯 Interview Invitation: ${jobTitle} at ${companyName}`,
        html: emailHtml
      }).catch(err => console.log('Email Error:', err));
    }

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

// @desc    Candidate confirms interest from email link
// @route   PUT /api/v1/interview/:id/confirm
// @access  Private/Candidate
exports.confirmInterest = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('jobId', 'title location category jobType salary experience')
      .populate('companyId', 'name logo location')
      .populate('candidateId', 'fullname email');

    if (!interview) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Interview not found', data: null });
    }

    // Verify the logged-in user is the candidate for this interview
    if (interview.candidateId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'You are not authorized to confirm this interview', data: null });
    }

    // Mark as confirmed
    interview.candidateConfirmed = true;
    await interview.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Interview confirmed successfully! See you there.',
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

// @desc    Submit interview feedback & rating
// @route   PUT /api/v1/interview/:id/feedback
// @access  Private/Candidate
exports.submitInterviewFeedback = async (req, res, next) => {
  try {
    const { feedback, rating } = req.body;

    if (!rating) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide a rating', data: null });
    }

    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Interview not found', data: null });
    }

    // Check if logged-in user is the candidate of this interview
    if (interview.candidateId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'You are not authorized to submit feedback for this interview', data: null });
    }

    interview.feedback = feedback;
    interview.rating = rating;
    interview.status = 'completed'; // Automatically mark as completed when feedback is submitted

    await interview.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Feedback submitted successfully',
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

