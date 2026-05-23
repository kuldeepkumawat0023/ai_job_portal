const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Post a new job
// @route   POST /api/v1/job/post
// @access  Private/Recruiter
exports.postJob = async (req, res, next) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, category, companyId } = req.body;

    if (!title || !description || !location || !category || !companyId) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Missing required fields', data: null });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements ? (Array.isArray(requirements) ? requirements : requirements.split(',')) : [],
      salary,
      location,
      jobType: jobType ? (Array.isArray(jobType) ? jobType : [jobType]) : ['Full-time'],
      experience,
      category,
      companyId,
      postedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Job posted successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (with filters)
// @route   GET /api/v1/job/all
// @access  Public
exports.getAllJobs = async (req, res, next) => {
  try {
    const { keyword, location, category, jobType } = req.query;
    
    let query = { isDeleted: { $ne: true } };
    
    // Keyword search (title or description)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (location) query.location = { $regex: location, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };
    if (jobType) {
      const types = Array.isArray(jobType) ? jobType : jobType.split(',');
      query.jobType = { $in: types };
    }

    const jobs = await Job.find(query)
      .populate('companyId', 'name logo location')
      .sort('-createdAt');

    // Increment job searches if user is authenticated and not premium
    if (req.user && !req.user.isPremium) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { jobSearches: 1 } });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      count: jobs.length,
      message: 'Jobs fetched successfully',
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Recommended Jobs for user
// @route   GET /api/v1/job/recommended
// @access  Private/Candidate
exports.getRecommendedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    let jobs = [];

    // Recommendation logic: match by skills and experience
    if (user.skills && user.skills.length > 0) {
      // Escape special characters in user skills to avoid invalid regex patterns
      const escapedSkills = user.skills
        .filter(Boolean)
        .map(s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
      
      if (escapedSkills.length > 0) {
        const skillsRegex = escapedSkills.join('|');
        jobs = await Job.find({
          isDeleted: { $ne: true },
          $or: [
            { requirements: { $in: user.skills } },
            { title: { $regex: skillsRegex, $options: 'i' } },
            { category: { $regex: skillsRegex, $options: 'i' } },
            { description: { $regex: skillsRegex, $options: 'i' } }
          ]
        }).populate('companyId', 'name logo').sort('-createdAt').limit(10);
      }
    }

    // Fallback: If no matches found or fewer than 5 jobs, fill up with the latest jobs
    if (jobs.length < 5) {
      const existingIds = jobs.map(j => j._id);
      const fallbackJobs = await Job.find({
        isDeleted: { $ne: true },
        _id: { $nin: existingIds }
      }).populate('companyId', 'name logo').sort('-createdAt').limit(10 - jobs.length);
      
      jobs = [...jobs, ...fallbackJobs];
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      count: jobs.length,
      message: 'Recommended jobs fetched successfully',
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get job by ID
// @route   GET /api/v1/job/:id
// @access  Public
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, isDeleted: { $ne: true } }).populate('companyId', 'name logo website location description');
    
    if (!job) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Job not found', data: null });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Job details found',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by the recruiter
// @route   GET /api/v1/job/admin/jobs
// @access  Private/Recruiter
exports.getAdminJobs = async (req, res, next) => {
  try {
    const Company = require('../models/Company');
    let companyId = req.user.companyId;
    if (!companyId) {
      const company = await Company.findOne({ userId: req.user.id });
      companyId = company ? company._id : null;
    }

    const query = { isDeleted: { $ne: true } };
    if (companyId) {
      query.companyId = companyId;
    } else {
      query.postedBy = req.user.id;
    }

    const jobs = await Job.find(query).populate('companyId', 'name');
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Recruiter jobs fetched',
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/v1/job/update/:id
// @access  Private/Recruiter
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    
    if (!job) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Job not found', data: null });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized to update this job', data: null });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/v1/job/delete/:id
// @access  Private/Recruiter
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    
    if (!job) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Job not found', data: null });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized to delete this job', data: null });
    }

    job.isDeleted = true;
    await job.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Job deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
