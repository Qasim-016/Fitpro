const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const admin = require('firebase-admin');
require('./cleanuptask'); // Include the cleanup task
const User=require('./models/User')
const WorkoutPlan = require('./models/CustomizedWorkout');
const DietPlan = require('./models/DietPlan');
const http = require('http');
const socketIo = require('socket.io');
const chatbotRoutes = require('./routes/chatbotRoutes'); // Adjust path if needed
const { router: gymScheduleRoutes, initializeSchedule } = require('./routes/gymScheduleRoutes');
dotenv.config();

const app = express();
// app.use(express.json());
app.use(express.json({ limit: '10mb' }));  // Increase to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
let clients = new Set();

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Adjust this for security (e.g., specific frontend URL)
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    // console.log('✅ New client connected:', socket.id);

    socket.on('message', (message) => {
        // console.log('📩 Received message:', message);
        
        // Broadcast the message to all connected clients except the sender
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', () => {
        // console.log('❌ Client disconnected:', socket.id);
    });

    socket.on('error', (error) => {
        // console.error('⚠️ Socket.IO Error:', error);
    });
});
// API endpoint to send a notification


// Send test notifications every 10 seconds
setInterval(() => {
  const testNotification = {
      title: "💪 Stay Active!",
      body: "Remember to complete your workout today!",
  };

  clients.forEach(client => client.emit('notification', testNotification));
  console.log("📢 Test notification sent via WebSocket");
}, 10000);

// Existing Routes
app.use('/api/auth', authRoutes);
app.use('/api', chatbotRoutes);
app.use('/api', require('./routes/paymentRoutes')); // ✅ Add this line
app.use('/api', gymScheduleRoutes); // ✅ Add this

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
  } catch (error) {
      res.status(403).json({ error: 'Invalid or expired token' });
  }
};

app.post('/saveWorkoutPlan', verifyToken, async (req, res) => {
  console.log('Incoming request:', req.body);

  const { level, goal } = req.body;
  const userId = req.user.uid;

  if (!level || !goal) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
      const existingPlan = await WorkoutPlan.findOne({ userId });

      if (existingPlan) {
          existingPlan.level = level;
          existingPlan.goal = goal;
          await existingPlan.save();
          console.log('Updated workout plan:', existingPlan);
      } else {
          const newWorkout = new WorkoutPlan({ userId, level, goal});
          await newWorkout.save();
          console.log('New workout plan created:', newWorkout);
      }

      res.status(200).json({ message: 'Workout plan saved successfully!' });
  } catch (error) {
      console.error('Error saving workout plan:', error);
      res.status(500).json({ error: 'Error saving workout plan' });
  }
});



app.get('/getWorkoutPlan', verifyToken, async (req, res) => {
  const userId = req.user.uid;

  try {
      const workoutPlan = await WorkoutPlan.findOne({ userId });

      if (workoutPlan) {
          res.status(200).json({ workoutPlan });
      } else {
          res.status(404).json({ message: 'No workout plan found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching workout plan' });
  }
});

app.delete('/deleteWorkoutPlan', async (req, res) => {
  try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

      const decodedToken = await admin.auth().verifyIdToken(authHeader);
      const userId = decodedToken.uid;

      await WorkoutPlan.deleteOne({ userId }); // Assuming your collection is named WorkoutPlan

      res.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
      console.error('Error deleting workout plan:', error);
      res.status(500).json({ message: 'Failed to delete workout plan' });
  }
});

app.post('/saveDietPlan', verifyToken, async (req, res) => {
  try {
      const {  gender, height, level, duration, goal, currentWeight, targetWeight } = req.body;

      // Ensure numerical fields are valid numbers
      if ( isNaN(height) || isNaN(currentWeight) || isNaN(targetWeight)) {
          return res.status(400).json({ message: 'height, current weight, and target weight must be valid numbers' });
      }

      // Validate gender input
      if (!['Male', 'Female', 'Other'].includes(gender)) {
          return res.status(400).json({ message: 'Invalid gender. Allowed values: Male, Female, Other' });
      }

      // Validate weight goals
      if (goal === 'Weight Gain' && targetWeight <= currentWeight) {
          return res.status(400).json({ message: 'Target weight must be greater than current weight for Weight Gain' });
      } else if (goal === 'Weight Loss' && targetWeight >= currentWeight) {
          return res.status(400).json({ message: 'Target weight must be less than current weight for Weight Loss' });
      }

      const userId = req.user.uid; // Get user ID from Firebase token

      let dietPlan = await DietPlan.findOne({ userId });
      if (dietPlan) {
          // Update existing record
          // dietPlan.age = age;
          dietPlan.gender = gender;
          dietPlan.height = height;
          dietPlan.level = level;
          dietPlan.duration = duration;
          dietPlan.goal = goal;
          dietPlan.currentWeight = currentWeight;
          dietPlan.targetWeight = targetWeight;
      } else {
          // Create a new record
          dietPlan = new DietPlan({ userId, gender, height, level, duration, goal, currentWeight, targetWeight });
      }

      await dietPlan.save();
      return res.status(200).json({ message: 'Diet plan saved successfully', dietPlan });

  } catch (error) {
      console.error('Error saving diet plan:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.delete('/deleteDietPlan', async (req, res) => {
  try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

      const decodedToken = await admin.auth().verifyIdToken(authHeader);
      const userId = decodedToken.uid;

      await dietPlan.deleteOne({ userId }); // Assuming your collection is named WorkoutPlan

      res.json({ message: 'Diet plan deleted successfully' });
  } catch (error) {
      console.error('Error deleting Diet plan:', error);
      res.status(500).json({ message: 'Failed to delete Diet plan' });
  }
});

// 📌 API Route to Get User Diet Plan
app.get('/getDietPlan', verifyToken, async (req, res) => {
  const userId = req.user.uid;

  try {
      const dietPlan = await DietPlan.findOne({ userId });

      if (dietPlan) {
          res.status(200).json({ dietPlan });
      } else {
          res.status(404).json({ message: 'No diet plan found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching diet plan' });
  }
});


// 📌 API Route to Delete Diet Plan
app.post('/upload-profile-image', async (req, res) => {
  // console.log("Received request:", req.body);

  const { userId, image } = req.body;
  if (!userId || !image) {
    return res.status(400).json({ success: false, message: 'Missing userId or image' });
  }

  try {
    // Query using `uid` instead of `_id`
    const updatedUser = await User.findOneAndUpdate(
      { uid: userId }, // Match by `uid`
      { profileImage: image },
      { new: true }
    );

    if (!updatedUser) {
      console.log("User not found:", userId);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log("Image updated successfully for user:", userId);
    res.json({ success: true, message: 'Profile image updated' });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});



app.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.userId }); // Find by `uid`
    if (user) {
      res.json({ profileImage: user.profileImage });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});




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
