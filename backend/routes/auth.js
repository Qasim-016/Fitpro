const express = require('express');
const { signup, login, checkEmail,getUserData ,verifyUserEmail, resetPassword,sendResetEmail,checkEmailAndSendOTP,verifyOTPAndResetPassword} = require('../controllers/authController');
// const {UpdatePassword} = require('/Users/Qasim/Desktop/FitPro/app/(AuthScreens)/UpdatePassword')
const router = express.Router();

// Other routes like signup, login, etc.
// router.post('UpdatePassword',UpdatePassword)
router.post('/checkEmailAndSendOTP',checkEmailAndSendOTP)
router.post('/verifyOTPAndResetPassword',verifyOTPAndResetPassword)
// router.post('/checkEmail', checkEmail); // Check if email exists in database
// router.post('/sendResetEmail', sendResetEmail); // Send password reset email via Firebase
// router.post('/resetPassword', resetPassword); 
router.post('/getuserdata',getUserData)
router.post('/signup', signup);
router.post('/login', login);
router.post('/verifyUserEmail',verifyUserEmail)
// router.get('/getuserByEmail',getUserByEmail)
// const OTPRequest = require('../models/otprequests'); // Import the OTPRequest model
// const { sendOTP } = require('./otpService'); // Assuming this function sends OTP

// const handleSendOTP = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if the email exists in the database (same as current check)
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ status: 'error', message: 'Email not registered.' });
//     }

//     // Find the OTP request record for the email
//     let otpRequest = await OTPRequest.findOne({ email });

//     // If no record exists, create a new one
//     if (!otpRequest) {
//       otpRequest = new OTPRequest({ email, requestCount: 0, lastRequestTime: Date.now() });
//     }

//     // Calculate the time difference from the last request
//     const timeDifference = Date.now() - new Date(otpRequest.lastRequestTime).getTime();

//     // If more than 24 hours have passed since the last request, reset the count
//     if (timeDifference > 24 * 60 * 60 * 1000) {
//       otpRequest.requestCount = 0;
//       otpRequest.lastRequestTime = Date.now();
//     }

//     // Check if the user has exceeded the daily limit of 10 OTP requests
//     if (otpRequest.requestCount >= 10) {
//       return res.status(400).json({ status: 'error', message: 'You have exceeded the maximum OTP request limit for today.' });
//     }

//     // Increment the OTP request count
//     otpRequest.requestCount += 1;
//     otpRequest.lastRequestTime = Date.now();

//     // Save the updated OTP request record
//     await otpRequest.save();

//     // Send OTP (assumes you have a sendOTP function for sending the OTP)
//     await sendOTP(email);

//     return res.status(200).json({ status: 'success', message: 'OTP sent successfully.' });
//   } catch (error) {
//     console.error('Error handling OTP request:', error);
//     return res.status(500).json({ status: 'error', message: 'Error processing OTP request.' });
//   }
// };
// handleSendOTP();
module.exports = router;