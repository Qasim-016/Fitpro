import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import MyButton from '@/components/Buttons/MyButton';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import Heading from '@/components/Text/Heading';
import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Paragraph from '@/components/Text/Paragraph';
import { SafeAreaView } from 'react-native-safe-area-context';
import styling from '@/assets/Styles/styling';

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

const ForgotPass = () => {
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

    if (!email) {
      formErrors.email = 'Email is required.';
      valid = false;
    } else {
      formErrors.email = '';
    }

    if (!password.match(passwordRegex)) {
      formErrors.password = 'At least 8 characters, start with a capital letter, and contain a number.';
      valid = false;
    } else {
      formErrors.password = '';
    }

    setErrors(formErrors);
    return valid;
  };

  const handleResetPassword = async () => {
    if (validateForm()) {
      try {
        const response = await fetch("http://192.168.0.114:5000/api/auth/reset-password", { // Update URL if needed
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword: password }),
        });
        const data = await response.json();
    
        if (response.ok) {
          Alert.alert("verify", "Verify you want to reset password");
          router.push("/(AuthScreens)/verify-code");  // Navigate to login screen after reset
        } else {
          Alert.alert("Error", data.message);  // Show error message if user is not found or another issue occurs
        }
      } catch (error) {
        console.error("Reset Password error:", error);
        Alert.alert("Error", "Failed to reset password.");
      }
    } else {
      Alert.alert("Error", "Please correct the errors above.");
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
        <Text style={styling.HeaderText}>Forgot Password</Text>
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
            <Heading title={'Forgot Password'} styles={styling.Heading}/>
            <Paragraph paragraph={'Please enter your email and new password.'} styles={styling.Paragraph}/>

            <View style={styling.PlaceHolderView}>
              <PlaceHolderHeading title={'Email'} />
              <PlaceHolder 
                placeholderText={'example@example.com'} 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address"
              />
              {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}

              <PlaceHolderHeading title={'Enter New Password'} />
              <PlaceHolder 
                placeholderText={'***********'} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={!showPassword} 
                iconName=""
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
              {errors.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>}
            </View>

            <MyButton title={"Reset Password"} onPress={handleResetPassword} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
            <Link href={'/login'} style={styling.CenterLink}>Back To Login</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPass;
