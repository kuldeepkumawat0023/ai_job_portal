const Application = require('../models/Application');
const Job = require('../models/Job');
const Interview = require('../models/Interview');
const MockInterview = require('../models/MockInterview');
const User = require('../models/User');
const Resume = require('../models/Resume');

// @desc    Get Candidate Dashboard Stats
// @route   GET /api/v1/dashboard/candidate
// @access  Private/Candidate
exports.getCandidateStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Basic Stats
    const totalApplied = await Application.countDocuments({ applicantId: userId });
    const interviewCount = await Interview.countDocuments({ candidateId: userId, status: 'scheduled' });
    const mockInterviewCount = await MockInterview.countDocuments({ userId });
    
    // 2. Resume Analysis Data (AI Features)
    const resume = await Resume.findOne({ userId, isDefault: true });
    
    // 3. Application Activity (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activityData = await Application.aggregate([
      {
        $match: {
          applicantId: req.user._id,
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const user = await User.findById(userId).select('resumeRetries jobSearches isPremium bio skills education workExperience projects');

    // Free plan limit from documentation
    const FREE_RESUME_LIMIT = 3;

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Candidate dashboard stats fetched',
      data: {
        totalApplied,
        scheduledInterviews: interviewCount,
        mockInterviewsDone: mockInterviewCount,
        isPremium: user.isPremium,
        resumeAnalysis: resume ? {
          score: resume.score || 0,
          skills: resume.skills || [],
          weaknesses: resume.weaknesses || [],
          coachingTips: resume.coachingTips || []
        } : null,
        activity: activityData,
        usage: {
          resumeAnalyses: {
            used: user.resumeRetries || 0,
            limit: user.isPremium ? 'Unlimited' : FREE_RESUME_LIMIT,
            left: user.isPremium ? 'Unlimited' : Math.max(0, FREE_RESUME_LIMIT - (user.resumeRetries || 0))
          },
          jobSearches: {
            used: user.jobSearches || 0,
            limit: user.isPremium ? 'Unlimited' : 5
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Recruiter Dashboard Stats
// @route   GET /api/v1/dashboard/recruiter
// @access  Private/Recruiter
exports.getRecruiterStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find jobs posted by this recruiter
    const jobs = await Job.find({ postedBy: userId }).select('_id');
    const jobIds = jobs.map(j => j._id);

    const totalJobsPosted = jobs.length;
    const totalApplicants = await Application.countDocuments({ jobId: { $in: jobIds } });
    const hiredCount = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'hired' });
    const scheduledInterviews = await Interview.countDocuments({ jobId: { $in: jobIds }, status: 'scheduled' });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Recruiter dashboard stats fetched',
      data: {
        totalJobsPosted,
        totalApplicants,
        totalHired: hiredCount,
        scheduledInterviews,
        activeJobs: await Job.countDocuments({ postedBy: userId, status: 'active' }) // Assuming a status field
      }
    });
  } catch (error) {
    next(error);
  }
};
