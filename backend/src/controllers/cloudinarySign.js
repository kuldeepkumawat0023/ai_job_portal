const { cloudinary } = require('../config/cloudinary');

/**
 * @desc    Generate a signed Cloudinary upload signature
 *          The frontend uses this to upload files directly to Cloudinary,
 *          bypassing the Vercel serverless function's 4.5MB body limit.
 * @route   GET /api/v1/resume/cloudinary-sign
 * @access  Private
 */
exports.getCloudinarySignature = async (req, res, next) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'ai_job_portal/resumes';

    // Generate the signature using the Cloudinary SDK
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cloudinary signature generated',
      data: {
        timestamp,
        signature,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder,
      },
    });
  } catch (error) {
    next(error);
  }
};
