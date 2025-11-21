const mongoose = require('mongoose');

const LotterySchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true
  },
  prize: {
    type: String,
    required: true
  },
  probability: {
    type: Number,
    required: true
  },
  time: {
    type: String,
    default: () => new Date().toLocaleString('zh-CN')
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lottery', LotterySchema);