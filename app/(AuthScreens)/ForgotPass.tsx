// import React, { useState } from 'react';
// import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
// import { useRouter, Link } from 'expo-router';
// import MyButton from '@/components/Buttons/MyButton';
// import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
// import Heading from '@/components/Text/Heading';
// import Paragraph from '@/components/Text/Paragraph';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import styling from '@/assets/Styles/styling';
// import { sendPasswordResetEmail, getAuth, sendEmailVerification } from 'firebase/auth';
// import axios from 'axios';
// import { auth } from './firebaseConfig';

// const ForgotPass = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [errors, setErrors] = useState('');

//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//   const validateEmail = (): boolean => {
//     if (!email.trim().match(emailRegex)) {
//       setErrors('Please enter a valid email address (e.g., example@gmail.com).');
//       return false;
//     }
//     setErrors('');
//     return true;
//   };
//   const handleResetPassword = async () => {
//     if (!validateEmail()) return;
  
//     try {
//       // Step 1: Check if email exists in the database
//       const checkResponse = await axios.post('http://192.168.0.111:5000/api/auth/checkEmail', { email });
//       if (!checkResponse.data.exists) {
//         Alert.alert('Error', 'Email is not registered.');
//         return;
//       }
  
//       // Step 2: Send reset password email via Firebase
//       const sendResponse = await axios.post('http://192.168.0.111:5000/api/auth/sendResetEmail', { email });
//       const authInstance = getAuth();
//       await sendPasswordResetEmail(authInstance, email.trim());
  
//       Alert.alert('Success', sendResponse.data.message);
  
//       // After user resets password on Firebase, call backend to update MongoDB
//       const newPassword = 'user_entered_new_password';  // This should come from your frontend form (ask user for new password)
//       const { uid } = checkResponse.data;  // Get UID from the email check response
  
//       // Call your backend API to update password in MongoDB
//       const updateResponse = await axios.post('http://192.168.0.111:5000/api/auth/resetPassword', {
//         uid,
//         newPassword,
//       });
  
//       Alert.alert('Success', updateResponse.data.message);
  
//       router.push('/(AuthScreens)/login'); // Redirect to login page after success
//     } catch (error: any) {
//       console.error('Error handling reset password:', error.message);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to send reset email.');
//     }
//   };
  
  
  
//   return (
//     <SafeAreaView style={styling.container}>
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styling.subcontainer}>
//             <Heading title="Forgot Password" styles={styling.Heading} />
//             <Paragraph paragraph="Enter your email to reset your password." styles={styling.Paragraph} />
//             <View style={styling.PlaceHolderView}>
//               <PlaceHolder
//                 placeholderText="example@example.com"
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//               />
//               {errors && <Text style={{ color: 'red', marginBottom: 10 }}>{errors}</Text>}
//             </View>
//             <MyButton
//               title="Reset Password"
//               onPress={handleResetPassword}
//               style1={styling.FullWidthbutton}
//               style2={styling.FullwidthbtnText}
//             />
//             <Link href="/(AuthScreens)/login" style={styling.CenterLink}>
//               Back to Login
//             </Link>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default ForgotPass;


import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import MyButton from '@/components/Buttons/MyButton';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import Heading from '@/components/Text/Heading';
import Paragraph from '@/components/Text/Paragraph';
import { SafeAreaView } from 'react-native-safe-area-context';
import styling from '@/assets/Styles/styling';
import axios from 'axios';
import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';

