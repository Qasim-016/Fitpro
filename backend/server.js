const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const admin = require('firebase-admin');
require('./cleanuptask'); // Include the cleanup task
const User=require('./models/User')
const http = require('http');
const socketIo = require('socket.io');
const chatbotRoutes = require('./routes/chatbotRoutes'); // Adjust path if needed
const { router: gymScheduleRoutes, initializeSchedule } = require('./routes/gymScheduleRoutes');
const workoutRoutes = require("./routes/workoutRoutes");
const dietRoutes = require("./routes/dietRoutes");
const subscriptionController = require('./controllers/subscriptionController');
const errorHandler = require('./middleware/errorHandler');


dotenv.config();
const app = express();
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

    socket.on('message', (message) => {
        
        // Broadcast the message to all connected clients except the sender
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', () => {
    });

    socket.on('error', (error) => {
    });
});
// Send test notifications every 10 seconds
setInterval(() => {
  const testNotification = {
      title: "Stay Active!",
      body: "Remember to complete your workout today!",
  };

  clients.forEach(client => client.emit('notification', testNotification));
  console.log("Test notification sent via WebSocket");
}, 10000);

app.use("/api/workout", workoutRoutes);
app.use("/api/diet", dietRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', chatbotRoutes);
app.use('/api', require('./routes/paymentRoutes')); //
app.use('/api', gymScheduleRoutes);

setInterval(subscriptionController.updateExpiredTrials, 3600000);



app.use(errorHandler);


app.post('/upload-profile-image', async (req, res) => {

  const { userId, image } = req.body;
  if (!userId || !image) {
    return res.status(400).json({ success: false, message: 'Missing userId or image' });
  }

  try {
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
const PORT = process.env.PORT || 10000;

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
