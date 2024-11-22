import { View, Alert, Text, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
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
import { auth} from './firebaseConfig'; // Ensure this points to your Firebase configuration file
import { createUserWithEmailAndPassword, sendEmailVerification,fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore'; // Firestore functions
import { getAuth } from 'firebase/auth';
import {  getDoc } from 'firebase/firestore';  // Firestore imports
// import { Alert } from 'react-native';
// import { useRouter } from 'expo-router';
import { db } from './firebaseConfig'; // Ensure to import Firestore and Auth instance

// Regular expressions for validations
const usernameRegex = /^[A-Za-z ]+$/; // Only letters and spaces allowed
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Validate email format (only Gmail)
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Password must be at least 8 characters long, start with a capital letter, and contain a number

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { username, email, phone, password, confirmPassword } = formData;
    let formErrors = { ...errors };

    // Validate Username
    if (!username.match(usernameRegex)) {
      formErrors.username = 'Username can only contain letters and spaces';
    } else {
      formErrors.username = '';
    }

    // Validate Email
    if (!email.match(emailRegex)) {
      formErrors.email = 'Please enter a valid Gmail address (e.g., example@gmail.com)';
    } else {
      formErrors.email = '';
    }

    // Validate Phone (simple check for length, modify if needed)
    if (phone.length !== 12) {
      formErrors.phone = 'Phone number should be 12 digits (e.g., +923154721687)';
    } else {
      formErrors.phone = '';
    }

    // Validate Password
    if (!password.match(passwordRegex)) {
      formErrors.password = 'At least 8 characters, start with a capital letter, and contain a number';
    } else {
      formErrors.password = '';
    }

    // Confirm Password
    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    } else {
      formErrors.confirmPassword = '';
    }

    setErrors(formErrors);

    // Return whether form is valid
    return Object.values(formErrors).every((error) => error === '');
  };


  
  
  const handleSignup = async () => {
    if (validateForm()) {
      try {
        // Check if email already exists in Firebase Authentication
        const emailInUse = await checkEmailExists(formData.email);
        if (emailInUse) {
          Alert.alert('Error', 'This email is already registered. Please use a different email.');
          return;
        }
  
        // Check if phone number already exists in Firestore
  
        // Firebase signup
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
  
        // Send email verification
        await sendEmailVerification(user);
  
        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date(),
        });
  
        Alert.alert('Success', 'Account created successfully. Please verify your email.');
  
        // Navigate to Login screen
        router.push({
          pathname: '/(AuthScreens)/login',
          params: { email: formData.email },
        });
      } catch (error: any) {
        // Handle Firebase Auth-specific errors
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'This email is already registered. Please use a different email.');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'Invalid email address format.');
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('Error', 'Password is too weak. Please use a stronger password.');
        } else {
          // Generic error
          Alert.alert('Error', error.message || 'An unexpected error occurred.');
        }
      }
    } else {
      Alert.alert('Error', 'Please correct the errors above.');
    }
  };
  
  // Function to check if the email already exists in Firebase Authentication
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const authInstance = getAuth(); // Initialize auth instance
      const signInMethods = await fetchSignInMethodsForEmail(authInstance, email); // Check if methods exist
      return signInMethods.length > 0; // If there are sign-in methods, the email is in use
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  };
  


  return (
    <SafeAreaView style={styling.container}>
      <View style={styling.Backbtn}>
        <MyButton
          title={<LogoImgForScreen path={require('@/assets/images/weui_back-filled.png')} styles={styling.NextBackbtnimage} />}
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
                iconName="person"
              />
              {errors.username && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username}</Text>}

              <PlaceHolderHeading title={'Email'} />
              <PlaceHolder
                placeholderText={'abc123@gmail.com'}
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
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
