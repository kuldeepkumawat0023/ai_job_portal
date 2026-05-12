const User = require('../models/User');
const cloudinary = require('../config/cloudinary');


// Helper to extract public_id from Cloudinary URL
const getPublicId = (url) => {
  try {
    const parts = url.split('/');
    const folderIndex = parts.findIndex(p => p === 'ai_job_portal');
    if (folderIndex === -1) return null;
    const publicIdWithExt = parts.slice(folderIndex).join('/');
    return publicIdWithExt.split('.')[0];
  } catch (error) {
    return null;
  }
};

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

    const { fullname, bio, skills, experience, profilePhoto, education, workExperience, projects, role } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    // Handle file uploads (Cloudinary URL) & Delete old files
    if (req.file) {
      if (req.file.fieldname === 'profilePhoto') {
        // Delete old photo from Cloudinary
        if (user.profilePhoto && user.profilePhoto.includes('cloudinary')) {
          const oldPublicId = getPublicId(user.profilePhoto);
          if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId).catch(err => console.log('Cloudinary Delete Error:', err));
        }
        user.profilePhoto = req.file.path;
      } else if (req.file.fieldname === 'resume') {
        // Delete old resume from Cloudinary
        if (user.resume && user.resume.includes('cloudinary')) {
          const oldPublicId = getPublicId(user.resume);
          if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'raw' }).catch(err => console.log('Cloudinary Delete Error:', err));
        }
        user.resume = req.file.path;
      }
    }

    // Update fields
    if (fullname) user.fullname = fullname;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (experience !== undefined) user.experience = experience;
    if (profilePhoto) user.profilePhoto = profilePhoto;
    if (education) user.education = education;
    if (workExperience) user.workExperience = workExperience;
    if (projects) user.projects = projects;
    if (role && req.user.role === 'admin') user.role = role; // Only admin can change roles

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
