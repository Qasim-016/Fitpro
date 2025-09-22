const GymSchedule = require('../models/gymtiming');

// Get all gym schedules
exports.getGymSchedule = async (req, res, next) => {
  try {
    const schedule = await GymSchedule.find();
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

// Update specific day's schedule
exports.updateGymSchedule = async (req, res, next) => {
  const { day } = req.params;
  const { startTime, endTime, status } = req.body;

  try {
    const updatedSchedule = await GymSchedule.findOneAndUpdate(
      { day },
      { startTime, endTime, status },
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: `Schedule for ${day} not found.` });
    }

    res.json(updatedSchedule);
  } catch (error) {
    next(error);
  }
};

// Initialize gym schedule (optional, run once)
exports.initializeSchedule = async () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const existingData = await GymSchedule.find();

  if (existingData.length === 0) {
    const schedule = days.map((day) => ({
      day,
      startTime: '-',
      endTime: '-',
      status: 'The gym is Closed',
    }));

    await GymSchedule.insertMany(schedule);
    console.log('Initialized gym schedule.');
  }
};
