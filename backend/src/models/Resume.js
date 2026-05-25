const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String, // Cloudinary URL
    required: true
  },
  isDefault: {
    type: Boolean,
    default: true
  },
  isAnalyzed: {
    type: Boolean,
    default: false
  },
  // AI Analysis Fields
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  summary: {
    type: String
  },
  skills: [String],
  strengths: [String],
  weaknesses: [String],
  coachingTips: [String],
  experience: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior']
  },
  recommendedRoles: [String],
  // Legacy parsed data
  parsedData: {
    skills: [String],
    experienceYears: Number,
    summary: String,
    education: [Object],
    projects: [Object]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
