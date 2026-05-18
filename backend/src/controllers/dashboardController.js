const Application = require('../models/Application');
const Job = require('../models/Job');
const Interview = require('../models/Interview');
const MockInterview = require('../models/MockInterview');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Company = require('../models/Company');

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

    // Find company profile associated with this recruiter
    const company = await Company.findOne({ userId });

    // Find jobs posted by this recruiter
    const jobs = await Job.find({ postedBy: userId }).select('_id');
    const jobIds = jobs.map(j => j._id);

    const totalJobsPosted = jobs.length;
    const totalApplicants = await Application.countDocuments({ jobId: { $in: jobIds } });
    const hiredCount = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'hired' });
    const shortlistedCount = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'shortlisted' });
    const scheduledInterviews = await Interview.countDocuments({ jobId: { $in: jobIds }, status: 'scheduled' });

    // AI Talent Matcher (Top 5 applications by AI Score)
    const topCandidates = await Application.find({ jobId: { $in: jobIds } })
      .populate('applicantId', 'fullname email skills profilePhoto experience location workExperience projects')
      .populate('jobId', 'title')
      .sort({ aiScore: -1 })
      .limit(5);

    // Pipeline Candidates (Applications in stages)
    const pipelineCandidates = await Application.find({
      jobId: { $in: jobIds },
      status: { $in: ['applied', 'shortlisted', 'interviewing'] }
    })
      .populate('applicantId', 'fullname email skills profilePhoto experience location')
      .populate('jobId', 'title')
      .sort({ createdAt: -1 });

    // Application trend for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendData = await Application.aggregate([
      {
        $match: {
          jobId: { $in: jobIds },
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const match = trendData.find(t => t._id === dateString);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      dailyTrend.push({
        day: dayName,
        applications: match ? match.count : 0
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Recruiter dashboard stats fetched',
      data: {
        stats: {
          activeJobs: totalJobsPosted,
          totalApplicants,
          shortlisted: shortlistedCount,
          hired: hiredCount,
          scheduledInterviews
        },
        topCandidates,
        pipeline: pipelineCandidates,
        company,
        trend: dailyTrend
      }
    });
  } catch (error) {
    next(error);
  }
};
