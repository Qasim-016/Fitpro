const mongoose = require('mongoose');
const CustomizedWorkoutSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    level: { type: String, required: true },
    goal: { type: String, required: true },
});

module.exports = mongoose.model('CustomizedWorkout', CustomizedWorkoutSchema);