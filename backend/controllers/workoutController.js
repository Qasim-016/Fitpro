const WorkoutPlan = require('../models/CustomizedWorkout'); // Adjust path as needed
const admin = require('firebase-admin');

exports.saveWorkoutPlan = async (req, res) => {
  const { level, goal } = req.body;
  const userId = req.user.uid;

  if (!level || !goal) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let plan = await WorkoutPlan.findOne({ userId });
    if (plan) {
      plan.level = level;
      plan.goal = goal;
      await plan.save();
    } else {
      plan = new WorkoutPlan({ userId, level, goal });
      await plan.save();
    }

    res.status(200).json({ message: 'Workout plan saved successfully!' });
  } catch (error) {
    console.error('Error saving workout plan:', error);
    res.status(500).json({ error: 'Error saving workout plan' });
  }
};

exports.getWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ userId: req.user.uid });
    if (plan) {
      res.status(200).json({ workoutPlan: plan });
    } else {
      res.status(404).json({ message: 'No workout plan found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching workout plan' });
  }
};

exports.deleteWorkoutPlan = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = await admin.auth().verifyIdToken(token);
    await WorkoutPlan.deleteOne({ userId: decoded.uid });
    res.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete workout plan' });
  }
};
