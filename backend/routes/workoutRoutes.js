const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  saveWorkoutPlan,
  getWorkoutPlan,
  deleteWorkoutPlan,
} = require('../controllers/workoutController');

router.post('/saveWorkoutPlan', verifyToken, saveWorkoutPlan);
router.get('/getWorkoutPlan', verifyToken, getWorkoutPlan);
router.delete('/deleteWorkoutPlan', deleteWorkoutPlan);

module.exports = router;
