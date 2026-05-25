const express = require('express');
const { getAllUsers, suspendUser, activateUser, updateUser, deleteUser, getDashboardStats, importBulkJobs, getTransactions } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// All routes here are protected and restricted to Admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/transactions', getTransactions);       // Revenue report
router.post('/jobs/bulk-import', upload.single('file'), importBulkJobs);
router.get('/users', getAllUsers);
router.put('/user/:id/suspend', suspendUser);
router.put('/user/:id/activate', activateUser);
router.put('/user/:id/update', updateUser);
router.delete('/user/:id/delete', deleteUser);

module.exports = router;
