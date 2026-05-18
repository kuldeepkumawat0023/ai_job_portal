const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'pending', 'shortlisted', 'interview', 'interviewing', 'hired', 'rejected'],
    default: 'applied'
  },
  aiScore: {
    type: Number,
    default: 0
  },
  technicalScore: {
    type: Number,
    default: 0
  },
  communicationScore: {
    type: Number,
    default: 0
  },
  cultureScore: {
    type: Number,
    default: 0
  },
  recruiterNotes: {
    type: String
  },
  recruiterRefinedNotes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