const ForgotPass = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', uid: '', otp: '' });
  const [errors, setErrors] = useState({ email: '', password: '', otp: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value, // Update input without altering the case immediately
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '', // Clear error for the updated field
    }));
  };
  
  const handleBlur = (field: keyof typeof form) => {
    if (field === 'email') {
      // Ensure email is stored in lowercase after user finishes typing
      setForm((prevForm) => ({
        ...prevForm,
        email: prevForm.email.trim().toLowerCase(),
      }));
    }
  };
  

  const validateForm = (): boolean => {
    const formErrors = { email: '', password: '', otp: '' };
    let isValid = true;

    if (!form.email.trim().match(emailRegex)) {
      formErrors.email = 'Please enter a valid email address (e.g., example@gmail.com)';
      isValid = false;
    }

    if (otpSent && !form.otp.trim()) {
      formErrors.otp = 'OTP is required.';
      isValid = false;
    }

    if (otpSent && !form.password.trim().match(passwordRegex)) {
      formErrors.password =
        'Password must be at least 8 characters, start with a capital letter, and include a number';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // const handleSendOTP = async () => {
  //   if (!validateForm()) return;

  //   try {
  //     const response = await axios.post('http://192.168.0.111:5000/api/auth/checkEmailAndSendOTP', {
  //       email: form.email.trim(),
  //     });

  //     const { exists, uid, message } = response.data;
  //     if (!exists) {
  //       Alert.alert('Error', 'Email is not registered.');
  //       return;
  //     }
  //     if (message === 'You have exceeded the maximum OTP request limit for today.') {
  //       Alert.alert('Error', message);
  //       return;
  //     }

  //     Alert.alert('Success', message);
  //     setForm((prevForm) => ({ ...prevForm, uid }));
  //     setOtpSent(true);
  //   } catch (error: any) {
  //     // console.error('Error sending OTP:', error.message);
  //     Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP.');
  //   }
  // };


  const handleSendOTP = async () => {
    if (!validateForm()) return;
  
    try {
      const response = await axios.post('http://192.168.0.111:5000/api/auth/checkEmailAndSendOTP', {
        email: form.email.trim(),
      });
  
      const { status, message, uid } = response.data;
  
      if (status === 'success') {
        // Update the state to show OTP and password fields
        Alert.alert('Success', message);
        setForm((prevForm) => ({ ...prevForm, uid })); // Store UID for later use
        setOtpSent(true); // Show OTP and password fields
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP.');
    }
  };
  

  const handleVerifyAndResetPassword = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://192.168.0.111:5000/api/auth/verifyOTPAndResetPassword', {
        email: form.email.trim(),
        otp: form.otp.trim(),
        newPassword: form.password,
      });

      Alert.alert('Success', response.data.message);
      router.navigate('/(AuthScreens)/login');
    } catch (error: any) {
      // console.error('Error resetting password:', error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password.');
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post('http://192.168.0.111:5000/api/auth/checkEmailAndSendOTP', {
        email: form.email.trim(),
      });

      Alert.alert('Success', response.data.message);
    } catch (error: any) {
      console.error('Error resending OTP:', error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <SafeAreaView style={styling.container}>
      <View style={styling.Backbtn}>
        <MyButton
          title={<LogoImgForScreen path={require('@/assets/images/nextback/back.png')} styles={styling.NextBackbtnimage} />}
          onPress={() => router.back()}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Forgot Password" styles={styling.HeaderText} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styling.subcontainer}>
            <Heading title="Forgot Password" styles={styling.Heading} />
            <Paragraph paragraph="Enter your email to receive a one-time password (OTP)." styles={styling.Paragraph} />
            <View style={styling.PlaceHolderView}>
              {/* Email Placeholder */}
              <PlaceHolderHeading title="Email" />
              <PlaceHolder
                placeholderText="example@example.com"
                value={form.email}
                onChangeText={(text) => handleInputChange('email', text)}
                onBlur={() => handleBlur('email')}
                keyboardType="email-address"
                iconName="email"
              />
              {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}

              {otpSent && (
                <>
                  {/* OTP Placeholder */}
                  <PlaceHolderHeading title="OTP" />
                  <PlaceHolder
                    placeholderText="Enter OTP"
                    value={form.otp}
                    onChangeText={(text) => handleInputChange('otp', text)}
                    keyboardType="numeric"
                  />
                  {errors.otp && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.otp}</Text>}

                  {/* Password Placeholder */}
                  <PlaceHolderHeading title="New Password" />
                  <PlaceHolder
                    placeholderText="**********"
                    value={form.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    secureTextEntry={!showPassword}
                    iconName=""
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                  {errors.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>}
                </>
              )}
            </View>
            {!otpSent ? (
              <MyButton
                title="Send OTP"
                onPress={handleSendOTP}
                style1={styling.FullWidthbutton}
                style2={styling.FullwidthbtnText}
              />
            ) : (
              <>
                <MyButton
                  title="Verify and Reset Password"
                  onPress={handleVerifyAndResetPassword}
                  style1={styling.FullWidthbutton}
                  style2={styling.FullwidthbtnText}
                />
                <MyButton
                  title="Resend OTP"
                  onPress={handleResendOTP}
                  style1={styling.FullWidthbutton}
                  style2={styling.FullwidthbtnText}
                />
              </>
            )}
            <Link href="/(AuthScreens)/login" style={styling.CenterLink}>
              Back to Login
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPass;







