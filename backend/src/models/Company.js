const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  logo: {
    type: String, // Cloudinary URL
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
