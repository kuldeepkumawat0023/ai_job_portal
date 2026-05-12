const Company = require('../models/Company');
const User = require('../models/User');

// @desc    Register a new company
// @route   POST /api/v1/company/register
// @access  Private
exports.registerCompany = async (req, res, next) => {
  try {
    const { name, description, website, location } = req.body;

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
      userId: req.user.id
    });

    // Update user's hasCompanyProfile flag
    await User.findByIdAndUpdate(req.user.id, { hasCompanyProfile: true });

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
    const { name, description, website, location } = req.body;
    
    let company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Company not found', data: null });
    }

    // Security: Check if user owns the company
    if (company.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized to update this company', data: null });
    }

    const updateData = { name, description, website, location };
    
    // Handle logo upload if provided
    if (req.file) {
      updateData.logo = req.file.path;
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
