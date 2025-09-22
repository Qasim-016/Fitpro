const express = require('express');
const router = express.Router();
const gymScheduleController = require('../controllers/gymScheduleController');

router.get('/gym-schedule', gymScheduleController.getGymSchedule);
router.put('/gym-schedule/:day', gymScheduleController.updateGymSchedule);

module.exports = {
  router,
  initializeSchedule: gymScheduleController.initializeSchedule,
};

