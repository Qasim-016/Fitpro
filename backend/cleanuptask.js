const cron = require('node-cron');
const admin = require('firebase-admin');
const TemUser = require('./models/temuser'); // Temporary user collection model

cron.schedule('* * * * *', async () => {
  console.log('Running cleanup task for unverified users.');

  try {
    const cutoffTime = Date.now() - 1 * 60 * 1000; // 1 minute ago
    console.log('Cutoff time:', new Date(cutoffTime));

    // Find users who are older than the cutoff time
    const unverifiedUsers = await TemUser.find({ createdAt: { $lt: cutoffTime } });

    console.log('Unverified users found:', unverifiedUsers); // Log users found

    for (const tempUser of unverifiedUsers) {
      const { uid } = tempUser;
      try {
        const firebaseUser = await admin.auth().getUser(uid);

        if (!firebaseUser.emailVerified) {
          // Delete the unverified user from Firebase
          try {
            await admin.auth().deleteUser(uid);
            console.log(`User ${uid} deleted successfully from Firebase.`);
          } catch (error) {
            console.error(`Error deleting user ${uid}:`, error.message);
          }

        }

        // Remove the user from the temporary MongoDB collection
        await TemUser.deleteOne({ uid });
      } catch (error) {
        // console.error(`Error processing user ${uid}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error during cleanup task:', error.message);
  }
});
