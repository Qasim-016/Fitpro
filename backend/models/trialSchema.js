const mongoose = require('mongoose');

const trialSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    startDate: { type: Date, required: true },
    endTime: { type: Date, required: true }, // Full end date-time
    trialStatus: { type: String, enum: ['active', 'inactive'], default: 'inactive' }, // New field
      count: { type: Number, default: 0 }, // Add count variable

}, { timestamps: true });

const Trial = mongoose.model('Trial', trialSchema);
module.exports = Trial;

