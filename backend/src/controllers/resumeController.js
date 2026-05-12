const Resume = require('../models/Resume');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const OpenAI = require('openai');
const axios = require('axios');
const pdf = require('pdf-parse');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

// @desc    Upload a new resume
// @route   POST /api/v1/resume/upload
// @access  Private
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please upload a file', data: null });
    }

    await Resume.updateMany({ userId: req.user.id }, { isDefault: false });

    const resume = await Resume.create({
      userId: req.user.id,
      fileUrl: req.file.path,
      isDefault: true
    });

    res.status(201).json({ success: true, statusCode: 201, message: 'Resume uploaded successfully', data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze resume with AI — extract score, skills, weaknesses
// @route   POST /api/v1/resume/analyze/:id
// @access  Private
exports.analyzeResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Resume not found', data: null });
    }

    if (resume.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized', data: null });
    }

    // Extract text from PDF
    let resumeText = '';
    try {
      const response = await axios.get(resume.fileUrl, { responseType: 'arraybuffer' });
      const pdfData = await pdf(response.data);
      resumeText = pdfData.text;
    } catch (err) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Could not extract text from PDF', data: null });
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Resume appears to be empty or unreadable', data: null });
    }

    // Call OpenAI GPT-4o for deep analysis
    const prompt = `
      You are an expert HR analyst and career coach. Analyze the following resume text thoroughly.

      Resume Text:
      """
      ${resumeText.substring(0, 4000)}
      """

      Provide a comprehensive analysis. Return STRICTLY in this JSON format:
      {
        "score": <number 0-100>,
        "summary": "<2-3 sentence professional summary>",
        "skills": ["skill1", "skill2"],
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "coachingTips": ["tip1", "tip2", "tip3"],
        "experience": "<experience level: Entry/Mid/Senior>",
        "recommendedRoles": ["role1", "role2"]
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o',
      response_format: { type: 'json_object' }
    });

    const aiAnalysis = JSON.parse(completion.choices[0].message.content);

    // Save analysis back to Resume document
    resume.score = aiAnalysis.score;
    resume.summary = aiAnalysis.summary;
    resume.skills = aiAnalysis.skills;
    resume.strengths = aiAnalysis.strengths;
    resume.weaknesses = aiAnalysis.weaknesses;
    resume.coachingTips = aiAnalysis.coachingTips;
    resume.experience = aiAnalysis.experience;
    resume.recommendedRoles = aiAnalysis.recommendedRoles;
    resume.isAnalyzed = true;
    await resume.save();

    // Increment user's resume analysis counter (free plan tracking)
    const user = await User.findById(req.user.id);
    if (!user.isPremium) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { resumeRetries: 1 } });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Resume analyzed successfully',
      data: resume
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analysis history for logged in user
// @route   GET /api/v1/resume/history
// @access  Private
exports.getResumeHistory = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id, isAnalyzed: true }).sort('-updatedAt');
    res.status(200).json({ success: true, statusCode: 200, message: 'Resume history fetched', data: resumes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resumes for logged in user
// @route   GET /api/v1/resume/my-resumes
// @access  Private
exports.getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, statusCode: 200, message: 'Resumes fetched successfully', data: resumes });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resume
// @route   DELETE /api/v1/resume/:id
// @access  Private
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Resume not found', data: null });
    }

    if (resume.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized', data: null });
    }

    const publicId = getPublicId(resume.fileUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }).catch(err => console.log('Cloudinary Delete Error:', err));
    }

    await resume.deleteOne();
    res.status(200).json({ success: true, statusCode: 200, message: 'Resume deleted successfully', data: null });
  } catch (error) {
    next(error);
  }
};

// @desc    Set default resume
// @route   PUT /api/v1/resume/set-default/:id
// @access  Private
exports.setDefaultResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Resume not found', data: null });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized', data: null });
    }

    await Resume.updateMany({ userId: req.user.id }, { isDefault: false });
    resume.isDefault = true;
    await resume.save();

    res.status(200).json({ success: true, statusCode: 200, message: 'Default resume updated', data: resume });
  } catch (error) {
    next(error);
  }
};
