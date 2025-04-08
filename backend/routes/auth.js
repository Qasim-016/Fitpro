const express = require('express');
const { signup, login,getUserData ,verifyUserEmail, checkEmailAndSendOTP,verifyOTPAndResetPassword,trial,updateUser,startTrial} = require('../controllers/authController');
const {createContact } = require('../controllers/Contactcontroller')
const router = express.Router();
router.post('/checkEmailAndSendOTP',checkEmailAndSendOTP)
router.post('/verifyOTPAndResetPassword',verifyOTPAndResetPassword)
router.get('/getUserdata',getUserData)
router.post('/signup', signup);
router.post('/login', login);
router.post('/verifyUserEmail',verifyUserEmail);
router.post('/submit',createContact)
router.post('/updateUser',updateUser)
router.post('/startTrial', startTrial);
module.exports = router;





