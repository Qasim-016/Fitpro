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
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';

const ForgotPass = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: '' });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateEmail = (): boolean => {
    if (!email.trim().match(emailRegex)) {
      setErrors({ email: 'Please enter a valid email address (e.g., example@gmail.com).' });
      return false;
    }
    setErrors({ email: '' });
    return true;
  };

  const handleResetPassword = async (): Promise<void> => {
    if (validateEmail()) {
      try {
        await sendPasswordResetEmail(auth, email.trim());
        Alert.alert(
          'Success',
          'A password reset email has been sent to your email address. Please check your inbox and follow the instructions to reset your password.'
        );
        router.push('/(AuthScreens)/login'); // Redirect to login screen
      } catch (error: any) {
        console.error('Password reset error:', error.message);
        Alert.alert('Error', error.message || 'Failed to send password reset email. Please try again.');
      }
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
        <Text style={styling.HeaderText}>Forgot Password</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={50}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styling.subcontainer}>
            <LogoImgForScreen path={require('@/assets/images/icon.png')} styles={styling.loginimg} />
            <Heading title="Forgot Password" styles={styling.Heading} />
            <Paragraph paragraph="Please enter your email address to reset your password." styles={styling.Paragraph} />

            <View style={styling.PlaceHolderView}>
              <PlaceHolderHeading title="Email" />
              <PlaceHolder
                placeholderText="example@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}
            </View>

            <MyButton
              title="Reset Password"
              onPress={handleResetPassword}
              style1={styling.FullWidthbutton}
              style2={styling.FullwidthbtnText}
            />
            <Link href="/(AuthScreens)/login" style={styling.CenterLink}>
              Back To Login
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPass;
