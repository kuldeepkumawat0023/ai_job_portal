const OpenAI = require('openai');
const axios = require('axios');
const pdf = require('pdf-parse');
const User = require('../models/User');
const Job = require('../models/Job');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to extract text from PDF URL
const extractTextFromPDF = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const data = await pdf(response.data);
    return data.text;
  } catch (error) {
    console.error('PDF Parse Error:', error);
    throw new Error('Failed to parse resume PDF');
  }
};

// @desc    Match Resume with Job using AI (GPT-4o)
// @route   POST /api/v1/ai/match-job/:jobId
// @access  Private
exports.matchJobWithResume = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user.id);
    const job = await Job.findById(jobId).populate('companyId', 'name');

    if (!user || !user.resume) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please upload a resume first', data: null });
    }
    if (!job) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Job not found', data: null });
    }

    const resumeText = await extractTextFromPDF(user.resume);
    const jobDescription = `${job.title}\n${job.description}\nRequirements: ${job.requirements.join(', ')}`;

    const prompt = `
      You are an expert HR Bot. Match the following resume with the job description.
      Resume Text:
      """
      ${resumeText.substring(0, 4000)}
      """
      
      Job Description:
      """
      ${jobDescription}
      """

      Provide a match score (0-100) and a brief reasoning in JSON format:
      {
        "score": number,
        "reasoning": "...",
        "missingSkills": ["...", "..."],
        "compatibility": "High/Medium/Low"
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const matchingResult = JSON.parse(completion.choices[0].message.content);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Job matching completed',
      data: matchingResult
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Job Description using AI (GPT-4o)
// @route   POST /api/v1/ai/generate-job-desc
// @access  Private/Recruiter
exports.generateJobDescription = async (req, res, next) => {
  try {
    const { title, companyName, industry } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Job title is required', data: null });
    }

    const prompt = `
      Generate a professional, high-impact job description for the position: "${title}" at ${companyName || 'a leading company'} in the ${industry || 'Tech'} industry.
      
      Return in JSON format:
      {
        "description": "Full JD text with Role Summary and Responsibilities",
        "requirements": ["Required Skill 1", "Required Skill 2"],
        "salaryRange": "...",
        "experienceLevel": "Entry/Mid/Senior"
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const aiData = JSON.parse(completion.choices[0].message.content);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Job description generated',
      data: aiData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Personalized Coaching Tips based on Resume
// @route   GET /api/v1/ai/coaching-tips
// @access  Private
exports.getCoachingTips = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.resume) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please upload a resume first', data: null });
    }

    const resumeText = await extractTextFromPDF(user.resume);

    const prompt = `
      Based on the following resume, provide 5 actionable coaching tips to improve the candidate's employability.
      Resume Text: ${resumeText.substring(0, 3000)}
      
      Return in JSON format:
      {
        "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const aiTips = JSON.parse(completion.choices[0].message.content);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Coaching tips generated',
      data: aiTips.tips
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Interview Questions for a specific job
// @route   POST /api/v1/ai/interview-questions
// @access  Private
exports.generateInterviewQuestions = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Job not found', data: null });
    }

    const prompt = `
      Generate 5 technical and 3 behavioral interview questions for the following job:
      Title: ${job.title}
      Description: ${job.description}
      Requirements: ${job.requirements.join(', ')}

      Return in JSON format:
      {
        "technical": ["Q1", "Q2", "Q3", "Q4", "Q5"],
        "behavioral": ["Q1", "Q2", "Q3"]
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const questions = JSON.parse(completion.choices[0].message.content);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Interview questions generated',
      data: questions
    });
  } catch (error) {
    next(error);
  }
};
