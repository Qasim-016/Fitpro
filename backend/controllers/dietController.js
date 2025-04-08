const DietPlan = require('../models/DietPlan'); // Adjust path
const admin = require('firebase-admin');

exports.saveDietPlan = async (req, res) => {
  try {
    const { gender, height, level, duration, goal, currentWeight, targetWeight } = req.body;

    if (isNaN(height) || isNaN(currentWeight) || isNaN(targetWeight)) {
      return res.status(400).json({ message: 'height, current weight, and target weight must be valid numbers' });
    }

    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender. Allowed values: Male, Female, Other' });
    }

    if (goal === 'Weight Gain' && targetWeight <= currentWeight) {
      return res.status(400).json({ message: 'Target weight must be greater than current weight for Weight Gain' });
    } else if (goal === 'Weight Loss' && targetWeight >= currentWeight) {
      return res.status(400).json({ message: 'Target weight must be less than current weight for Weight Loss' });
    }

    const userId = req.user.uid;

    let dietPlan = await DietPlan.findOne({ userId });
    if (dietPlan) {
      Object.assign(dietPlan, { gender, height, level, duration, goal, currentWeight, targetWeight });
    } else {
      dietPlan = new DietPlan({ userId, gender, height, level, duration, goal, currentWeight, targetWeight });
    }

    await dietPlan.save();
    res.status(200).json({ message: 'Diet plan saved successfully', dietPlan });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findOne({ userId: req.user.uid });
    if (dietPlan) {
      res.status(200).json({ dietPlan });
    } else {
      res.status(404).json({ message: 'No diet plan found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching diet plan' });
  }
};

exports.deleteDietPlan = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = await admin.auth().verifyIdToken(token);
    await DietPlan.deleteOne({ userId: decoded.uid });
    res.json({ message: 'Diet plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Diet plan' });
  }
};
