const express = require('express');
const { signup, login, getUserData ,verifyUserEmail, checkEmailAndSendOTP,verifyOTPAndResetPassword} = require('../controllers/authController');
const router = express.Router();
router.post('/checkEmailAndSendOTP',checkEmailAndSendOTP)
router.post('/verifyOTPAndResetPassword',verifyOTPAndResetPassword)
router.post('/getuserdata',getUserData)
router.post('/signup', signup);
router.post('/login', login);
router.post('/verifyUserEmail',verifyUserEmail);


module.exports = router;

