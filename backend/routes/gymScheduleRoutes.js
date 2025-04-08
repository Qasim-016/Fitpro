// routes/gymScheduleRoutes.js
const express = require('express');
const router = express.Router();
const GymSchedule = require('../models/gymtiming'); // Import gym schedule schema

// Get all gym schedule data
router.get('/gym-schedule', async (req, res) => {
  try {
    const schedule = await GymSchedule.find();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gym schedule', error });
  }
});

// Update specific day's schedule
router.put('/gym-schedule/:day', async (req, res) => {
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
    res.status(500).json({ message: 'Failed to update gym schedule', error });
  }
});

// Initialize gym schedule (optional to run once externally)
const initializeSchedule = async () => {
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

// You can export this to run from server.js once
module.exports = {
  router,
  initializeSchedule
};
