import { View, Alert, Text, KeyboardAvoidingView,Platform } from 'react-native';
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
import axios from 'axios'

// Regular expressions for validations
const usernameRegex = /^[A-Za-z ]+$/; // Only letters and spaces allowed
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Validate email format (only gmail)
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
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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
      formErrors.password = 'At least 8 characters,start with a capital letter,and contain a number';
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
    // Ensure form validation
    if (validateForm()) {
      try {
        const response = await fetch("http://192.168.0.114:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData), // Ensure formData is properly structured
        });
  
        // Parse the JSON response
        const data = await response.json();
  
        if (response.ok) {
          Alert.alert('Success', 'Account created successfully. Please verify your email.');
          
          // Navigate to VerifyCode screen, passing the email as a parameter
          router.push({
            pathname: '/(AuthScreens)/verify-code',
            params: { email: formData.email }, // Pass email for the verification screen
          });
        } else {
          // Display the error message from the backend
          Alert.alert('Error', data.message || 'Something went wrong.');
        }
      } catch (error) {
        console.error("Signup error:", error);
  
        // Handle network or unexpected errors
        Alert.alert('Error', 'Failed to create account. Please try again later.');
      }
    } else {
      // Inform user about invalid input
      Alert.alert('Error', 'Please correct the errors above.');
    }
  };
  
  
  
  

  return (
    <SafeAreaView style={styling.container}>
      <View style={styling.Backbtn}>
        <MyButton title={<LogoImgForScreen path={require('@/assets/images/weui_back-filled.png')} styles={styling.NextBackbtnimage}/>} onPress={() => router.back()} style1={styling.button} style2={styling.NextBackbtntext} />
        <Heading title={'Create Account'} styles={styling.HeaderText} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : "height"}
        style={styling.container} keyboardVerticalOffset={50}>
          <ScrollView contentContainerStyle={{ flexGrow: 1,paddingVertical:20, alignItems:'center'}} bounces={false}>


      <View style={styling.Signupsubcontainer}>
        <LogoImgForScreen path={require('@/assets/images/icon.png')} styles={styling.signupimg} />
        <Heading title={'Create Account'} styles={styling.Heading} />
        <Paragraph paragraph={'Enter your details to join our community.'} styles={styling.Paragraph} />

          <View style={styling.PlaceHolderView}>
        {/* <View style={styling.PlaceHolderView}> */}
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
        {/* </View> */}

        <MyButton
          title={"Create Account"}
          onPress={handleSignup}
          style1={styling.FullWidthbutton}
          style2={styling.FullwidthbtnText}
          />
        {/* <View style={styling.CenterItem}>

<Text style={styling.Boldfont}>Signup With</Text>
<Link href={'https://www.google.co.uk/'} style={styling.Link2}>
<LogoImgForScreen path={require('@/assets/images/icons/google.png')} styles={styling.none}/>
</Link>
</View> */}
      </View>
      <Link href={"/login"} style={styling.Link2}>Already Have Account? Login.</Link>
</ScrollView>

</KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;
