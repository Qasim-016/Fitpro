import { View, Text, ImageBackground, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '../(AuthScreens)/firebaseConfig';
import MyButton from '@/components/Buttons/MyButton';
import styling from '@/assets/Styles/styling';

const FreeTrial = () => {
  const router = useRouter();
  const { height, width } = Dimensions.get('screen');
  const [trialUsed, setTrialUsed] = useState(false);

  useEffect(() => {
    checkTrialStatus();
  }, []);

  const checkTrialStatus = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const response = await axios.get(`http://192.168.0.114:5000/api/auth/trialStatus/${userId}`);

      if (response.status === 200 && response.data.count >= 1) {
        setTrialUsed(true); // Disable button if trial has been used
      }
    } catch (error) {
      // console.error('Error fetching trial status:', error);
    }
  };

  const startTrial = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const idToken = await auth.currentUser?.getIdToken();

      if (!userId || !idToken) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const response = await axios.post(
        'http://192.168.0.114:5000/api/auth/startTrial',
        { userId },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Trial started successfully!');
        setTrialUsed(true); // Disable button after starting the trial
        router.push({ pathname: '/Dashboard', params: { selectedSection: 'home' } });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'An error occurred while starting the trial.';

        if (errorMessage === 'Free trial has already been used.') {
          setTrialUsed(true); // Disable button
          Alert.alert('Info', 'You have already used your free trial.');
          return;
        }

        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <ImageBackground source={require('@/assets/User/free-trial.jpg')} style={{ width, height }} resizeMode="cover">
      <View style={[styling.container, styling.Gap]}>
        <Text style={styling.whitetextheading}>Welcome to FitPro</Text>
        <Text style={styling.whitetextparagraph}>
          Welcome to FitPro! Your fitness journey starts here...
        </Text>

        <MyButton 
          title="3 Days Free Trial" 
          onPress={startTrial} 
          style1={[styling.freetrialbtn, trialUsed ? { backgroundColor: 'gray' } : {}]} 
          style2={styling.FreeTrialText} 
          disabled={trialUsed} // 🔹 Disable if count >= 1
        />
        <MyButton 
          title="Get Premium" 
          onPress={() => router.push({ pathname: '/Dashboard', params: { selectedSection: 'payment' } })} 
          style1={styling.FullWidthbutton} 
          style2={styling.FullwidthbtnText} 
        />
      </View>
    </ImageBackground>
  );
};

export default FreeTrial;
