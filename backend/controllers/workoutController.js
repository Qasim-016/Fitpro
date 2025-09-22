// controllers/workoutController.js
const WorkoutPlan = require('../models/CustomizedWorkout');

exports.saveWorkoutPlan = async (req, res) => {
  const { level, goal } = req.body;
  const userId = req.user.uid;

  if (!level || !goal) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existingPlan = await WorkoutPlan.findOne({ userId });

  if (existingPlan) {
    existingPlan.level = level;
    existingPlan.goal = goal;
    await existingPlan.save();
  } else {
    const newWorkout = new WorkoutPlan({ userId, level, goal });
    await newWorkout.save();
  }

  res.status(200).json({ message: 'Workout plan saved successfully!' });
};

exports.getWorkoutPlan = async (req, res) => {
  const userId = req.user.uid;

  const workoutPlan = await WorkoutPlan.findOne({ userId });

  if (workoutPlan) {
    res.status(200).json({ workoutPlan });
  } else {
    res.status(404).json({ message: 'No workout plan found' });
  }
};

exports.deleteWorkoutPlan = async (req, res) => {
  const userId = req.user.uid;

  await WorkoutPlan.deleteOne({ userId });
  res.json({ message: 'Workout plan deleted successfully' });
};
