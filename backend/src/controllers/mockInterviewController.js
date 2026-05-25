const OpenAI = require('openai');
const MockInterview = require('../models/MockInterview');
const Job = require('../models/Job');
const User = require('../models/User');
const axios = require('axios');
const pdf = require('pdf-parse');

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
    return ""; // Return empty if parsing fails
  }
};

// @desc    Generate AI Mock Interview Questions (using GPT-4o)
// @route   POST /api/v1/mock-interview/generate
// @access  Private
exports.generateQuestions = async (req, res, next) => {
  try {
    const { jobId, jobTitle: manualTitle } = req.body;
    const user = await User.findById(req.user.id);
    
    let jobTitle = manualTitle;
    let jobDesc = "";

    if (jobId) {
      const job = await Job.findById(jobId);
      if (job) {
        jobTitle = job.title;
        jobDesc = job.description;
      }
    }

    if (!jobTitle) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Job title or Job ID is required', data: null });
    }

    let resumeText = "";
    if (user.resume) {
      resumeText = await extractTextFromPDF(user.resume);
    }

    const prompt = `
      You are an elite technical recruiter and hiring manager. Generate 5 highly relevant and challenging interview questions for the position of "${jobTitle}".
      
      Job Context: "${jobDesc}" 
      Candidate Background: "${resumeText.substring(0, 2500)}"
      
      Requirements:
      - 3 Technical questions specifically based on the candidate's skills and the JD.
      - 2 Behavioral/Leadership questions.
      
      Return the output strictly in JSON format:
      {
        "questions": [
          {"question": "...", "category": "Technical"},
          {"question": "...", "category": "Behavioral"}
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const aiData = JSON.parse(completion.choices[0].message.content);

    const interview = await MockInterview.create({
      userId: req.user.id,
      jobTitle,
      jobDescription: jobDesc,
      questions: aiData.questions
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'AI Mock Interview session initialized',
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Answer and get AI Feedback (GPT-4o)
// @route   POST /api/v1/mock-interview/:id/submit
// @access  Private
exports.submitAnswer = async (req, res, next) => {
  try {
    const { questionId, answerText } = req.body;
    const interview = await MockInterview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Interview not found', data: null });
    }

    const questionObj = interview.questions.id(questionId);
    if (!questionObj) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Invalid question ID', data: null });
    }

    const prompt = `
      Evaluate the candidate's answer to the following interview question.
      Question: "${questionObj.question}"
      User's Answer: "${answerText}"
      
      Criteria:
      - Technical accuracy (for technical questions)
      - Clarity and communication
      - Confidence
      
      Return a score (0-10) and detailed constructive feedback in JSON format:
      {
        "score": number,
        "feedback": "...",
        "improvementTips": "..."
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const aiFeedback = JSON.parse(completion.choices[0].message.content);

    interview.responses.push({
      questionId,
      answerText,
      aiFeedback: aiFeedback.feedback,
      score: aiFeedback.score
    });

    await interview.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Feedback generated',
      data: {
        score: aiFeedback.score,
        feedback: aiFeedback.feedback,
        tips: aiFeedback.improvementTips
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Overall Interview Evaluation
// @route   GET /api/v1/mock-interview/:id/result
// @access  Private
exports.getInterviewResult = async (req, res, next) => {
  try {
    const interview = await MockInterview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Interview not found', data: null });
    }

    if (interview.responses.length === 0) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'No responses submitted', data: null });
    }

    const totalScore = interview.responses.reduce((sum, res) => sum + res.score, 0);
    const avgScore = (totalScore / (interview.responses.length * 10)) * 100;

    const prompt = `
      Provide a final comprehensive evaluation for this mock interview.
      Interview Data: ${JSON.stringify(interview.responses)}
      
      Assess the candidate's Technical Score, Confidence level, and Overall Readiness.
      Return in JSON format:
      {
        "overallFeedback": "...",
        "technicalScore": number (0-100),
        "confidenceScore": number (0-100),
        "readinessRating": "Ready/Needs Practice/Not Ready",
        "keyStrengths": ["...", "..."],
        "areasForImprovement": ["...", "..."]
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const evaluation = JSON.parse(completion.choices[0].message.content);

    interview.overallScore = Math.round(avgScore);
    interview.overallFeedback = evaluation.overallFeedback;
    interview.status = 'completed';
    
    // Extra fields from evaluation
    interview.technicalScore = evaluation.technicalScore;
    interview.confidenceScore = evaluation.confidenceScore;
    
    await interview.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Final evaluation completed',
      data: {
        interview,
        evaluation
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all my mock interview sessions
// @route   GET /api/v1/mock-interview/my-sessions
// @access  Private
exports.getMySessions = async (req, res, next) => {
  try {
    const sessions = await MockInterview.find({ userId: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Mock interview sessions fetched',
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};
