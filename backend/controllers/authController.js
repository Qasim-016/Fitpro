const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const serviceAccount = require('C:/Users/Qasim/Desktop/FitPro/firebase-service-account.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

// Signup
exports.signup = async (req, res) => {
    const { email, password, username, phone } = req.body;

    if (!email || !password || !username || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const userRecord = await getAuth().createUser({
            email,
            password,
            displayName: username,
        });

        res.status(201).json({ message: 'User registered successfully. Please verify your email.' });

        // Send email verification link
        const link = await getAuth().generateEmailVerificationLink(email);
        console.log(`Verification link (send via email): ${link}`);
    } catch (error) {
        console.error('Error during signup:', error);
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
        const userRecord = await getAuth().getUserByEmail(email);

        if (!userRecord.emailVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        res.status(200).json({ message: 'Login successful. Use Firebase Client SDK for token-based authentication.' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const link = await getAuth().generatePasswordResetLink(email);
        console.log(`Password reset link (send via email): ${link}`);
        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Reset Password (Client-Side Responsibility)
exports.resetPassword = async (req, res) => {
    res.status(501).json({ message: 'Reset password is handled via Firebase Client SDK.' });
};

// Verify Code (No longer required with Firebase)
exports.verifyCode = async (req, res) => {
    res.status(501).json({ message: 'Verification is handled via Firebase email links.' });
};
