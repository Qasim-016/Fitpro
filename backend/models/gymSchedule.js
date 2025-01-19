const mongoose = require('mongoose');

const gymScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true }, // e.g., Monday, Tuesday
  startTime: { type: String, default: '6:00 AM' }, // Default gym timings
  endTime: { type: String, default: '10:00 PM' },
  status: { type: String, default: 'Closed' }, // Gym status (e.g., Open, Closed)
});

module.exports = mongoose.model('GymSchedule', gymScheduleSchema);
