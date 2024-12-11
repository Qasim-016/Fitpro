// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const authRoutes = require('./routes/auth'); // Ensure correct path
// const mongoose = require('mongoose')
// const TempUser = require('./models/temuser')

// dotenv.config();  // Load environment variables

// const app = express();

// app.use(express.json());
// app.use(cors());  // Handle CORS

// // Use the auth routes defined
// app.use('/api/auth', authRoutes);  // This will handle all routes defined in auth.js
// const admin = require('firebase-admin');  // Firebase Admin SDK import
// const path = require('path');
// // const dotenv = require('dotenv');

// dotenv.config();  // Load environment variables

// // Initialize Firebase Admin SDK (ensure this is called first)
// const serviceAccountPath = process.env.FIREBASE_ADMIN_KEY_PATH;  // Path to your service account key

// if (!admin.apps.length) {
//   try {
//     const serviceAccount = require(path.resolve(serviceAccountPath)); // Resolve path correctly
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     });
//     console.log("Firebase Admin initialized successfully.");
//   } catch (error) {
//     console.error("Error initializing Firebase Admin:", error);
//     process.exit(1);  // Exit if initialization fails
//   }
// } else {
//   console.log('Firebase app already initialized');
// }

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// const connectDB = async () => {
//     try {
//       await mongoose.connect(process.env.MONGO_URI);
//       console.log('MongoDB connected successfully.');
//     } catch (error) {
//       console.error('MongoDB connection error:', error);
//       process.exit(1); // Exit process if connection fails
//     }
//   };
//   require('../backend/cleanuptask');

//   connectDB();




const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Google Generative AI
const fs = require("fs"); 
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');  // To make HTTP requests
const authRoutes = require('./routes/auth'); 
const mongoose = require('mongoose');
const TempUser = require('./models/temuser');
const admin = require('firebase-admin');  
const path = require('path');
const stripe = require('stripe')('sk_test_51QQorvDwtEPD58vaGf1gfpz6XX0Ns7nSUbfZ97vLntYdtMftqiiPpfhHT48RmrpQg6og69nIkFmZWsY4tDHMbZaI00ulYSpyAe');  // Add Stripe


dotenv.config();  

const app = express();
app.use(express.json());
app.use(cors());  

// Use the auth routes defined
app.use('/api/auth', authRoutes);
const genAI = new GoogleGenerativeAI('AIzaSyCgbn6HgBeV-Qr0ug83PQrGzyyAePJRxkg');  // Use environment variable for API key


const serviceAccountPath = process.env.FIREBASE_ADMIN_KEY_PATH; 

if (!admin.apps.length) {
  try {
    const serviceAccount = require(path.resolve(serviceAccountPath)); 
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    process.exit(1);  
  }
} else {
  console.log('Firebase app already initialized');
}

const PORT = process.env.PORT || 5000;

// Chatbot route to handle chat requests

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

require('../backend/cleanuptask');

connectDB();

app.post('/api/chatbot', async (req, res) => {
  const { question } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate response from Gemini API using the question
    const result = await model.generateContent([question]);

    // Return the response text back to the frontend
    const responseText = result.response.text() || "Sorry, no response generated.";
    res.json({ answer: responseText });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});
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


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// Backend Code (add to your existing backend)






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
// app.post('/api/chat', async (req, res) => {
//   const { userId, question } = req.body;

//   try {
//     // Set up Botpress API URL
//     const botpressApiUrl = `https://da9f-103-137-70-36.ngrok-free.app/afb3a350-fa84-432d-bc9f-969c2450865d/${userId}`;
    
//     // Send a message to Botpress
//     const response = await axios.post(botpressApiUrl, {
//       type: 'text',
//       text: question,
//     });

//     // Get the bot's response from Botpress
//     const botResponse = response.data.responses[0].text || 'I didn’t get that. Can you try again?';

//     // Send the bot's response back to the frontend
//     res.json({ reply: botResponse });
//   } catch (error) {
//     console.error('Error handling chat request:', error);
//     res.status(500).send('Server error');
//   }
// });

// // Payment intent route for Stripe
// // Stripe Payment Intent Route
// app.post('/api/payment-intent', async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount) {
//       return res.status(400).send('Amount is required.');
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // Convert to cents
//       currency: 'usd',
//       payment_method_types: ['card'],
//     });

//     res.status(200).send({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error('Error creating payment intent:', error);
//     res.status(500).send({ message: 'Payment intent creation failed.', error });
//   }
// });



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

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });














  
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





 


 