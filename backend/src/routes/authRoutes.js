const express = require('express');
const { register, login, googleLogin, forgotPassword, verifyOtp, resetPassword, logout, reactivateAccount, sendHiringOtp, verifyHiringOtp } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/reactivate-account', reactivateAccount);
router.post('/send-hiring-otp', protect, sendHiringOtp);
router.post('/verify-hiring-otp', protect, verifyHiringOtp);
router.post('/logout', protect, logout);

module.exports = router;
