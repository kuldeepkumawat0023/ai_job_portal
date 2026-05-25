const Company = require('../models/Company');
const User = require('../models/User');
const ROLES = require('../utils/roles');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Register a new company
// @route   POST /api/v1/company/register
// @access  Private
exports.registerCompany = async (req, res, next) => {
  try {
    const { name, description, website, location, industry } = req.body;

    if (!name || !location) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Company name and location are required', data: null });
    }

    // Check if company already exists
    let company = await Company.findOne({ name });
    if (company) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Company name already exists', data: null });
    }

    // Create company
    company = await Company.create({
      name,
      description,
      website,
      location,
      industry,
      userId: req.user.id
    });

    // Update user's hasCompanyProfile flag, companyId, and change role to recruiter
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { 
      hasCompanyProfile: true,
      companyId: company._id,
      role: ROLES.RECRUITER
    }, { new: true });

    console.log(`[Role & Company Update] User ${updatedUser._id} companyId set to ${updatedUser.companyId} and role changed to: ${updatedUser.role}`);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Company registered successfully',
      data: company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies for logged in user
// @route   GET /api/v1/company/all
// @access  Private
exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ userId: req.user.id });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Companies fetched successfully',
      data: companies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company by ID
// @route   GET /api/v1/company/:id
// @access  Private
exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Company not found', data: null });
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Company found',
      data: company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company details
// @route   PUT /api/v1/company/update/:id
// @access  Private
exports.updateCompany = async (req, res, next) => {
  try {
    const { name, description, website, location, industry } = req.body;
    
    let company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Company not found', data: null });
    }

    // Security: Check if user owns the company
    if (company.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized to update this company', data: null });
    }

    const updateData = { name, description, website, location, industry };
    
    // Handle logo upload if provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'ai_job_portal/companies', 'image');
      updateData.logo = uploadResult.secure_url || uploadResult.url;
    }

    company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Switch active company context
// @route   PUT /api/v1/company/switch/:id
// @access  Private/Recruiter/Admin
exports.switchCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Company not found', data: null });
    }

    // Security: Check if user owns the company
    if (company.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized to switch to this company', data: null });
    }

    // Update user's active company ID
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      companyId: company._id
    }, { new: true });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Switched active company workspace successfully',
      data: {
        user: updatedUser,
        company
      }
    });
  } catch (error) {
    next(error);
  }
};
