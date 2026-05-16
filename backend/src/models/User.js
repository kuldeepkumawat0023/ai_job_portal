const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Please add a full name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  countryCode: {
    type: String,
    required: [true, 'Please add a country code'],
    default: '+91'
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  location: {
    type: String,
    default: 'Remote'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // Don't return password by default
  },
  profilePhoto: {
    type: String,
  },
  bio: {
    type: String,
  },
  skills: {
    type: [String],
    default: []
  },
  education: [
    {
      degree: String,
      university: String,
      cgpa: String,
      year: String
    }
  ],
  workExperience: [
    {
      role: String,
      company: String,
      duration: String,
      description: String
    }
  ],
  projects: [
    {
      title: String,
      stack: [String],
      description: String,
      link: String
    }
  ],
  experience: {
    type: Number,
    default: 0
  },
  hasCompanyProfile: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  isOtpVerified: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  paymentId: {
    type: String,
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter', 'admin'],
    default: 'candidate'
  },
  resume: {
    type: String, // Cloudinary URL
  },
  resumeRetries: {
    type: Number,
    default: 0
  },
  jobSearches: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
