// const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Google Generative AI
// const fs = require("fs"); 
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const axios = require('axios');  // To make HTTP requests
// const authRoutes = require('./routes/auth'); 
// const mongoose = require('mongoose');
// const TempUser = require('./models/temuser');
// const admin = require('firebase-admin');  
// const path = require('path');
// const stripe = require('stripe')('sk_test_51QQorvDwtEPD58vaGf1gfpz6XX0Ns7nSUbfZ97vLntYdtMftqiiPpfhHT48RmrpQg6og69nIkFmZWsY4tDHMbZaI00ulYSpyAe');  // Add Stripe


// dotenv.config();  

// const app = express();
// app.use(express.json());
// app.use(cors());  

// // Use the auth routes defined
// app.use('/api/auth', authRoutes);
// const genAI = new GoogleGenerativeAI('AIzaSyCgbn6HgBeV-Qr0ug83PQrGzyyAePJRxkg');  // Use environment variable for API key


// const serviceAccountPath = process.env.FIREBASE_ADMIN_KEY_PATH; 

// if (!admin.apps.length) {
//   try {
//     const serviceAccount = require(path.resolve(serviceAccountPath)); 
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     });
//     console.log("Firebase Admin initialized successfully.");
//   } catch (error) {
//     console.error("Error initializing Firebase Admin:", error);
//     process.exit(1);  
//   }
// } else {
//   console.log('Firebase app already initialized');
// }

// const PORT = process.env.PORT || 5000;

// // Chatbot route to handle chat requests

// // Connect to MongoDB
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('MongoDB connected successfully.');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1); 
//   }
// };

// require('../backend/cleanuptask');

// connectDB();

// app.post('/api/chatbot', async (req, res) => {
//   const { question } = req.body;

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Generate response from Gemini API using the question
//     const result = await model.generateContent([question]);

//     // Return the response text back to the frontend
//     const responseText = result.response.text() || "Sorry, no response generated.";
//     res.json({ answer: responseText });
//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     res.status(500).json({ error: "Failed to generate response." });
//   }
// });
// app.post('/api/payment-intent', async (req, res) => {
//     try {
//       const { amount } = req.body;
  
//       if (!amount) {
//         return res.status(400).send('Amount is required.');
//       }
  
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: amount * 100, // Convert to cents
//         currency: 'usd',
//         payment_method_types: ['card'],
//       });
  
//       res.status(200).send({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//       console.error('Error creating payment intent:', error);
//       res.status(500).send({ message: 'Payment intent creation failed.', error });
//     }
//   });


// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

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
const GymSchedule = require('./models/gymSchedule'); // Import gym schedule schema
const admin = require('firebase-admin');

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
app.post('/api/payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).send('Amount is required.');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ message: 'Payment intent creation failed.', error });
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
      startTime: '6:00 AM',
      endTime: '10:00 PM',
      status: 'Closed',
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
