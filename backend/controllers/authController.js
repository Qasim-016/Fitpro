const User = require('../models/user'); // Assuming User model is correctly defined
const TemUser = require('../models/temuser')
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');



const nodemailer = require('nodemailer');
const TempOTP = require('../models/TempOTP');
const bcrypt = require('bcryptjs');

const { getAuth } = require('firebase-admin/auth');  // Temporary collection to store OTPs
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.signup = async (req, res, next) => {
  const { email, username, phone, uid, password } = req.body;

  if (!email || !username || !phone || !password || !uid) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      await admin.auth().deleteUser(uid);
      console.log(`User with UID ${uid} deleted from Firebase after 1 minute.`);
      return res.status(409).json({ message: 'phone number already registered.' });
    }

    let firebaseUser;
    firebaseUser = await admin.auth().getUser(uid);

    const hashedPassword = await bcrypt.hash(password, 10);

    const tempUser = new TemUser({
      uid,
      email,
      username,
      phone,
      password,
    });
    await tempUser.save();

    console.log('TempUser saved:', tempUser);

    const verificationLink = await admin.auth().generateEmailVerificationLink(email);
    console.log('Verification link generated:', verificationLink);
    console.log(password);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "pikachugaming565@gmail.com",
        pass: "crkzwidgxlglnpaf",
      },
    });

    async function main() {
      const info = await transporter.sendMail({
        from: 'pikachugaming565@gmail.com',
        to: email,
        subject: "Verify your email",
        html: `${verificationLink}`,
      });
      console.log("Message sent: %s", info.messageId);
    }

    main().catch(console.error);
    console.log('Verification email sent.');

    res.status(201).json({
      message: 'Account created successfully. Please verify your email.',
      verificationLink,
    });
  } catch (error) {
    next(error);
  }
};


exports.verifyUserEmail = async (req, res, next) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ message: 'UID is required.' });
  }

  try {
    console.log('Starting email verification process...');
    console.log(`Received UID: ${uid}`);

    const firebaseUser = await admin.auth().getUser(uid);
    console.log(`Checking emailVerified for UID ${uid}:`, firebaseUser.emailVerified);

    const tempUser = await TemUser.findOne({ uid });
    if (!tempUser) {
      console.error(`TempUser not found for UID: ${uid}`);
      return res.status(404).json({ message: 'User not found in temporary storage.' });
    }

    console.log('TempUser retrieved:', tempUser);

    if (!firebaseUser.emailVerified) {
      setTimeout(async () => {
        try {
          const updatedFirebaseUser = await admin.auth().getUser(uid);
          const hashedPassword = await bcrypt.hash(tempUser.password, 10);

          if (updatedFirebaseUser.emailVerified) {
            const user = new User({
              uid: tempUser.uid,
              email: tempUser.email,
              username: tempUser.username,
              phone: tempUser.phone,
              password: hashedPassword,
            });

            await user.save();
            console.log('User successfully saved to permanent database:', user);
            await TemUser.deleteOne({ uid });
            console.log('TempUser successfully removed after verification:', tempUser);

            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              auth: {
                user: "pikachugaming565@gmail.com",
                pass: "crkzwidgxlglnpaf",
              },
            });

            async function main() {
              const info = await transporter.sendMail({
                from: 'pikachugaming565@gmail.com',
                to: firebaseUser.email,
                subject: "Verification successful",
                text: 'You are successfully verified ,Now you can SignIn'
              });
              console.log("Message sent: %s", info.messageId);
            }

            main().catch(console.error);
            console.log('Verified');
            return res.status(200).json({ message: 'User verified and saved to database.' });

          } else {
            await admin.auth().deleteUser(uid);
            console.log(`User with UID ${uid} deleted from Firebase after 1 minute.`);

            await TemUser.deleteOne({ uid });
            console.log('TempUser successfully removed from temporary storage after verification failure.');

            return res.status(400).json({ message: 'User not verified please create account again.' });
          }
        } catch (error) {
          next(error);
        }
      }, 60000);
    } else {
      const hashedPassword = await bcrypt.hash(tempUser.password, 10);
      const user = new User({
        uid: tempUser.uid,
        email: tempUser.email,
        username: tempUser.username,
        phone: tempUser.phone,
        password: hashedPassword,
      });

      try {
        await user.save();
        console.log('User successfully saved to permanent database:', user);
        await TemUser.deleteOne({ uid });
        console.log('TempUser successfully removed after verification:', tempUser);
        return res.status(200).json({ message: 'User verified and saved to database.' });

      } catch (saveError) {
        next(saveError);
      }
    }
  } catch (error) {
    next(error);
  }
};


