import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import MyButton from '@/components/Buttons/MyButton';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import styling from '@/assets/Styles/styling';
import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';
import Heading from '@/components/Text/Heading';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Paragraph from '@/components/Text/Paragraph';
import { SafeAreaView } from 'react-native-safe-area-context';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let formErrors = { ...errors };
    let valid = true;

    if (!email.match(emailRegex)) {
      formErrors.email = 'Please enter a valid Gmail address (e.g., example@gmail.com)';
      valid = false;
    } else {
      formErrors.email = '';
    }
    
    if (!password.match(passwordRegex)) {
      formErrors.password = 'At least 8 characters, start with a capital letter, and contain a number';
      valid = false;
    } else {
      formErrors.password = '';
    }
    
    setErrors(formErrors);
    console.log('Errors:', formErrors); // Log errors to check the validation status
    
    return valid;
    
  };


  const loginUser = async () => {
    if (validateForm()) {
      try {
        const response = await fetch("http://192.168.0.114:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password: password.trim() }),
        });
  
        const data = await response.json();
        if (response.ok) {
          Alert.alert('Success', 'Login successful');
          router.push('/(User)/FreeTrial');
        } else {
          Alert.alert('Error', data.message || 'Login failed');
        }
      } catch (error) {
        console.error("Login error:", error);
        Alert.alert('Error', 'Failed to log in');
      }
    } else {
      Alert.alert('Error', 'Please correct the errors above.');
    }
  };
  
  
  
  

  return (
    <SafeAreaView style={styling.container}>
      <View style={styling.Backbtn}>
        <MyButton 
          title={<LogoImgForScreen path={require('@/assets/images/weui_back-filled.png')} styles={styling.NextBackbtnimage}/>} 
          onPress={() => router.back()}
          style1={styling.button} 
          style2={styling.NextBackbtntext} 
        />
        <Heading title={'Login'} styles={styling.HeaderText} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={50}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: 'center' }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styling.subcontainer}>
            <LogoImgForScreen path={require('@/assets/images/icon.png')} styles={styling.loginimg}/>
            <Heading title={'Login'} styles={styling.Heading}/>
            <Paragraph paragraph={'Enter your Gmail address and \n password to access your account.'} styles={styling.Paragraph}/>

            <View style={styling.PlaceHolderView}>
              <PlaceHolderHeading title={'Email'} />
              <PlaceHolder 
                placeholderText={'abc123@gmail.com'} 
                value={email} 
                onChangeText={setEmail} 
                iconName="email"
              />
              {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}

              <PlaceHolderHeading title={'Password'} />
              <PlaceHolder 
                placeholderText={'**********'} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={!showPassword} 
                iconName=""
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
              {errors.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>}
            </View>

            <MyButton 
              title={"Login"} 
              onPress={loginUser} 
              style1={styling.FullWidthbutton} 
              style2={styling.FullwidthbtnText} 
            />

            <Link href={'/(AuthScreens)/ForgotPass'} style={styling.Link1}>Forgot Password?</Link>
          </View>

          <Link href={"/(AuthScreens)/signup"} style={styling.Link2}>
            Don't have an account? <Text style={styling.Link3Text}>Create Account</Text>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
