const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  verificationCode: {
    type: String,
    default: null
  },
  codeExpiresAt: {
    type: Date,
    default: null
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  usedLotteries: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);