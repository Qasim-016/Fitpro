// const mongoose = require('mongoose');
// const DietPlanSchema = new mongoose.Schema({
//     userId: { type: String, required: true, unique: true },
//     level: { type: String, required: true },
//     duration: { type: String, required: true },
//     goal: { type: String, required: true },
//     currentWeight: { type: Number, required: true },
//     targetWeight: { type: Number, required: true },
// });

// module.exports = mongoose.model('DietPlan', DietPlanSchema);


const mongoose = require('mongoose');

const DietPlanSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, 
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },  // Added gender
    height: { type: Number, required: true },  // Added height in cm
    level: { type: String, required: true },  // Beginner, Intermediate, Advanced
    duration: { type: String, required: true },  // e.g., "3 months"
    goal: { type: String, required: true },  // e.g., "Weight Loss", "Muscle Gain"
    currentWeight: { type: Number, required: true },  
    targetWeight: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', DietPlanSchema);
