const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    line1: String,
    city: String,
    state: String,
    postal_code: String,
    country: String
  },
  taxId: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Billing', billingSchema);
