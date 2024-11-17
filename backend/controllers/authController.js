const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');

// Email Transporter Setup


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: 'pikachugaming565@gmail.com',
      pass: 'Uog-@-016', // or use an app-specific password if 2FA is enabled
    },
    debug: true,
  });

transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter error:', error);
  } else {
    console.log('Server is ready to send emails:', success);
  }
});

// Send Verification Email
const sendVerificationEmail = async (email, code) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Should match your Gmail account
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is: ${code}`,
      };
      

  await transporter.sendMail(mailOptions);
};

// Signup with Verification Code
exports.signup = async (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!username || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, phone, password: hashedPassword, isVerified: false });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await VerificationCode.create({ email, code: verificationCode });

    await sendVerificationEmail(email, verificationCode);
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Verify Code
exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const storedCode = await VerificationCode.findOne({ email, code });
    if (!storedCode) return res.status(400).json({ message: 'Invalid verification code' });

    await User.updateOne({ email }, { isVerified: true });
    await VerificationCode.deleteOne({ email });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Forgot Password with Verification Code
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await VerificationCode.create({ email, code: verificationCode });

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'Verification code sent to your email.' });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const storedCode = await VerificationCode.findOne({ email, code });
    if (!storedCode) return res.status(400).json({ message: 'Invalid verification code' });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.updateOne({ email }, { password: hashedPassword });

    await VerificationCode.deleteOne({ email });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ result: user, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
