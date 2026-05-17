const mongoose = require('mongoose');

const aiChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// TTL Index: Auto-delete messages older than 24 hours
// 24 * 60 * 60 = 86400 seconds
aiChatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// Index for fast retrieval for a specific user
aiChatSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model('AIChat', aiChatSchema);
