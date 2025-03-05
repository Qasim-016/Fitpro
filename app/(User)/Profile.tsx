import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '@/app/(AuthScreens)/firebaseConfig';
import axios from 'axios';
import styling from '@/assets/Styles/styling';
import MyButton from '@/components/Buttons/MyButton';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Heading from '@/components/Text/Heading';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import { TextInput } from 'react-native';
import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';
import AccountSettings from './AccountSettings';
import PersonalInfo from './PersonalInfo';
import EditInfo from './EditInfo';

import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
import { ScrollView } from 'react-native';

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
const Profile = () => {
  const [activeSection, setActiveSection] = useState('Profile');
  const [userData, setUserData] = useState<{ username: string; email: string; phone: number; password: string } | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
    loadProfileImage();
  }, []);

  const fetchUserData = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        const response = await axios.get('http://192.168.0.116:5000/api/auth/getUserdata', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  const loadProfileImage = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const savedImage = await AsyncStorage.getItem(`profileImage_${userId}`);
        if (savedImage) {
          setProfileImage(savedImage);
        }
      }
    } catch (error) {
      console.error('Error loading profile image', error);
    }
  };

  const selectProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant access to your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0].uri;
        setProfileImage(selectedImage);

        // Save to AsyncStorage
        const userId = auth.currentUser?.uid;
        if (userId) {
          await AsyncStorage.setItem(`profileImage_${userId}`, selectedImage);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };


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
    if (!validateForm()) {
      Alert.alert('Correct the errors before updating');
      return;
    }

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const userId = auth.currentUser?.uid;

      if (!userId || !idToken) {
        Alert.alert('User not authenticated');
        return;
      }

      const response = await axios.post(
        'http://192.168.0.116:5000/api/auth/updateUser',
        { userId, ...formData },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      if (response.data.success) {
        Alert.alert('Updated successfully');
      } else {
        Alert.alert('Failed to update user');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error updating user');
    }
  };


  return (
    <SafeAreaView style={styling.profilecontainer}>


      <View style={styling.navbarleftsideprofile}>
        <MyButton
          title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
          onPress={() => setActiveSection('Profile')}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title={activeSection} styles={styling.HeaderText} />

        {/* Conditionally render logout button in the navbar */}
        {activeSection === 'Personal Info' && (
          <View style={styling.profileviewicons2}>

            <MyButton
              title={
                <Dashboardscreenimage
                  path={require('@/assets/images/dashboard/logout.png')}
                  styles={styling.dashboardbtnimages}
                  tintColor='#2ecc71'
                />
              }
              onPress={() => router.navigate('/(AuthScreens)/login')}
              style1={styling.button}
              style2={styling.NextBackbtntext}
            />
          </View>
        )}
        {activeSection === 'Account Settings' && (
          <View style={styling.profileviewicons2}>
            <MyButton
              title={
                <Dashboardscreenimage
                  path={require('@/assets/images/Profile/edit.png')}
                  styles={styling.dashboardbtnimages}
                // tintColor='#2ecc71'
                />
              }
              onPress={() => setActiveSection('Edit Profile')}
              style1={styling.button}
              style2={styling.NextBackbtntext}
            />
            <MyButton
              title={
                <Dashboardscreenimage
                  path={require('@/assets/images/dashboard/logout.png')}
                  styles={styling.dashboardbtnimages}
                  tintColor='#2ecc71'
                />
              }
              onPress={() => router.navigate('/(AuthScreens)/login')}
              style1={styling.button}
              style2={styling.NextBackbtntext}
            />
          </View>
        )}
      </View>



      {/* Static Profile Section */}
      <View style={styling.profileHeader1}>
        {/* <TouchableOpacity style={styling.imageContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('@/assets/images/dashboard/noimage.png')
            }
            style={styling.profileImage}
          />
        </TouchableOpacity> */}
        <TouchableOpacity style={styling.imageContainer} onPress={selectProfileImage}>
        <Image
          source={profileImage ? { uri: profileImage } : require('@/assets/images/dashboard/noimage.png')}
          style={styling.profileImage}
        />
      </TouchableOpacity>
        <Text style={styling.profileUsername}>{userData?.username || 'User Name'}</Text>
      </View>

      {/* Dynamic Content Section */}
      <View style={styling.content}>
        {activeSection === 'Profile' && (
          <View style={styling.infoContainer}>
            <TouchableOpacity style={styling.infoItem} onPress={() => setActiveSection('Personal Info')}>
              <Image source={require('@/assets/images/sidebar/personalinfo.png')} style={styling.infoIcon} />
              <View style={styling.infoText}>
                <Text style={styling.infoTitle}>Personal Info</Text>
                <Text style={styling.infoSubtitle}>Name, Email, Contact</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styling.infoItem} onPress={() => setActiveSection('Account Settings')}>
              <Image source={require('@/assets/images/sidebar/key.png')} style={styling.infoIcon} />
              <View style={styling.infoText}>
                <Text style={styling.infoTitle}>Account Settings</Text>
                <Text style={styling.infoSubtitle}>Username, Email, Password</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styling.infoItem} onPress={() => router.push('/(User)/Gotonotifications')}>
              <Image source={require('@/assets/images/sidebar/notify.png')} style={styling.infoIcon} />
              <View style={styling.infoText}>
                <Text style={styling.infoTitle}>Notifications</Text>
                <Text style={styling.infoSubtitle}>Manage your alerts</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styling.infoItem} onPress={() => router.push('/AiScreens/Chatbot')}>
              <Image source={require('@/assets/images/sidebar/ai.png')} style={styling.infoIcon} />
              <View style={styling.infoText}>
                <Text style={styling.infoTitle}>AI ChatBot</Text>
                <Text style={styling.infoSubtitle}>Personalized chatbot</Text>
              </View>
            </TouchableOpacity>
            {activeSection === 'Profile' && (
              <MyButton
                title="Logout"
                onPress={() => {
                  router.navigate('/login');
                }}
                style1={styling.updateButton}
                style2={styling.updateButtonText}
              />
            )}
          </View>
        )}

        {activeSection === 'Personal Info' && (
          <View>
            {/* <Text style={styling.headerTitle}>Personal Info</Text> */}
            <PersonalInfo />

          </View>
        )}

        {activeSection === 'Account Settings' && (
          <View>
            <AccountSettings />
          </View>
        )}

        {activeSection === 'Notifications' && (
          <View>
            <Text style={styling.sectionContent}>Customize your notification preferences.</Text>
          </View>
        )}
        {activeSection === 'Edit Profile' && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Personal Info</Text>

                {/* Username */}
                <View style={styling.profileicons3}>
                  <Image source={require('@/assets/images/Profile/profilegreen.png')} style={{ width: 25, height: 25, marginRight: 5 }} />
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }}>Name</Text>
                </View>
                <TextInput
                  style={styling.placeholder}
                  placeholder="Username"
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                />
                {errors.username ? <Text style={{ color: 'red' }}>{errors.username}</Text> : null}

                {/* Email */}
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
                {errors.email ? <Text style={{ color: 'red' }}>{errors.email}</Text> : null}

                {/* Phone */}
                <View style={styling.profileicons3}>
                  <Image source={require('@/assets/images/Profile/profilecontact.png')} style={{ width: 25, height: 25, marginRight: 5 }} />
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }}>Contact No.</Text>
                </View>
                <TextInput
                  style={styling.placeholder}
                  placeholder="Phone"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                />
                {errors.phone ? <Text style={{ color: 'red' }}>{errors.phone}</Text> : null}

                {/* Password */}
                <View style={styling.profileicons3}>
                  <Image source={require('@/assets/images/Profile/profilepass.png')} style={{ width: 25, height: 25, marginRight: 5 }} />
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }}>Password</Text>
                </View>
                <TextInput
                  style={styling.placeholder}
                  placeholder="Password"
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                />
                {errors.password ? <Text style={{ color: 'red' }}>{errors.password}</Text> : null}

                {/* Update Button */}
                <TouchableOpacity onPress={handleUpdate} style={styling.updateButton}>
                  <Text style={styling.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        )}
      </View>

      {/* Logout Button (Static) */}


      {/* Footer - Static */}

    </SafeAreaView>
  );
};

export default Profile;
