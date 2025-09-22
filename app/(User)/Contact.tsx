import { View, Text, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styling from '@/assets/Styles/styling';
import MyButton from '@/components/Buttons/MyButton';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Heading from '@/components/Text/Heading';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { SERVER_IP } from '../config';
import { auth } from '../(AuthScreens)/firebaseConfig';
import axios from 'axios';

const Contact = () => {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    message: '',
  });

  // Error state
  const [errors, setErrors] = useState({
    message: '',
  });

  // User info fetched from DB
  const [userData, setUserData] = useState<{ username: string; email: string } | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const idToken = await auth.currentUser?.getIdToken();

        if (idToken) {
          const response = await axios.get(`http://${SERVER_IP}:5000/api/auth/getUserdata`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { message } = formData;
    let formErrors = { ...errors };

    formErrors.message = message.trim() !== '' ? '' : 'Message cannot be empty';
    setErrors(formErrors);

    return Object.values(formErrors).every((error) => error === '');
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const payload = {
          username: userData?.username || '',
          email: userData?.email || '',
          message: formData.message,
        };

        const response = await fetch(`http://${SERVER_IP}:5000/api/auth/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.ok) {
          Alert.alert('Success', result.message);
          setFormData({ message: '' });
        } else {
          Alert.alert('Error', result.error || 'Failed to submit the form');
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to connect to the server');
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={styling.container}>
<View style={[styling.Backbtn, { zIndex: 10}]}>
<MyButton
          title={
            <LogoImgForScreen
              path={require('@/assets/images/Chatbot/back.png')}
              styles={styling.NextBackbtnimage}
            />
          }
          onPress={() => router.replace('/(User)/Dashboard')}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Contact" styles={styling.HeaderText} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={50}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styling.subcontainercontact}>
            <LogoImgForScreen path={require('@/assets/images/icon.png')} styles={styling.loginimg} />

            {userData && (
              <Text style={{ marginBottom: 10, color: 'gray' }}>
                Sending as: {userData.username} ({userData.email})
              </Text>
            )}

            {/* Message Input */}
            <PlaceHolder
              placeholderText={'Enter your message here'}
              value={formData.message}
              onChangeText={(value) => handleChange('message', value)}
              iconName="message"
              multiline={true}
              numberOfLines={4}
              style={{
                height: 150,
              }}
            />
            {errors.message && (
              <Text style={{ color: 'red', marginBottom: 10 }}>{errors.message}</Text>
            )}

            <MyButton title="Submit" onPress={handleSubmit} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Contact;
