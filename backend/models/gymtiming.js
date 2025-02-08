const mongoose = require('mongoose');

const gymtimingSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true }, // e.g., Monday, Tuesday
  startTime: { type: String, default: '-' }, // Default gym timings
  endTime: { type: String, default: '-' },
  status: { type: String, default: 'The gym is Closed' }, // Gym status (e.g., Open, Closed)
});

module.exports = mongoose.model('Gymtiming', gymtimingSchema);
