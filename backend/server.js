const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Ensure correct path
const admin = require('firebase-admin');  // Firebase admin import
const { getFirestore } = require('firebase-admin/firestore');  // Firestore import
const path = require('path'); // Node.js path module to handle file paths securely

dotenv.config();  // Load environment variables

const app = express();

app.use(express.json());
app.use(cors());  // Handle CORS

// Firebase Admin Initialization (Only once here)
const serviceAccountPath = process.env.FIREBASE_ADMIN_KEY_PATH;  // Use the env variable for the service account path

// Ensure the service account path exists and is correctly resolved
if (!serviceAccountPath) {
    console.error('FIREBASE_ADMIN_KEY_PATH is not defined in the .env file.');
    process.exit(1);  // Exit the process if the path is not found
}

// Check if Firebase app has already been initialized to avoid multiple initializations
if (!admin.apps.length) {
    try {
        // Resolve the path and initialize Firebase Admin SDK
        const serviceAccount = require(path.resolve(serviceAccountPath));  // This will resolve the path properly
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin initialized successfully.");
    } catch (error) {
        console.error("Error initializing Firebase Admin:", error);
        process.exit(1);  // Exit if initialization fails
    }
} else {
    console.log('Firebase app already initialized');
}

// Initialize Firestore only after Firebase Admin has been initialized
 // Now it's safe to call Firestore

app.use('/api/auth', authRoutes);  // Use the authentication routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
