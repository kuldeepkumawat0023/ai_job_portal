const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Transaction = require('../models/Transaction');
const fs = require('fs');
const csv = require('csv-parser');

// @desc    Get all Transactions (Revenue Report)
// @route   GET /api/v1/admin/transactions
// @access  Private/Admin
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({})
      .populate('userId', 'fullname email')
      .sort('-createdAt');

    // Calculate total revenue from succeeded transactions
    const totalRevenue = transactions
      .filter(t => t.status === 'succeeded')
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Transactions fetched successfully',
      data: {
        totalRevenue: (totalRevenue / 100).toFixed(2), // Convert from cents to dollars
        currency: 'USD',
        transactions
      }
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Import jobs in bulk via CSV
// @route   POST /api/v1/admin/jobs/bulk-import
// @access  Private/Admin
exports.importBulkJobs = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please upload a CSV file', data: null });
    }

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const jobsToInsert = results.map(row => ({
            title: row.title,
            description: row.description,
            requirements: row.requirements ? row.requirements.split(',') : [],
            salary: row.salary,
            location: row.location,
            jobType: row.jobType || 'Full-time',
            experience: parseInt(row.experience) || 0,
            category: row.category,
            companyId: row.companyId, // Should be valid MongoDB ID in CSV
            postedBy: req.user.id
          }));

          await Job.insertMany(jobsToInsert);

          // Delete temp file
          fs.unlinkSync(filePath);

          res.status(201).json({
            success: true,
            statusCode: 201,
            message: `${jobsToInsert.length} jobs imported successfully`,
            data: null
          });
        } catch (err) {
          next(err);
        }
      });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const suspendedUsers = await User.countDocuments({ isActive: false });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Revenue from succeeded transactions
    const transactions = await Transaction.find({ status: 'succeeded' });
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Dashboard stats fetched successfully',
      data: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalJobs,
        totalApplications,
        totalRevenue: (totalRevenue / 100).toFixed(2),
        currency: 'USD'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (for Admin)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort('-createdAt');
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'All users fetched successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend/Deactivate a user
// @route   PUT /api/v1/admin/user/:id/suspend
// @access  Private/Admin
exports.suspendUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `User ${user.fullname} suspended successfully`,
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate a user
// @route   PUT /api/v1/admin/user/:id/activate
// @access  Private/Admin
exports.activateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `User ${user.fullname} activated successfully`,
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user (Admin)
// @route   PUT /api/v1/admin/user/:id/update
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Hard delete a user (Admin)
// @route   DELETE /api/v1/admin/user/:id/delete
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User deleted permanently',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
