import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import MyButton from '@/components/Buttons/MyButton';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import styling from '@/assets/Styles/styling';
import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Heading from '@/components/Text/Heading';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Paragraph from '@/components/Text/Paragraph';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { SERVER_IP } from '../config';
const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Track if the user is typing
  const [retryTimeout, setRetryTimeout] = useState<number | null>(null); // Track retry timeout
  // Regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Handle input change with a check for email field
  const handleInputChange = (field: keyof typeof form, value: string) => {
    if (field === 'email') {
      setIsTyping(true); // User is typing
    }
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '', // Clear error for the updated field
    }));
  };

  // Automatically convert email to lowercase after user stops typing or when blurred
  useEffect(() => {
    if (!isTyping && form.email !== form.email.toLowerCase()) {
      setForm((prevForm) => ({
        ...prevForm,
        email: prevForm.email.toLowerCase(), // Convert email to lowercase
      }));
    }
  }, [isTyping, form.email]);

  // Handle blur to stop tracking typing
  const handleBlur = () => {
    setIsTyping(false); // User has finished typing
  };

  const validateForm = (): boolean => {
    const formErrors = { email: '', password: '' };
    let isValid = true;

    if (!form.email.trim().match(emailRegex)) {
      formErrors.email = 'Please enter a valid email address (e.g., example@gmail.com)';
      isValid = false;
    }

    if (!form.password.trim().match(passwordRegex)) {
      formErrors.password = 'Password must be at least 8 characters, start with a capital letter, and include a number';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  

 


  const loginUser = async (): Promise<void> => {
    if (validateForm()) {
      if (retryTimeout && Date.now() < retryTimeout) {
        const remainingTime = Math.ceil((retryTimeout - Date.now()) / 1000);
        Alert.alert(
          'Checking your email verification',
          `You will be notified in one minute after verification. Please try again after ${remainingTime} seconds.`
        );
        return;
      }
  
      try {
        // Send login request to the backend
        const response = await axios.post(`http://${SERVER_IP}:5000/api/auth/login`, {
          email: form.email.trim(),
          password: form.password.trim(),
        });
  
        if (response.status === 200) {
          const { token, userData } = response.data;
  
          // Authenticate using Firebase custom token
          await signInWithCustomToken(auth, token);
  
          // 🔹 Step 1: Check Free Trial
          let isTrialActive = false;
          try {
            const trialResponse = await axios.get(`http://${SERVER_IP}:5000/api/trial/${userData.uid}`);
            if (trialResponse.status === 200 && trialResponse.data?.trialStatus === 'active') {
              isTrialActive = true;
            }
          } catch (trialError: any) {
            
            // console.error("Error fetching trial:", trialError);
          }
  
          // 🔹 Step 2: Check Subscription
          let hasActiveSubscription = false;
          try {
            const subscriptionResponse = await axios.get(`http://${SERVER_IP}:5000/api/subscription/${userData.uid}`);
            if (subscriptionResponse.status === 200 && subscriptionResponse.data?.subscriptionEndTime > Date.now()) {
              hasActiveSubscription = true;
            }
          } catch (subscriptionError) {
            // console.error("Error fetching subscription:", subscriptionError);
          }
  
          // 🔹 Final Decision: Navigate Only Once
          if (hasActiveSubscription || isTrialActive) {
            router.navigate('/(User)/Dashboard');
          } else {
            router.navigate('/(User)/FreeTrial');
          }
        }
      } catch (error: any) {
        if (error.response && error.response.data.message === 'User does not exist.') {
          const nextRetry = Date.now() + 60000;
          setRetryTimeout(nextRetry);
  
          Alert.alert(
            'User does not exist',
            'Please create your account and verify your Email and try again in 1 minute.'
          );
        } else if (error.response) {
          Alert.alert('Error', error.response.data.message || 'Login failed.');
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
      }
    } else {
      Alert.alert('Error', 'Please correct the highlighted errors.');
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
        <Heading title="Login" styles={styling.HeaderText} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={50}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styling.subcontainer}>
            <LogoImgForScreen path={require('@/assets/images/icon.png')} styles={styling.loginimg} />
            <Heading title="Login" styles={styling.Heading} />
            <Paragraph paragraph="Enter your email address and password to access your account." styles={styling.Paragraph} />

            <View style={styling.PlaceHolderView}>
              <PlaceHolderHeading title="Email" />
              <PlaceHolder
                placeholderText="abc123@gmail.com"
                value={form.email}
                onChangeText={(text) => handleInputChange('email', text)}
                onBlur={handleBlur}
                iconName="email"
              />
              {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}

              <PlaceHolderHeading title="Password" />
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
            </View>

            <MyButton
              title="Login"
              onPress={loginUser}
              style1={styling.FullWidthbutton}
              style2={styling.FullwidthbtnText}
            />

            <Link href="/(AuthScreens)/ForgotPass" style={styling.Link1}>
              Forgot Password?
            </Link>
          </View>

          <Link href="/(AuthScreens)/signup" style={styling.Link2}>
            Don't have an account? <Text style={styling.Link3Text}>Create Account</Text>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;


