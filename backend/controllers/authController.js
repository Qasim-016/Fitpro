// const admin = require('firebase-admin');
// const { getAuth } = require('firebase-admin/auth');

// // Initialize Firebase Admin SDK
// if (!admin.apps.length) {
//     const serviceAccount = require('C:/Users/Qasim/Desktop/FitPro/firebase-service-account.json');
//     admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//     });
// }

// // Signup
// exports.signup = async (req, res) => {
//     const { email, password, username, phone } = req.body;

//     if (!email || !password || !username || !phone) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     try {
//         const userRecord = await getAuth().createUser({
//             email,
//             password,
//             displayName: username,
//         });

//         res.status(201).json({ message: 'User registered successfully. Please verify your email.' });

//         // Send email verification link
//         const link = await getAuth().generateEmailVerificationLink(email);
//         console.log(`Verification link (send via email): ${link}`);
//     } catch (error) {
//         console.error('Error during signup:', error);
//         res.status(500).json({ message: 'Something went wrong' });
//     }
// };

// // Login
// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required' });
//     }

//     try {
//         const userRecord = await getAuth().getUserByEmail(email);

//         if (!userRecord.emailVerified) {
//             return res.status(403).json({ message: 'Please verify your email before logging in.' });
//         }

//         res.status(200).json({ message: 'Login successful. Use Firebase Client SDK for token-based authentication.' });
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ message: 'Something went wrong' });
//     }
// };





// // Reset Password (Client-Side Responsibility)
// exports.resetPassword = async (req, res) => {
//     res.status(501).json({ message: 'Reset password is handled via Firebase Client SDK.' });
// };    

// // Verify Code (No longer required with Firebase)
// exports.verifyCode = async (req, res) => {
//     res.status(501).json({ message: 'Verification is handled via Firebase email links.' });
// };    



const { getAuth } = require('firebase-admin/auth');
const {  doc, setDoc ,collection, query, where,getDocs} = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK


// const db = getFirestore();

// Signup
exports.signup = async (req, res) => {
    const { email, password, username, phone } = req.body;
  
    if (!email || !password || !username || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      const db = getFirestore(); // Ensure Firestore is initialized
  
      // Check if email already exists in Firestore
      const emailQuery = query(collection(db, 'users'), where('email', '==', email));
      const emailSnapshot = await getDocs(emailQuery);
  
      if (!emailSnapshot.empty) {
        return res.status(400).json({ message: 'This email is already registered. Please use a different email.' });
      }
  
      // Check if phone number already exists in Firestore
      const phoneQuery = query(collection(db, 'users'), where('phone', '==', phone));
      const phoneSnapshot = await getDocs(phoneQuery);
  
      if (!phoneSnapshot.empty) {
        return res.status(400).json({ message: 'This phone number is already registered. Please use a different phone number.' });
      }
  
      // Create user in Firebase Authentication
      const userRecord = await getAuth().createUser({
        email,
        password,
        displayName: username,
      });
  
      // Store user data in Firestore
      await setDoc(doc(db, 'users', userRecord.uid), {
        email,
        username,
        phone,
        createdAt: new Date(), // Use JavaScript Date for consistency
      });
  
      // Send verification email
      const link = await getAuth().generateEmailVerificationLink(email);
      console.log(`Verification link (send via email): ${link}`);
  
      res.status(201).json({
        message: 'User registered successfully. Please verify your email.',
      });
    } catch (error) {
      console.error('Signup error:', error);
  
      if (error.code === 'auth/invalid-email') {
        res.status(400).json({ message: 'Invalid email address format.' });
      } else if (error.code === 'auth/weak-password') {
        res.status(400).json({ message: 'Password is too weak. Please use a stronger password.' });
      } else {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
      }
    }};
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
        const link = await getAuth().generateEmailVerificationLink(email);
        
        // Retrieve user data from Firestore (if needed)
        const userDoc = await db.collection('users').doc(userRecord.uid).get();
        const userData = userDoc.data();

        res.status(200).json({ 
            message: 'Login successful.',
            userData, // Return user data from Firestore
        });
    } catch (error) {
        // console.error('Error during login:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
// Forgot Password Handler
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if the email is provided
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if the email exists in Firebase Authentication
    try {
      await admin.auth().getUserByEmail(email); // This will throw an error if the email doesn't exist
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({ message: 'No account associated with this email.' });
      }
      throw error; // Unexpected error
    }

    // Generate the password reset link
    const link = await admin.auth().generatePasswordResetLink(email);

    // For testing: Log the reset link (In production, you should send it via email)
    console.log(`Password reset link (send via email): ${link}`);

    // Respond with success
    res.status(200).json({
      message: 'A password reset link has been sent to your email.',
    });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({
      message: 'Failed to process the password reset request. Please try again.',
      error: error.message,
    });
  }
};