exports.checkEmailAndSendOTP = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email is required.' });
  }

  try {
    // Check if email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Email not registered.', exists: false });
    }

    const { uid } = user;

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Check OTP request limits
    let otpRequest = await TempOTP.findOne({ email });

    if (otpRequest) {
      const timeDifference = Date.now() - new Date(otpRequest.createdAt).getTime();
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (timeDifference > oneDayInMs) {
        otpRequest.requestCount = 0;
        otpRequest.createdAt = new Date();
      }

      if (otpRequest.requestCount >= 5) {
        return res.status(400).json({
          status: 'error',
          message: 'You have exceeded the maximum OTP requests for today. Please try again tomorrow.',
        });
      }

      otpRequest.requestCount += 1;
      otpRequest.otp = otp;
      otpRequest.createdAt = new Date();
      await otpRequest.save();
    } else {
      await TempOTP.create({
        email,
        otp,
        requestCount: 1,
        createdAt: new Date(),
      });
    }

    // Send OTP email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'pikachugaming565@gmail.com',
        pass: 'crkzwidgxlglnpaf',
      },
    });

    await transporter.sendMail({
      from: 'pikachugaming565@gmail.com',
      to: email,
      subject: 'Your OTP code',
      text: `Your OTP code is ${otp}. This code is valid for 1 minute.`,
    });

    // Respond to the frontend
    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully. Please check your email.',
      uid,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyOTPAndResetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ status: 'error', message: 'Email, OTP, and new password are required.' });
  }

  try {
    console.log('Starting OTP verification process...');
    console.log(`Received email: ${email}, OTP: ${otp}`);

    // Fetch the OTP and validate
    const tempOTP = await TempOTP.findOne({ email });
    if (!tempOTP) {
      console.log('OTP not found for email:', email);
      return res.status(400).json({ status: 'error', message: 'OTP expired or not found.' });
    }

    const timeDifference = Date.now() - new Date(tempOTP.createdAt).getTime();
    console.log(`Time difference: ${timeDifference}ms`);

    if (timeDifference > 60 * 1000) { // 30 seconds
      await TempOTP.deleteOne({ email });
      console.log('OTP expired, deleting...');
      return res.status(400).json({ status: 'error', message: 'OTP has expired.' });
    }

    if (parseInt(tempOTP.otp) !== parseInt(otp)) {
      console.log('Invalid OTP:', otp);
      return res.status(400).json({ status: 'error', message: 'Invalid OTP.' });
    }

    console.log('OTP validated successfully.');

    // Update password in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found in MongoDB:', email);
      return res.status(404).json({ status: 'error', message: 'User not found in MongoDB.' });
    }

    // Ensure password meets minimum requirements
    if (newPassword.length < 8) {
      console.log('Password does not meet minimum length of 6 characters.');
      return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters long.' });
    }

    // Hash the new password before updating in MongoDB
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Hashed password:', hashedPassword);
    user.password = hashedPassword;
    await user.save();
    console.log('Password updated successfully.');

    // Remove the OTP after successful verification
    await TempOTP.deleteOne({ email });
    console.log('OTP deleted successfully after password reset.');

    return res.status(200).json({
      status: 'success',
      message: 'Password Updated Successfully',
    });
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if user exists in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist.' });
    }

    // Log stored password for debugging
    console.log('Stored Hashed Password:', user.password);
    console.log('Entered Password:', password);

    // Compare entered password with stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    // Verify email through Firebase Admin
    const firebaseUser = await getAuth().getUserByEmail(email);
    if (!firebaseUser.emailVerified) {
      return res.status(400).json({ message: 'Email is not verified.' });
    }

    // Generate custom token
    const customToken = await getAuth().createCustomToken(firebaseUser.uid);

    // Send response
    res.status(200).json({
      message: 'Login successful.',
      token: customToken,
      userData: user, // MongoDB user data
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

exports.getUserData = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(' ')[1]; // Get the token from headers

  if (!idToken) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Fetch user data from MongoDB using the Firebase UID
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      email: user.email,
      username: user.username,
      phone: user.phone,
      password: '******************',
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { userId, username, email, phone, password } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    let updateFields = { username, email, phone };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Change `_id` to `uid` since you're storing Firebase UID in `uid`
    const updatedUser = await User.findOneAndUpdate(
      { uid: userId }, // Search using `uid`
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User details updated successfully', updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    next(error);
  }
};



exports.updatePass = async (req, res, next) => {
  try {
    const { userId, oldPassword, password: newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'userId, oldPassword and newPassword are required' });
    }

    // Find user by UID
    const user = await User.findOne({ uid: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare old password with the hashed password in DB
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Server error while updating password' });
  }
};


const Trial = require('../models/trialSchema'); // Import Trial model

exports.startTrial = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if a trial already exists
    let existingTrial = await Trial.findOne({ userId });

    if (existingTrial) {
      if (existingTrial.count >= 1) {
        return res.status(400).json({ error: 'Free trial has already been used.' });
      }

      // Update existing trial to active and set count to 1
      existingTrial.trialStatus = 'active';
      existingTrial.count = 1;
      existingTrial.startDate = new Date();
      existingTrial.endTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3-day trial corrected
      await existingTrial.save();

      return res.json({ success: true, message: 'Trial started successfully', trial: existingTrial });
    }

    // If no trial exists, create a new one
    const trial = new Trial({
      userId,
      startDate: new Date(),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3-day trial corrected
      trialStatus: 'active',
      count: 1, // Initialize count to 1 on first trial start
    });

    await trial.save();

    res.json({ success: true, message: 'Trial started successfully', trial });
  } catch (error) {
    next(error);
  }
};
