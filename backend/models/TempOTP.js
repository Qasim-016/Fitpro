const mongoose = require('mongoose');

const TempOTPSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true,lowercase:true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  requestCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('TempOTP', TempOTPSchema);
