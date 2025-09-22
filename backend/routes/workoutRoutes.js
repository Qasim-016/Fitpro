const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const asyncHandler = require('../middleware/asyncHandler');
const workoutController = require('../controllers/workoutController');

router.post('/saveWorkoutPlan', verifyToken, asyncHandler(workoutController.saveWorkoutPlan));

router.get('/getWorkoutPlan', verifyToken, asyncHandler(workoutController.getWorkoutPlan));

router.delete('/deleteWorkoutPlan', verifyToken, asyncHandler(workoutController.deleteWorkoutPlan));

module.exports = router;
