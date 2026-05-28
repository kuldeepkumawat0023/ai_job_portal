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

// ==================== SMART MOCK INTERVIEW FALLBACKS ====================

const getMockInterviewQuestionsFallback = (jobTitle, resumeText) => {
  const lowerText = (resumeText || "").toLowerCase();
  let techTopic1 = "system architecture";
  let techTopic2 = "database design";
  let techTopic3 = "REST API best practices";

  if (lowerText.includes("react") || lowerText.includes("frontend") || lowerText.includes("typescript")) {
    techTopic1 = "React hooks and state management";
    techTopic2 = "frontend performance optimization";
    techTopic3 = "responsive UI layouts and DOM rendering";
  } else if (lowerText.includes("node") || lowerText.includes("backend") || lowerText.includes("express")) {
    techTopic1 = "asynchronous event loop in Node.js";
    techTopic2 = "database scaling and SQL vs NoSQL trade-offs";
    techTopic3 = "authentication security and JWT handling";
  } else if (lowerText.includes("python") || lowerText.includes("ml") || lowerText.includes("data") || lowerText.includes("django")) {
    techTopic1 = "machine learning pipelines and data preprocessing";
    techTopic2 = "model evaluation metrics and overfitting";
    techTopic3 = "efficient data manipulation using pandas/numpy";
  }

  return {
    questions: [
      {
        question: `Explain how you would approach ${techTopic1} in a high-concurrency production environment for a ${jobTitle} role.`,
        category: "Technical"
      },
      {
        question: `What are some key design considerations or trade-offs you make when implementing ${techTopic2}?`,
        category: "Technical"
      },
      {
        question: `Can you describe your ideal workflow for ${techTopic3}?`,
        category: "Technical"
      },
      {
        question: "Describe a complex technical challenge you solved recently. What was your approach, and what did you learn?",
        category: "Behavioral"
      },
      {
        question: "How do you handle prioritizing multiple critical tasks or tight deadlines in a fast-paced team environment?",
        category: "Behavioral"
      }
    ]
  };
};

const getMockSubmitAnswerFallback = (question, answerText) => {
  const lowerAnswer = (answerText || "").toLowerCase();
  const lowerQuestion = (question || "").toLowerCase();
  const words = (answerText || "").trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Simple dictionary of common tech terms to check for technical depth
  const technicalTerms = [
    "scalability", "latency", "optimization", "performance", "component", "state", "hook", "database",
    "index", "cache", "redis", "query", "asynchronous", "promise", "middleware", "api", "rest", "graphql",
    "auth", "jwt", "security", "encryption", "server", "client", "render", "dom", "hosting", "aws", "docker",
    "kubernetes", "ci/cd", "git", "merge", "conflict", "testing", "unit", "integration", "jest", "cypress"
  ];

  // Check how many technical terms are present in the answer
  const matchedTechTerms = technicalTerms.filter(term => lowerAnswer.includes(term));
  
  // Calculate dynamic score components out of 10
  // 1. Length score (up to 4 points): peak at ~80 words
  const lengthScore = Math.min((wordCount / 80) * 4, 4);
  
  // 2. Keyword relevance score (up to 3 points): based on matched tech terms
  const keywordScore = Math.min(matchedTechTerms.length * 0.8, 3);
  
  // 3. Question alignment score (up to 3 points)
  const questionWords = lowerQuestion.split(/\s+/).filter(w => w.length > 4 && !["about", "describe", "explain", "would", "should", "could", "there"].includes(w));
  const alignedWords = questionWords.filter(w => lowerAnswer.includes(w.replace(/[?,.]/g, "")));
  const alignmentScore = questionWords.length > 0
    ? Math.min((alignedWords.length / questionWords.length) * 3, 3)
    : 2;

  // Final calculated score (base of 3.5 to prevent extremely low scores for brief attempts)
  let rawScore = Math.min(3.5 + lengthScore + keywordScore + alignmentScore, 10);
  let score = Math.round(rawScore);

  // If answer is practically empty
  if (wordCount < 4) {
    score = Math.max(1, Math.floor(Math.random() * 2) + 1); // 1-2
  }

  let feedback = "";
  let improvementTips = "Structure your answer using the STAR methodology: context, task, actions you took, and the end results with metrics.";

  if (score >= 9) {
    feedback = `[OFFLINE AI EVALUATION] Excellent response. You provided clear technical explanations, structured your thoughts logically, and showed good practical familiarity using terms like: ${matchedTechTerms.slice(0, 3).join(', ') || 'advanced topics'}.`;
    improvementTips = "Keep answers concise. You could slightly optimize the delivery by focusing directly on the primary solution first before diving into secondary details.";
  } else if (score >= 6) {
    feedback = "[OFFLINE AI EVALUATION] Your answer outlines the basic concepts well. However, it could be improved by providing specific real-world examples and explaining the technical tradeoffs of your chosen approach.";
  } else {
    feedback = "[OFFLINE AI EVALUATION] Your answer is too brief. Try to elaborate on your reasoning and explain the under-the-hood mechanism of the technology.";
    improvementTips = "Try to speak or write at least 3-4 comprehensive sentences. Detail the specific libraries, protocols, or design patterns you would use.";
  }

  return {
    score,
    feedback,
    improvementTips
  };
};

const getMockInterviewResultFallback = (responses) => {
  const count = responses.length;
  const avg = count > 0 ? responses.reduce((sum, r) => sum + r.score, 0) / count : 7;
  const scaledScore = Math.min(Math.round(avg * 10), 100);
  
  let readiness = "Needs Practice";
  let confidence = Math.floor(Math.random() * (90 - 75 + 1)) + 75;
  if (scaledScore >= 85) readiness = "Ready";
  else if (scaledScore < 60) readiness = "Not Ready";

  return {
    overallFeedback: `[OFFLINE COMPREHENSIVE EVALUATION] You completed the mock session. Your responses demonstrate a solid grasp of core fundamentals, but you can build more confidence by structuring your technical examples and practicing live coding scenarios.`,
    technicalScore: scaledScore,
    confidenceScore: confidence,
    readinessRating: readiness,
    keyStrengths: [
      "Good comprehension of the questions",
      "Clarity in explaining code structure and workflows",
      "Effective use of technical terminology"
    ],
    areasForImprovement: [
      "Provide more hands-on metrics or business impact in behavioral questions",
      "Go deeper into performance optimization and memory efficiency details"
    ]
  };
};

// ==================== END SMART MOCK INTERVIEW FALLBACKS ====================

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

    let aiData;
    try {
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

      aiData = JSON.parse(completion.choices[0].message.content);
    } catch (openaiErr) {
      console.warn('⚠️ OpenAI API Mock Questions Failed. Using Smart Offline Fallback:', openaiErr.message);
      aiData = getMockInterviewQuestionsFallback(jobTitle, resumeText);
    }

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

    let aiFeedback;
    try {
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

      aiFeedback = JSON.parse(completion.choices[0].message.content);
    } catch (openaiErr) {
      console.warn('⚠️ OpenAI API Mock submitAnswer Failed. Using Smart Offline Fallback:', openaiErr.message);
      aiFeedback = getMockSubmitAnswerFallback(questionObj.question, answerText);
    }

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

    let evaluation;
    try {
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

      evaluation = JSON.parse(completion.choices[0].message.content);
    } catch (openaiErr) {
      console.warn('⚠️ OpenAI API Mock getInterviewResult Failed. Using Smart Offline Fallback:', openaiErr.message);
      evaluation = getMockInterviewResultFallback(interview.responses);
    }

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
