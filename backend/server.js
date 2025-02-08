const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');
const stripe = require('stripe')('sk_test_51QQorvDwtEPD58vaGf1gfpz6XX0Ns7nSUbfZ97vLntYdtMftqiiPpfhHT48RmrpQg6og69nIkFmZWsY4tDHMbZaI00ulYSpyAe');
const authRoutes = require('./routes/auth');
const TempUser = require('./models/temuser');
const GymSchedule = require('./models/gymtiming'); // Import gym schedule schema
const admin = require('firebase-admin');
require('./cleanuptask'); // Include the cleanup task
const Subscription = require('./models/subscription');




// Schedule the status check to run every minute


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firebase Admin
const serviceAccountPath = process.env.FIREBASE_ADMIN_KEY_PATH;

if (!admin.apps.length) {
  try {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    process.exit(1);
  }
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Google Generative AI Initialization
const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

// Existing Routes
app.use('/api/auth', authRoutes);

// Chatbot API
app.post('/api/chatbot', async (req, res) => {
  const { question } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([question]);
    const responseText = result.response.text() || 'Sorry, no response generated.';
    res.json({ answer: responseText });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate response.' });
  }
});

// Payment API
// Payment Intent Endpoint
app.post('/api/payment-intent', async (req, res) => {
  try {
    const { amount, userId, username } = req.body;

    // Create a payment intent using Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 100, // Amount in cents
      currency: 'usd',
      metadata: { userId, username },
    });

    // Get the current date (startDate)
    const startDate = new Date();

    // Calculate subscription end date (for example, add 30 days for a one-month subscription)
    const subscriptionEndTime = new Date(startDate);
    subscriptionEndTime.setMonth(startDate.getMonth() + 1);
    // Save the subscription details in the MongoDB database
    const newSubscription = new Subscription({
      userId,
      email: 'user@example.com', // Replace with actual email if needed
      name: username, // Store the user's name
      amount,
      startDate,
      subscriptionEndTime,
    });

    // Save the subscription record to MongoDB
    await newSubscription.save();

    // Send the client secret back to the frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

// Subscription Save Endpoint
app.post('/api/subscription', async (req, res) => {
  try {
    const { userId, subscriptionEndTime } = req.body;
    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      { subscriptionEndTime },
      { new: true, upsert: true } // Creates a new document if it doesn't exist
    );

    res.json({ success: true, subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save subscription data' });
  }
});

// Subscription Delete Endpoint
app.delete('/api/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await Subscription.findOneAndDelete({ userId });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

const Trial = require('./models/trialSchema'); // Import the Trial model
app.get('/api/trial/:userId', async (req, res) => {
  try {
    console.log("Received request for userId:", req.params.userId);
    const trial = await Trial.findOne({ userId: req.params.userId });
if(!trial){
  return res.status(404).json({error:'No Trial'})
}
    if (trial.trialStatus==='inactive') {
      return res.status(404).json({ error: 'No free trial found' });
    }

    console.log("Trial found:", trial);

    if (trial.trialStatus === 'active') {
      console.log("✅ Trial is active!");
      return res.status(200).json({ success: true, trialStatus: 'active' });
    }

    
  } catch (error) {
    console.error('❌ Error fetching trial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
const updateExpiredTrials = async () => {
  try {
    const currentDate = new Date();

    // Find trials where the end time has passed and status is still "active"
    const expiredTrials = await Trial.find({ endTime: { $lte: currentDate }, trialStatus: 'active' });

    for (const trial of expiredTrials) {
      trial.trialStatus = 'inactive'; // Set trial status to inactive
      await trial.save();
      console.log(`⏳ Trial expired for user: ${trial.userId}`);
    }
  } catch (error) {
    console.error('❌ Error updating expired trials:', error);
  }
};

// Run every hour (3600000ms)
setInterval(updateExpiredTrials, 6000);
console.log('🔄 Trial auto-expiration job started...');


app.get('/api/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' }); // ✅ Explicit 404
    }

    res.json({ subscriptionEndTime: subscription.subscriptionEndTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve subscription data' });
  }
});




// Gym Schedule APIs
// Get the entire gym schedule
app.get('/api/gym-schedule', async (req, res) => {
  try {
    const schedule = await GymSchedule.find();
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Failed to fetch gym schedule', error });
  }
});
// Express route to handle user data update

// Update a specific day's schedule
app.put('/api/gym-schedule/:day', async (req, res) => {
  const { day } = req.params;
  const { startTime, endTime, status } = req.body;

  try {
    const updatedSchedule = await GymSchedule.findOneAndUpdate(
      { day },
      { startTime, endTime, status },
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: `Schedule for ${day} not found.` });
    }

    res.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Failed to update gym schedule', error });
  }
});

// Initialize gym schedule for all days (run once)
const initializeSchedule = async () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const existingData = await GymSchedule.find();

  if (existingData.length === 0) {
    const schedule = days.map((day) => ({
      day,
      startTime: '-',
      endTime: '-',
      status: 'The gym is Closed',
    }));

    await GymSchedule.insertMany(schedule);
    console.log('Initialized gym schedule.');
  }
};

initializeSchedule();

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


































  
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
