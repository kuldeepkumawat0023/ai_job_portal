const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  requirements: {
    type: [String],
    default: []
  },
  salary: {
    type: String, // Can be range like "50k-80k"
  },
  location: {
    type: String,
    required: [true, 'Please add a job location']
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    default: 'Full-time'
  },
  experience: {
    type: Number, // in years
    default: 0
  },
  category: {
    type: String, // e.g. IT, Marketing, Finance
    required: [true, 'Please add a category']
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
