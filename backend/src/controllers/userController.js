const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get all users (Public/Basic Info)
// @route   GET /api/v1/user/all
// @access  Public
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true }).select('fullname profilePhoto bio skills role');
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Users fetched successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile by ID
// @route   GET /api/v1/user/profile/:id
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    // Security check: User can only access their own profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized access to this profile', data: null });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Profile fetched successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile by ID
// @route   PUT /api/v1/user/profile/update/:id
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    // Security check: User can only update their own profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized update request', data: null });
    }

    const { fullname, bio, skills, experience, education, workExperience, projects, role, location, phoneNumber, countryCode } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    // Handle file uploads (Buffer Streaming to Cloudinary)
    if (req.file) {
      if (req.file.fieldname === 'profilePhoto') {
        // 1. Delete old photo if exists
        if (user.profilePhoto) {
          await deleteFromCloudinary(user.profilePhoto);
        }
        // 2. Upload new photo
        const result = await uploadToCloudinary(req.file.buffer, 'ai_job_portal/profiles', 'image');
        user.profilePhoto = result.secure_url;
      } else if (req.file.fieldname === 'resume') {
        // 1. Delete old resume if exists
        if (user.resume) {
          await deleteFromCloudinary(user.resume);
        }
        // 2. Upload new resume
        const result = await uploadToCloudinary(req.file.buffer, 'ai_job_portal/resumes', 'raw');
        user.resume = result.secure_url;
      }
    }

    // Update text fields
    if (fullname) user.fullname = fullname;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (countryCode) user.countryCode = countryCode;

    // Parse skills if it's a string (e.g. from a form field)
    if (skills) {
      user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    }

    if (experience !== undefined) {
      user.experience = Number(experience);
    }

    // Update Arrays (Replacing with new data from frontend)
    if (education) {
      user.education = typeof education === 'string' ? JSON.parse(education) : education;
    }
    if (workExperience) {
      user.workExperience = typeof workExperience === 'string' ? JSON.parse(workExperience) : workExperience;
    }
    if (projects) {
      user.projects = typeof projects === 'string' ? JSON.parse(projects) : projects;
    }

    if (role && req.user.role === 'admin') user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete user profile by ID
// @route   DELETE /api/v1/user/profile/delete/:id
// @access  Private
exports.deleteProfile = async (req, res, next) => {
  try {
    // Security check: User can only delete their own profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized delete request', data: null });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Account successfully deactivated',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
