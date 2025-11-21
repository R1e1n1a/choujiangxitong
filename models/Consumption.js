const mongoose = require('mongoose');

const ConsumptionSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  qrSignature: {
    type: String,
    default: null
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

module.exports = mongoose.model('Consumption', ConsumptionSchema);