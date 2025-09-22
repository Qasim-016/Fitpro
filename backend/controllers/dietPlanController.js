const DietPlan = require("../models/DietPlan");

// Save or update diet plan
exports.saveDietPlan = async (req, res, next) => {
  try {
    const { gender, height, level, duration, goal, currentWeight, targetWeight } = req.body;

    // Parse inputs as numbers
    const parsedHeight = parseFloat(height);
    const parsedCurrentWeight = parseFloat(currentWeight);
    const parsedTargetWeight = parseFloat(targetWeight);

    // Validate parsed numbers
    if (isNaN(parsedHeight) || isNaN(parsedCurrentWeight) || isNaN(parsedTargetWeight)) {
      return res.status(400).json({ message: 'Height, current weight, and target weight must be valid numbers' });
    }

    // Validate gender
    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender. Allowed values: Male, Female, Other' });
    }

    // Validate goal and weight logic
    // Normalize goal input
const normalizedGoal = goal.trim().toLowerCase();

// Validate goal and weight logic
if (normalizedGoal === 'weight gain' && parsedTargetWeight <= parsedCurrentWeight) {
  return res.status(400).json({ message: 'Target weight must be greater than current weight for Weight Gain' });
} else if (normalizedGoal === 'weight loss' && parsedTargetWeight >= parsedCurrentWeight) {
  return res.status(400).json({ message: 'Target weight must be less than current weight for Weight Loss' });
}


    const userId = req.user.uid;

    // Check if diet plan exists for user
    let dietPlan = await DietPlan.findOne({ userId });
    if (dietPlan) {
      dietPlan.gender = gender;
      dietPlan.height = parsedHeight;
      dietPlan.level = level;
      dietPlan.duration = duration;
      dietPlan.goal = goal;
      dietPlan.currentWeight = parsedCurrentWeight;
      dietPlan.targetWeight = parsedTargetWeight;
    } else {
      dietPlan = new DietPlan({
        userId,
        gender,
        height: parsedHeight,
        level,
        duration,
        goal,
        currentWeight: parsedCurrentWeight,
        targetWeight: parsedTargetWeight
      });
    }

    await dietPlan.save();
    return res.status(200).json({ message: 'Diet plan saved successfully', dietPlan });

  } catch (error) {
    next(error);
  }
};

// Get diet plan
exports.getDietPlan = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const dietPlan = await DietPlan.findOne({ userId });

    if (dietPlan) {
      return res.status(200).json({ dietPlan });
    } else {
      return res.status(404).json({ message: 'No diet plan found' });
    }
  } catch (error) {
    next(error);
  }
};

// Delete diet plan
exports.deleteDietPlan = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    await DietPlan.deleteOne({ userId });
    return res.json({ message: 'Diet plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};
