const express = require('express');
const { signup, login,getUserData ,verifyUserEmail, checkEmailAndSendOTP,verifyOTPAndResetPassword} = require('../controllers/authController');
const {createContact } = require('../controllers/Contactcontroller')
const router = express.Router();
router.post('/checkEmailAndSendOTP',checkEmailAndSendOTP)
router.post('/verifyOTPAndResetPassword',verifyOTPAndResetPassword)
router.get('/getUserdata',getUserData)
router.post('/signup', signup);
router.post('/login', login);
router.post('/verifyUserEmail',verifyUserEmail);
router.post('/submit',createContact)



// Replace with your actual chatbot API URL or service



module.exports = router;

