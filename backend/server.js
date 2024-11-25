const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Ensure correct path
const mongoose = require('mongoose')
const TempUser = require('./models/temuser')

dotenv.config();  // Load environment variables

const app = express();

app.use(express.json());
app.use(cors());  // Handle CORS

// Use the auth routes defined
app.use('/api/auth', authRoutes);  // This will handle all routes defined in auth.js
const admin = require('firebase-admin');  // Firebase Admin SDK import
const path = require('path');
// const dotenv = require('dotenv');

dotenv.config();  // Load environment variables

// Initialize Firebase Admin SDK (ensure this is called first)
const serviceAccountPath = process.env.FIREBASE_ADMIN_KEY_PATH;  // Path to your service account key

if (!admin.apps.length) {
  try {
    const serviceAccount = require(path.resolve(serviceAccountPath)); // Resolve path correctly
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected successfully.');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1); // Exit process if connection fails
    }
  };
  require('../backend/cleanuptask');

  connectDB();
  // async function deleteAllUsers() {
  //   try {
  //     let nextPageToken;
  //     do {
  //       const userRecords = await admin.auth().listUsers(1000, nextPageToken); // Fetch users in batches of 1000
  //       const userPromises = userRecords.users.map((user) => {
  //         return admin.auth().deleteUser(user.uid); // Delete each user
  //       });
  
  //       // Wait for all delete operations to complete
  //       await Promise.all(userPromises);
  //       console.log(`Successfully deleted batch of users`);
  
  //       nextPageToken = userRecords.pageToken;
  //     } while (nextPageToken); // Continue if there are more users
      
  //     console.log('All users deleted successfully.');
  //   } catch (error) {
  //     console.error('Error deleting users:', error);
  //   }
  // }
  
  // deleteAllUsers();
  // async function listAllUsers() {
  //   try {
  //     // Start listing users from the beginning.
  //     let nextPageToken;
  //     do {
  //       const userRecords = await admin.auth().listUsers(1000, nextPageToken); // Fetch 1000 users at a time
  //       userRecords.users.forEach((userRecord) => {
  //         console.log('User:', userRecord.toJSON());
  //       });
  //       nextPageToken = userRecords.pageToken;
  //     } while (nextPageToken);
  //   } catch (error) {
  //     console.error('Error listing users:', error);
  //   }
  // }
  
  // listAllUsers();

  // async function deleteAllTempUsers() {
  //   try {
  //     const result = await TempUser.deleteMany({}); // Delete all documents in the collection
  //     console.log(`Successfully deleted ${result.deletedCount} users from TempUser collection.`);
  //   } catch (error) {
  //     console.error('Error deleting users from TempUser collection:', error);
  //   }
  // }
  
  // deleteAllTempUsers();


 