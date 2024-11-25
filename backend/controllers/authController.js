const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming User model is correctly defined
const TemUser = require('../models/temuser')
const admin = require('firebase-admin');
const serviceAccount = require('C:/Users/Qasim/Desktop/FitPro/firebase-service-account.json');
const nodemailer = require('nodemailer');
const TempOTP = require('../models/TempOTP'); // Temporary collection to store OTPs
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
}); 

exports.signup = async (req, res) => {
  const { email, username, phone, uid, password } = req.body;

  if (!email|| !username || !phone || !password || !uid) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if the user already exists in MongoDB (permanent collection)
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser){ 
      await admin.auth().deleteUser(uid);  // Deleting user from Firebase
            console.log(`User with UID ${uid} deleted from Firebase after 1 minute.`);
      return res.status(409).json({ message: 'phone number already registered.' });
    }

    let firebaseUser;

    // Check if the user already exists in Firebase Authentication
    // try {
      firebaseUser = await admin.auth().getUser(uid);
     
      
      
      // if (firebaseUser.uid === email) {
      //   return res.status(700).json({
      //     message: 'Account already created. Please verify your email.',
      //   });
      // }

      // Check if the email is verified
    //   if (!firebaseUser.emailVerified) {
    //     const tempUser = await TemUser.findOne({ uid });
    //     if (tempUser) {
    //       const timeDifference = Date.now() - new Date(tempUser.createdAt).getTime();
    //       if (timeDifference < 60 * 1000) { // Within one minute
    //         return res.status(400).json({
    //           message: 'Please wait for one minute before trying again.',
    //         });
    //       } else {
    //         await TemUser.deleteOne({ uid }); // Remove old temporary user if over 1 minute old
    //       }
    //     }
    //   } else {
    //     return res.status(409).json({ message: 'User already exists and is verified.' });
    //   }
    // } catch (firebaseError) {
    //   if (firebaseError.code !== 'auth/user-not-found') {
    //     throw firebaseError;
    //   }
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user in the temporary collection
    const tempUser = new TemUser({
      uid,
      email,
      username,
      phone,
      password: hashedPassword, // Save the hashed password
    });
    await tempUser.save();

    console.log('TempUser saved:', tempUser);

    // Generate an email verification link
    const verificationLink = await admin.auth().generateEmailVerificationLink(email);
    console.log('Verification link generated:', verificationLink);

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
        to: email, // Send to the user's email
        subject: "Verify your email",
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`, // HTML body
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
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Something went wrong. Please try again later.',
    });
  }
};
// exports.verifyUserEmail = async (req, res) => {
//   const { uid } = req.body;

//   if (!uid) {
//     return res.status(400).json({ message: 'UID is required.' });
//   }

//   try {
//     console.log('Starting email verification process...');
//     console.log(`Received UID: ${uid}`);

//     const firebaseUser = await admin.auth().getUser(uid);
//     console.log(`Checking emailVerified for UID ${uid}:`, firebaseUser.emailVerified);

//     const tempUser = await TemUser.findOne({ uid });
//     if (!tempUser) {
//       console.error(`TempUser not found for UID: ${uid}`);
//       return res.status(404).json({ message: 'User not found in temporary storage.' });
//     }

//     console.log('TempUser retrieved:', tempUser);

//     if (!firebaseUser.emailVerified) {
//       // If email is not verified, wait for 1 minute before checking again
//       setTimeout(async () => {
//         const updatedFirebaseUser = await admin.auth().getUser(uid);
//         const hashedPassword = await bcrypt.hash(tempUser.password, 10);
//         if (updatedFirebaseUser.emailVerified) {
//           const user = new User({
//             uid: tempUser.uid,
//             email: tempUser.email,
//             username: tempUser.username,
//             phone: tempUser.phone,
//             password: hashedPassword,
//           });

//           try {
//             await user.save();
//             console.log('User successfully saved to permanent database:', user);
//             await TemUser.deleteOne({ uid });
//             console.log('TempUser successfully removed after verification:', tempUser);

//             return res.status(200).json({ message: 'User verified and saved to database.' });
//           } catch (saveError) {
//             console.error('Error saving user to permanent database:', saveError);
//             return res.status(500).json({ message: 'Error saving user to permanent database.' });
//           }
//         } else {
//           await TemUser.deleteOne({ uid });
//           console.log('User not verified after 1 minute, TempUser removed from database.');
//           return res.status(400).json({ message: 'Email not verified after 1 minute. User deleted.' });

//         }
//       }, 60000); // Wait for 60 seconds (1 minute)

//     } else {
//       const hashedPassword = await bcrypt.hash(tempUser.password, 10);
//       const user = new User({
//         uid: tempUser.uid,
//         email: tempUser.email,
//         username: tempUser.username,
//         phone: tempUser.phone,
//         password: hashedPassword,
//       });

//       try {
//         await user.save();
//         console.log('User successfully saved to permanent database:', user);
//         await TemUser.deleteOne({ uid });
//         console.log('TempUser successfully removed after verification:', tempUser);

//         return res.status(200).json({ message: 'User verified and saved to database.' });
//       } catch (saveError) {
//         console.error('Error saving user to permanent database:', saveError);
//         return res.status(500).json({ message: 'Error saving user to permanent database.' });
//       }
//     }
//   } catch (error) {
//     console.error('Verification error:', error);
//     return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
//   }
// };


 // Assuming your temporary user model is here

exports.verifyUserEmail = async (req, res) => {
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
      // If email is not verified, wait for 1 minute before checking again
      setTimeout(async () => {
        const updatedFirebaseUser = await admin.auth().getUser(uid);
        const hashedPassword = await bcrypt.hash(tempUser.password, 10);
        
        if (updatedFirebaseUser.emailVerified) {
          // User verified, proceed to save to permanent database
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
            console.error('Error saving user to permanent database:', saveError);
            return res.status(500).json({ message: 'Error saving user to permanent database.' });
          }
        } else {
          // User not verified after 1 minute, delete user from Firebase and remove from temporary storage
          try {
            await admin.auth().deleteUser(uid);  // Deleting user from Firebase
            console.log(`User with UID ${uid} deleted from Firebase after 1 minute.`);

            await TemUser.deleteOne({ uid });  // Removing from temporary storage
            console.log('TempUser successfully removed from temporary storage after verification failure.');

            return res.status(400).json({ message: 'User not verified please create account again.' });
          } catch (firebaseError) {
            console.error('Error deleting user from Firebase:', firebaseError);
            return res.status(500).json({ message: 'Error deleting user from Firebase.' });
          }
        }
      }, 60000); // Wait for 60 seconds (1 minute)
    } else {
      // If the email is verified immediately, save to permanent database
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
        console.error('Error saving user to permanent database:', saveError);
        return res.status(500).json({ message: 'Error saving user to permanent database.' });
      }
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};


// exports.signup = async (req, res) => {
//     const { email, username, phone, uid, password } = req.body;
  
//     if (!email || !username || !phone || !password || !uid) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }
  
//     try {
//       // Check if the user already exists in MongoDB (permanent collection)
//       const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Email or phone number already registered.' });
//       }
  
//       let firebaseUser;
  
//       // Check if the user already exists in Firebase Authentication
//       try {
//         firebaseUser = await admin.auth().getUser(uid);
//         if(firebaseUser.email === email
//         ){
//           return res.status(700).json({
//                 message: 'Account already created. Please verify your email.',
//               });
//         }
  
//         // Check if the email is verified
//         if (!firebaseUser.emailVerified) {
//           // Check if the user exists in the temporary collection
//           const tempUser = await TemUser.findOne({ uid });
//           if (tempUser) {
//             const timeDifference = Date.now() - new Date(tempUser.createdAt).getTime();
  
//             if (timeDifference < 60 * 1000) { // Within one minute
//               return res.status(400).json({
//                 message: 'Account already created. Please verify your email.',
//               });
//             } else {
//               // If the temporary user is older than one minute, remove and allow re-registration
//               await TemUser.deleteOne({ uid });
//             }
//           }
//         } else {
//           return res.status(409).json({
//             message: 'User already exists and is verified.',
//           });
//         }
//       } catch (firebaseError) {
//         // If user is not found in Firebase, proceed to create the account
//         if (firebaseError.code !== 'auth/user-not-found') {
//           throw firebaseError;
//         }
//       }
  
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Save the user in the temporary collection
//       const tempUser = new TemUser({
//         uid,
//         email,
//         username,
//         phone,
//         password: hashedPassword, // Corrected: Save the hashed password
//       });
//       await tempUser.save();
//       console.log('TempUser saved:', tempUser);
  
//       // Generate an email verification link
//       const verificationLink = await admin.auth().generateEmailVerificationLink(email);
//       console.log('Verification link generated:', verificationLink);
  
//       const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false, // true for port 465, false for other ports
//         auth: {
//           user: "pikachugaming565@gmail.com",
//           pass: "crkzwidgxlglnpaf",
//         },
//       });
      
//       // async..await is not allowed in global scope, must use a wrapper
//       async function main() {
//         // send mail with defined transport object
//         const info = await transporter.sendMail({
//           from: 'pikachugaming565@gmail.com', // sender address
//           to: firebaseUser ? firebaseUser.email : email, // list of receivers
//           subject: "Verify your email", // Subject line
//           text: "Hello world?", // plain text body
//           html:  `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`, // html body
//         });
      
//         console.log("Message sent: %s", info.messageId);
//         // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
//       }
      
//       main().catch(console.error);
//       console.log('Verification email sent.');
  
//       res.status(201).json({
//         message: 'Success\n\nAccount created successfully. Please verify your email.',
//         verificationLink,
//       });
//     } catch (error) {
//       console.error('Signup error:', error);
//       res.status(500).json({
//         message: 'Something went wrong. Please try again later.',
//       });
//     }
//   };
  

  

// exports.verifyUserEmail = async (req, res) => {
//     const { uid } = req.body;
  
//     if (!uid) {
//       return res.status(400).json({ message: 'UID is required.' });
//     }
  
//     try {
//       console.log('Starting email verification process...');
//       console.log(`Received UID: ${uid}`);
  
//       const firebaseUser = await admin.auth().getUser(uid);
//       console.log(`Checking emailVerified for UID ${uid}:`, firebaseUser.emailVerified);
  
//       // Retrieve the temporary user details
//       const tempUser = await TemUser.findOne({ uid });
//       if (!tempUser) {
//         console.error(`TempUser not found for UID: ${uid}`);
//         return res.status(404).json({ message: 'User not found in temporary storage.' });
//       }
  
//       console.log('TempUser retrieved:', tempUser);
  
//       if (!firebaseUser.emailVerified) {
//         // If email is not verified, wait for 1 minute before checking again
//         setTimeout(async () => {
//           // Recheck the email verification status after 1 minute
//           const updatedFirebaseUser = await admin.auth().getUser(uid);
//           const hashedPassword = await bcrypt.hash(tempUser.password, 10);
//           if (updatedFirebaseUser.emailVerified) {
//             // Save the user to the permanent MongoDB collection
//             const user = new User({
//               uid: tempUser.uid,
//               email: tempUser.email,
//               username: tempUser.username,
//               phone: tempUser.phone,
//               password: hashedPassword,
//             });
  
//             try {
//               await user.save();
//               console.log('User successfully saved to permanent database:', user);
  
//               // Remove the user from the temporary collection
//               await TemUser.deleteOne({ uid });
//               console.log('TempUser successfully removed after verification:', tempUser);
  
//               return res.status(200).json({ message: 'User verified and saved to database.' });
//             } catch (saveError) {
//               console.error('Error saving user to permanent database:', saveError);
//               return res.status(500).json({ message: 'Error saving user to permanent database.' });
//             }
//           } else {
//             // Email still not verified after 1 minute, delete the user
//             await TemUser.deleteOne({ uid });
//             console.log('User not verified after 1 minute, TempUser removed from database.');
//             return res.status(400).json({ message: 'Email not verified after 1 minute. User deleted.' });
//           }
//         }, 60000); // Wait for 60 seconds (1 minute)
        
//       } else {
//         const hashedPassword = await bcrypt.hash(tempUser.password, 10);
//         // If the email is already verified, save the user to the permanent collection immediately
//         const user = new User({
//           uid: tempUser.uid,
//           email: tempUser.email,
//           username: tempUser.username,
//           phone: tempUser.phone,
//           password: hashedPassword,
//         });
  
//         try {
//           await user.save();
//           console.log('User successfully saved to permanent database:', user);
  
//           // Remove the user from the temporary collection
//           await TemUser.deleteOne({ uid });
//           console.log('TempUser successfully removed after verification:', tempUser);
  
//           return res.status(200).json({ message: 'User verified and saved to database.' });
//         } catch (saveError) {
//           console.error('Error saving user to permanent database:', saveError);
//           return res.status(500).json({ message: 'Error saving user to permanent database.' });
//         }
//       }
  
//     } catch (error) {
//       console.error('Verification error:', error);
//       return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
//     }
//   };
  






// exports.checkEmailAndSendOTP = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ status: 'error', message: 'Email is required.' });
//   }

//   try {
//     // Check if email exists in the database
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ status: 'error', message: 'Email not registered.', exists: false });
//     }

//     const { uid } = user;

//     // Generate a 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);

//     // Store the OTP and its expiration time in a temporary collection
//     await TempOTP.findOneAndUpdate(
//       { email }, 
//       { otp, createdAt: new Date() }, 
//       { upsert: true, new: true }
//     );

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // true for port 465, false for other ports
//       auth: {
//         user: "pikachugaming565@gmail.com",
//         pass: "crkzwidgxlglnpaf",
//       },
//     });
    
//     // async..await is not allowed in global scope, must use a wrapper
//     async function main() {
//       // send mail with defined transport object
//       const info = await transporter.sendMail({
//         from: 'pikachugaming565@gmail.com', // sender address
//         to: email, // list of receivers
//         subject: "Your OTP code", // Subject line
//         text:  `Your OTP code is ${otp}. This code is valid for 30 seconds.`, // plain text body
//         // html:  `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`, // html body
//       });
    
//       console.log("Message sent: %s", info.messageId);
//       // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
//     }
    
//     main().catch(console.error);
//     return res.status(200).json({
//       status: 'success',
//       exists: true,
//       uid,
//       message: 'OTP sent to email. Please verify within 30 seconds.',
//     });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     return res.status(500).json({ status: 'error', message: 'Error sending OTP.' });
//   }
// };




exports.checkEmailAndSendOTP = async (req, res) => {
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

      // Reset the daily count if it's a new day
      if (timeDifference > oneDayInMs) {
        otpRequest.requestCount = 0;
        otpRequest.createdAt = new Date();
      }

      if (otpRequest.requestCount >= 5) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'You have exceeded the maximum OTP requests for today. Please try again tomorrow.' 
        });
      }

      // Increment the request count and update the OTP
      otpRequest.requestCount += 1;
      otpRequest.otp = otp;
      otpRequest.createdAt = new Date();
      await otpRequest.save();
    } else {
      // Create a new record if none exists
      await TempOTP.create({
        email,
        otp,
        requestCount: 1,
        createdAt: new Date(),
      });
    }

    // Send OTP email
    const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "pikachugaming565@gmail.com",
              pass: "crkzwidgxlglnpaf",
            },
          });
          
          // async..await is not allowed in global scope, must use a wrapper
          async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
              from: 'pikachugaming565@gmail.com', // sender address
              to: email, // list of receivers
              subject: "Your OTP code", // Subject line
              text:  `Your OTP code is ${otp}. This code is valid for 30 seconds.`, // plain text body
              // html:  `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`, // html body
            });
          
            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
          }
          
          main().catch(console.error);
  } catch (error) {
    // console.error('Error sending OTP:', error);
    return res.status(500).json({ status: 'error', message: 'Error sending OTP.' });
  }
};


// exports.verifyOTPAndResetPassword = async (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   if (!email || !otp || !newPassword) {
//     return res.status(400).json({ status: 'error', message: 'Email, OTP, and new password are required.' });
//   }

//   try {
//     // Fetch the OTP and validate
//     const tempOTP = await TempOTP.findOne({ uid });
//     if (!tempOTP) {
//       return res.status(400).json({ status: 'error', message: 'OTP expired or not found.' });
//     }

//     const timeDifference = Date.now() - new Date(tempOTP.createdAt).getTime();
//     if (timeDifference > 30 * 1000) { // 30 seconds
//       await TempOTP.deleteOne({ email });
//       return res.status(400).json({ status: 'error', message: 'OTP has expired.' });
//     }

//     if (parseInt(tempOTP.otp) !== parseInt(otp)) {
//       return res.status(400).json({ status: 'error', message: 'Invalid OTP.' });
//     }

//     // Update password in Firebase
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ status: 'error', message: 'User not found in MongoDB.' });
//     }

//     const { uid } = user;
//     await admin.auth().updateUser(uid, { password: newPassword });

//     // Hash the password and update in MongoDB
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     // Remove the OTP after successful verification
//     await TempOTP.deleteOne({ email });

//     return res.status(200).json({
//       status: 'success',
//       message: 'Password successfully updated in Firebase and MongoDB.',
//     });
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     return res.status(500).json({ status: 'error', message: 'Error verifying OTP.' });
//   }
// };

exports.verifyOTPAndResetPassword = async (req, res) => {
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

    if (timeDifference > 30 * 1000) { // 30 seconds
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
    if (newPassword.length < 6) {
      console.log('Password does not meet minimum length of 6 characters.');
      return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters long.' });
    }

    // Hash the new password before updating in MongoDB
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Hashed password:', hashedPassword);
    user.password = hashedPassword;
    await user.save();
    console.log('Password updated in MongoDB successfully.');

    // Remove the OTP after successful verification
    await TempOTP.deleteOne({ email });
    console.log('OTP deleted successfully after password reset.');

    return res.status(200).json({
      status: 'success',
      message: 'Password successfully updated in MongoDB.',
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ status: 'error', message: 'Error verifying OTP.' });
  }
};





  // GET /api/auth/user/:uid
exports.getUserData = async (req, res) => {
    const { uid } = req.params;
  
    try {
      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  // Check if the user already exists by firebaseId

  
  // Get user by email
  // Check user by email and password (combined functionality)
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      // Check if the user exists in MongoDB
      const user = await User.findOne({ email });
    if (user) {
        // if(user.email===email){
            let userRecord;
            try {
              userRecord = await getAuth().getUserByEmail(email);
                
            } catch (error) {
                
            }
        }
    else{
        return res.status(404).json({ message: 'User does not exist.' });}
  
      // Check if the email is verified in Firebase
  
      // Compare the provided password with the hashed password in MongoDB
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect email or password.' });
      }
  
      // Login successful
      res.status(200).json({
        message: 'Login successful.',
        userData: user, // Returning user data from MongoDB
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
  };
  



  