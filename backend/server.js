const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');  // Ensure correct path

dotenv.config();  // Load environment variables

const app = express();

app.use(express.json());
app.use(cors());  // Handle CORS

// Firebase Admin Initialization
const admin = require('firebase-admin');
const serviceAccount = require('C:/Users/Qasim/Desktop/FitPro/firebase-service-account.json');

// Check if Firebase app has already been initialized
if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    console.log('Firebase app already initialized');
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log('MongoDB connection error:', error));

app.use('/api/auth', authRoutes);  // Use the authentication routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
