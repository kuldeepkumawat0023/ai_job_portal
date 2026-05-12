const express = require('express');
const { register, login, googleLogin, githubLogin, forgotPassword, verifyOtp, resetPassword, logout, reactivateAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/github-login', githubLogin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/reactivate-account', reactivateAccount);
router.post('/logout', protect, logout);

module.exports = router;
