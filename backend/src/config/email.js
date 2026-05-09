import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';

dotenv.config();

// Configured email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Standard configuration
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Generates a secure 6-digit numeric OTP.
 */
export const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
};

/**
 * Sends the generated OTP via email.
 */
export const sendOTPEmail = async (toEmail, otp) => {
  try {
    const mailOptions = {
      from: `"AI Job Portal" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your AI Job Portal account.</p>
          <p>Your 6-digit OTP is:</p>
          <h1 style="color: #4A90E2; letter-spacing: 2px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
          <br />
          <p>Best regards,<br/>The AI Job Portal Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};
