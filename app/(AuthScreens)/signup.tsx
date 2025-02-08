import { View, Alert, Text, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import MyButton from '@/components/Buttons/MyButton';
import { ScrollView } from 'react-native';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import styling from '@/assets/Styles/styling';
import Heading from '@/components/Text/Heading';
import Paragraph from '@/components/Text/Paragraph';
import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// Import Firebase methods
import { auth } from './firebaseConfig'; // Ensure this points to your Firebase configuration file
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import axios from 'axios'; // Axios for API requests

// Regular expressions for validations
const usernameRegex = /^[A-Za-z ]+$/; // Only letters and spaces allowed
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Validate email format (only Gmail)
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Password must be at least 8 characters long, start with a capital letter, and contain a number

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timestamp to track the last signup attempt
  const lastSignupAttempt = useRef<number | null>(null); 
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (name:string, value:string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleBlur = (name:string) => {
    if (name === 'email') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: prevFormData.email.toLowerCase(),
      }));
    }
  };

  const validateForm = () => {
    const { username, email, phone, password, confirmPassword } = formData;
    let formErrors = { ...errors };

    formErrors.username = username.match(usernameRegex) ? '' : 'Username can only contain letters and spaces';
    formErrors.email = email.match(emailRegex) ? '' : 'Please enter a valid Gmail address (e.g., example@gmail.com)';
    formErrors.phone = phone.length === 12 ? '' : 'Phone number should be 12 digits (e.g., +923154721687)';
    formErrors.password = password.match(passwordRegex) ? '' : 'At least 8 characters, start with a capital letter, and contain a number';
    formErrors.confirmPassword = password === confirmPassword ? '' : 'Passwords do not match';

    setErrors(formErrors);

    return Object.values(formErrors).every((error) => error === '');
  };



const handleSignup = async () => {
  const now = Date.now();

  if (lastSignupAttempt.current && now - lastSignupAttempt.current < 60 * 1000) {
    const timeRemaining = Math.floor((60 - (now - lastSignupAttempt.current) / 1000));
    Alert.alert(`Please wait for ${timeRemaining} second(s) before trying again.`);
    return;
  }

  if (validateForm()) {
    try {
      // Trim and validate the email format
      const email = formData.email.trim();
      if (!/\S+@\S+\.\S+/.test(email)) {
        Alert.alert('Error', 'Invalid email format.');
        return;
      }

      // Check if email already exists
      const emailExists = await fetchSignInMethodsForEmail(auth, email);
      console.log('Email Exists:', emailExists); // Debugging line
      if (emailExists.length > 0) {
        Alert.alert('Error', 'Email already in use. Please try with a different email address.');
        return;
      }

      // Proceed with user creation if email does not exist
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        formData.password.trim()
      );
      const user = userCredential.user;

      // Call backend to save user details
      const response = await axios.post('http://192.168.0.114:5000/api/auth/signup', {
        username: formData.username,
        email: user.email,
        phone: formData.phone,
        password: formData.password,
        uid: user.uid,
      });

      if (response.status === 409) {
        Alert.alert('User Already Exist');
        lastSignupAttempt.current = Date.now();

      } else if (response.status === 201) {
        Alert.alert('Success', 'Account successfully created, please verify email');
        handleEmailVerification(user.uid);
        router.push({ pathname: '/(AuthScreens)/login', params: { email: formData.email } });
      }

      lastSignupAttempt.current = Date.now();
    } catch (error:any) {
      // console.error('Signup Error:', error); // Debugging line
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email format.');
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Email is already in use.');
      } else if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred with the server.';
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', error.message || 'An unexpected error occurred. Please try again later.');
      }
    }}
};

  const handleEmailVerification = async (uid:string) => {
    try {
      const response = await axios.post('http://192.168.0.114:5000/api/auth/verifyUserEmail', { uid });

      if (response.status === 200) {
        Alert.alert('Success', 'Your email is verified, and your account is activated.');
        router.push({ pathname: '/(AuthScreens)/login', params: { email: '' } });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to verify email.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred while verifying your email.';
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
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
        <Heading title={'Create Account'} styles={styling.HeaderText} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styling.container}
        keyboardVerticalOffset={50}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 20, alignItems: 'center' }}
          bounces={false}
        >
          <View style={styling.Signupsubcontainer}>
            <LogoImgForScreen path={require('@/assets/images/icon.png')} styles={styling.signupimg} />
            <Heading title={'Create Account'} styles={styling.Heading} />
            <Paragraph paragraph={'Enter your details to join our community.'} styles={styling.Paragraph} />

            <View style={styling.PlaceHolderView}>
              <PlaceHolderHeading title={'Username'} />
              <PlaceHolder
                placeholderText={'Ali Ahmed'}
                value={formData.username}
                onChangeText={(value) => handleChange('username', value)}
                onBlur={() => handleBlur('email')}
                iconName="person"
              />
              {errors.username && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username}</Text>}

              <PlaceHolderHeading title={'Email'} />
              <PlaceHolder
                placeholderText={'abc123@gmail.com'}
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                onBlur={() => handleBlur('email')}
                iconName="email"
              />
              {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}

              <PlaceHolderHeading title={'Phone'} />
              <PlaceHolder
                placeholderText={'+923154721687'}
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                iconName="phone"
              />
              {errors.phone && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.phone}</Text>}

              <PlaceHolderHeading title={'Password'} />
              <PlaceHolder
                placeholderText={'**********'}
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry={!showPassword}
                iconName=""
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
              {errors.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>}

              <PlaceHolderHeading title={'Re-enter Password'} />
              <PlaceHolder
                placeholderText={'**********'}
                value={formData.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                iconName=""
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              {errors.confirmPassword && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.confirmPassword}</Text>}
            </View>

            <MyButton
              title={'Create Account'}
              onPress={handleSignup}
              style1={styling.FullWidthbutton}
              style2={styling.FullwidthbtnText}
            />
          </View>
          <Link href={'/login'} style={styling.Link2}>
            Already Have Account? Login.
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;