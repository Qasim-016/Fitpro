import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import MyButton from '@/components/Buttons/MyButton';
import styling from '@/assets/Styles/styling';

const VerifyCode: React.FC<any> = ({ navigation, route }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { email } = route.params; // Extract email from route params

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.114:5000/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Verification successful!');
        navigation.navigate('Login'); // Navigate to Login screen after successful verification
      } else {
        Alert.alert('Error', data.message || 'Invalid verification code.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', 'Failed to verify the code. Please try again.');
    }
  };

  return (
    <View style={styling.container}>
      <Text style={styling.HeaderText}>Verify Your Email</Text>
      <Text style={styling.Paragraph}>
        Enter the verification code sent to: {email}
      </Text>
      <TextInput
        style={styling.placeholder} // Adjust the style to your needs
        placeholder="Enter verification code"
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <MyButton
        title="Verify Code"
        onPress={handleVerifyCode}
        style1={styling.FullWidthbutton}
        style2={styling.FullwidthbtnText}
      />
    </View>
  );
};

export default VerifyCode;
