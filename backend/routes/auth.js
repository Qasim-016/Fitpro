const express = require('express');
const { signup, login, resetPassword, verifyCode, forgotPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/verify-code', verifyCode);
router.post('/forgot-password', forgotPassword);

module.exports = router;
