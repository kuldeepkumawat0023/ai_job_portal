const User = require('../models/User');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const sendEmail = require('../config/email');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

// Helper function to sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register user
// @route   POST /api/v1/user/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullname, email, countryCode, phoneNumber, password, confirmPassword } = req.body;

    // Validate input
    if (!fullname || !email || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide all required fields', data: null });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Passwords do not match', data: null });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      if (userExists.isActive) {
        return res.status(409).json({ success: false, statusCode: 409, message: 'User already exists', data: null });
      } else {
        // --- REACTIVATION FLOW ---
        // Generate 6 digit OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        // Set OTP and expiry (10 mins)
        userExists.otp = otp;
        userExists.otpExpiry = Date.now() + 10 * 60 * 1000;
        userExists.isOtpVerified = false;
        await userExists.save({ validateBeforeSave: false });

        // Email HTML Template
        const reactivateUrl = `${process.env.FRONTEND_URL}/reactivate-account`;
        
        const htmlMessage = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7f6; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; }
            .content { background-color: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .content h2 { color: #333; margin-top: 0; }
            .content p { color: #555; line-height: 1.6; font-size: 16px; }
            .otp-box { background-color: #f0f4ff; border: 2px dashed #667eea; text-align: center; padding: 20px; margin: 30px 0; border-radius: 8px; }
            .otp-code { font-size: 36px; font-weight: bold; color: #764ba2; letter-spacing: 4px; }
            .btn-container { text-align: center; margin-top: 30px; }
            .btn { display: inline-block; background-color: #667eea; color: white; text-decoration: none; padding: 12px 25px; border-radius: 50px; font-weight: bold; font-size: 16px; transition: background-color 0.3s; }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>AI Job Portal</h1>
            </div>
            <div class="content">
              <h2>Account Reactivation</h2>
              <p>Hello ${userExists.fullname},</p>
              <p>You recently tried to register with this email, but your account was previously deactivated. Here is your One-Time Password (OTP) to reactivate your account. <strong>This code is valid for 10 minutes.</strong></p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p>Click the button below to reactivate your account and set a new password:</p>
              
              <div class="btn-container">
                <a href="${reactivateUrl}" class="btn">Reactivate Account</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} AI Job Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
        `;

        try {
          await sendEmail({
            email: userExists.email,
            subject: 'Account Reactivation OTP - AI Job Portal',
            html: htmlMessage
          });

          return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Account is deactivated. Reactivation OTP sent to email.',
            data: { isReactivation: true }
          });
        } catch (err) {
          userExists.otp = undefined;
          userExists.otpExpiry = undefined;
          await userExists.save({ validateBeforeSave: false });
          return res.status(400).json({ success: false, statusCode: 400, message: 'Email could not be sent', data: null });
        }
      }
    }

    // Create new user
    const user = await User.create({
      fullname,
      email,
      countryCode: countryCode || '+91',
      phoneNumber,
      password
    });

    // Create token
    const token = signToken(user._id);

    // Send Welcome Email
    const welcomeHtmlMessage = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f7f6; }
        .content { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; }
        .header { color: #667eea; margin-bottom: 20px; }
        .details { color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 20px; }
        .btn { display: inline-block; background-color: #667eea; color: white; text-decoration: none; padding: 12px 25px; border-radius: 50px; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2 class="header">Welcome to AI Job Portal!</h2>
          <h3>Hello, ${user.fullname}!</h3>
          <p class="details">Your account has been created successfully. We are excited to help you find your dream job with the power of AI.</p>
          <p class="details">Start by completing your profile and uploading your resume for AI analysis.</p>
          <a href="${process.env.FRONTEND_URL}/profile" class="btn">Complete Your Profile</a>
        </div>
      </div>
    </body>
    </html>
    `;

    sendEmail({
      email: user.email,
      subject: 'Welcome to AI Job Portal - Account Created Successfully',
      html: welcomeHtmlMessage
    }).catch(err => console.log('Failed to send welcome email:', err));

    // Send response
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    next(error); // Passes to global error handler (which returns 400)
  }
};

// @desc    Login user
// @route   POST /api/v1/user/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide an email and password', data: null });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'Invalid credentials', data: null });
    }

    // Check if account is deactivated (soft deleted)
    if (user.isActive === false) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Your account has been deactivated. Please contact support.', data: null });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'Invalid credentials', data: null });
    }

    // Create token
    const token = signToken(user._id);

    // Send Login Notification Email (Fire and forget, don't await to avoid slowing login)
    const loginHtmlMessage = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f7f6; }
        .content { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; }
        .header { color: #667eea; margin-bottom: 20px; }
        .details { color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2 class="header">AI Job Portal</h2>
          <h3>Welcome Back, ${user.fullname}!</h3>
          <p class="details">We are thrilled to see you again. You have successfully logged into your AI Job Portal account.</p>
          <p class="details" style="font-size: 14px; color: #888;">If this was you, you can safely ignore this message.<br>If you did not authorize this login, please change your password immediately to secure your account.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    sendEmail({
      email: user.email,
      subject: 'Welcome Back to AI Job Portal',
      html: loginHtmlMessage
    }).catch(err => console.log('Failed to send login alert email:', err));

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.hasCompanyProfile ? 'recruiter' : 'candidate'
        },
        token
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth Login
// @route   POST /api/v1/user/google-login
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Google ID token is required', data: null });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name: fullname, picture: profilePhoto } = payload;

    let user = await User.findOne({ email });

    if (user && user.isActive === false) {
      // Seamless Reactivation via Google Auth
      user.isActive = true;
      await user.save();
    }

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        fullname,
        email,
        phoneNumber: '0000000000', // Default or prompt later
        countryCode: '+91',
        password: Math.random().toString(36).slice(-8) + 'Aa1@', // Random secure password
        profilePhoto,
        role: 'candidate',
        isActive: true
      });
    }

    const token = signToken(user._id);

    // Send Login Notification Email
    const loginHtmlMessage = `
    <div style="font-family: sans-serif; text-align: center;">
      <h2 style="color: #667eea;">Welcome to AI Job Portal</h2>
      <p>Hello <b>${user.fullname}</b>, you have successfully logged in via Google.</p>
    </div>
    `;
    
    sendEmail({
      email: user.email,
      subject: 'Welcome Back to AI Job Portal',
      html: loginHtmlMessage
    }).catch(err => console.log('Failed to send Google login alert email:', err));

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Google login successful',
      data: {
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          profilePhoto: user.profilePhoto,
          role: user.hasCompanyProfile ? 'recruiter' : user.role
        },
        token
      }
    });
  } catch (error) {
    return res.status(401).json({ success: false, statusCode: 401, message: 'Invalid Google token', data: null });
  }
};


