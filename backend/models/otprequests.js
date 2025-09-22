const mongoose = require('mongoose');

const otpRequestSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  requestCount: { type: Number, default: 0 },
  lastRequestTime: { type: Date, default: Date.now }
});

const OTPRequest = mongoose.model('OTPRequest', otpRequestSchema);

module.exports = OTPRequest;
