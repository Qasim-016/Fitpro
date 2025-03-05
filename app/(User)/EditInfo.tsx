import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { auth } from '@/app/(AuthScreens)/firebaseConfig';
import axios from 'axios';
import styling from '@/assets/Styles/styling';
import { Image } from 'react-native';

const usernameRegex = /^[A-Za-z ]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

interface FormData {
  username: string;
  email: string;
  phone: string;
  password: string;
}

interface Errors {
  username: string;
  email: string;
  phone: string;
  password: string;
}

const EditInfo = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState<Errors>({
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { username, email, phone, password } = formData;
    let formErrors = { ...errors };

    formErrors.username = username.trim() === ''
      ? 'Username is required'
      : !username.match(usernameRegex)
        ? 'Username can only contain letters and spaces'
        : '';

    formErrors.email = email.trim() === ''
      ? 'Email is required'
      : !email.match(emailRegex)
        ? 'Please enter a valid Gmail address (e.g., example@gmail.com)'
        : '';

    formErrors.phone = phone.trim() === ''
      ? 'Phone number is required'
      : phone.length !== 12
        ? 'Phone number should be 12 digits (e.g., +923154721687)'
        : '';

    formErrors.password = password.trim() === ''
      ? 'Password is required'
      : !password.match(passwordRegex)
        ? 'At least 8 characters, start with a capital letter, and contain a number'
        : '';

    setErrors(formErrors);
    return Object.values(formErrors).every(error => error === '');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (idToken) {
          const response = await axios.get('http://192.168.0.116:5000/api/auth/getUserdata', {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          const { username, email, phone, password } = response.data;

          setFormData({
            username: username || '',
            email: email || '',
            phone: phone || '',
            password: password || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    if (validateForm()) {
      Alert.alert('Updated');
    } else {
      Alert.alert('Correct the errors');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Personal Info</Text>

          <View style={styling.profileicons3}>
            <Image source={require('@/assets/images/Profile/profilegreen.png')} style={{ width: 25, height: 25, marginRight: 5 }} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }}>Name</Text>
          </View>

          <TextInput
            style={styling.inputField}
            placeholder="Username"
            value={formData.username}
            onChangeText={(value) => handleInputChange('username', value)}
          />
          {errors.username && <Text style={{ color: 'red' }}>{errors.username}</Text>}

          <View style={styling.profileicons3}>
            <Image source={require('@/assets/images/Profile/profileemail.png')} style={{ width: 25, height: 25, marginRight: 5 }} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }}>Email</Text>
          </View>

          <TextInput
            style={styling.placeholder}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
          />
          {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

          <View style={styling.profileicons3}>
            <Image source={require('@/assets/images/Profile/profilecontact.png')} style={{ width: 25, height: 25, marginRight: 5 }} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }}>Contact No.</Text>
          </View>

          <TextInput
            style={styling.inputField}
            placeholder="Phone"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={{ color: 'red' }}>{errors.phone}</Text>}

          <View style={styling.profileicons3}>
            <Image source={require('@/assets/images/Profile/profilepass.png')} style={{ width: 25, height: 25, marginRight: 5 }} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }}>Password</Text>
          </View>

          <TextInput
            style={styling.inputField}
            placeholder="Password"
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
          />
          {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}

          <TouchableOpacity onPress={handleUpdate} style={styling.updateButton}>
            <Text style={styling.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditInfo;