// @desc    Forgot Password (Send OTP)
// @route   POST /api/v1/user/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide an email', data: null });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'There is no user with that email', data: null });
    }

    // Generate 6 digit OTP
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

    // Set OTP and expiry (10 mins)
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save({ validateBeforeSave: false });

    // Email HTML Template
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password`;
    
    const htmlMessage = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7f6; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; }
        .content { background-color: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .content h2 { color: #333; margin-top: 0; }
        .content p { color: #555; line-height: 1.6; font-size: 16px; }
        .otp-box { background-color: #f0f4ff; border: 2px dashed #667eea; text-align: center; padding: 20px; margin: 30px 0; border-radius: 8px; }
        .otp-code { font-size: 36px; font-weight: bold; color: #764ba2; letter-spacing: 4px; }
        .btn-container { text-align: center; margin-top: 30px; }
        .btn { display: inline-block; background-color: #667eea; color: white; text-decoration: none; padding: 12px 25px; border-radius: 50px; font-weight: bold; font-size: 16px; transition: background-color 0.3s; }
        .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AI Job Portal</h1>
        </div>
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset the password for your AI Job Portal account. Here is your One-Time Password (OTP) to proceed with the reset. <strong>This code is valid for 10 minutes.</strong></p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          
          <p>You can use the button below to go directly to the reset password page:</p>
          
          <div class="btn-container">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>
          
          <p style="margin-top: 30px; font-size: 14px;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AI Job Portal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP - AI Job Portal',
        html: htmlMessage
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'OTP sent to email',
        data: null
      });
    } catch (err) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ success: false, statusCode: 400, message: 'Email could not be sent', data: null });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP (Step 2 of Reset Flow)
// @route   POST /api/v1/user/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide email and OTP', data: null });
    }

    const user = await User.findOne({
      email,
      otp,
      otpExpiry: { $gt: Date.now() } // Ensure OTP is not expired
    });

    if (!user) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'Invalid or expired OTP', data: null });
    }

    user.isOtpVerified = true;
    user.otp = undefined; // clear OTP so it can't be guessed/reused
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'OTP verified successfully. You can now reset your password.',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password via OTP (Step 3 of Reset Flow)
// @route   POST /api/v1/user/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide all fields', data: null });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Passwords do not match', data: null });
    }

    const user = await User.findOne({
      email,
      isOtpVerified: true,
      otpExpiry: { $gt: Date.now() } // Ensure they set password within the expiry window
    });

    if (!user) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'OTP verification incomplete or expired', data: null });
    }

    // Set new password
    user.password = newPassword;
    user.isOtpVerified = false;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Password reset successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/user/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // In JWT, logout is usually handled client-side by deleting the token.
    // If using HTTP-only cookies, we clear the cookie here.
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User logged out successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reactivate Account via OTP
// @route   POST /api/v1/user/reactivate-account
// @access  Public
exports.reactivateAccount = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide all fields', data: null });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Passwords do not match', data: null });
    }

    const user = await User.findOne({
      email,
      isOtpVerified: true,
      otpExpiry: { $gt: Date.now() } // Ensure OTP is not expired
    });

    if (!user) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'OTP verification incomplete or expired', data: null });
    }

    // Reactivate account and set new password
    user.isActive = true;
    user.password = newPassword;
    user.isOtpVerified = false;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Account reactivated successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};


