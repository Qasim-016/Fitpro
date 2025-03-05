import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import styling from '@/assets/Styles/styling';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import axios from 'axios';
import MyButton from '../Buttons/MyButton';
import LogoImgForScreen from '../ScreenImages/LogoImgForScreen';
import Dashboardscreenimage from '../ScreenImages/Dashboardscreenimages';
import { auth } from '@/app/(AuthScreens)/firebaseConfig'; // Ensure correct path
import Heading from '../Text/Heading';
import Paragraph from '../Text/Paragraph';
import { Link, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SidebarProps {
  isVisible: boolean; // Whether the sidebar is visible
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const [userData, setUserData] = useState<{ email: string, username: string } | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user data when sidebar is visible
    if (isVisible) {
      const fetchUserData = async () => {
        try {
          // Get the Firebase ID token
          const idToken = await auth.currentUser?.getIdToken();

          if (idToken) {
            const response = await axios.get('http://192.168.0.116:5000/api/auth/getUserdata', {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            });

            setUserData(response.data); // Store the user data in state
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      };

      fetchUserData();
      loadProfileImage();
    }
  }, [isVisible]);

  // Load profile image from AsyncStorage using userId (uid)
  const loadProfileImage = async () => {
    try {
      const userId = auth.currentUser?.uid; // Get the current user's UID
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

  // Handle image selection
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to allow access to the gallery.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square image
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setProfileImage(selectedImage);

      // Store the image for the current user using their uid
      const userId = auth.currentUser?.uid;
      if (userId) {
        await AsyncStorage.setItem(`profileImage_${userId}`, selectedImage);
      }
    }
  };

  if (!isVisible) return null;

  const { height } = Dimensions.get('screen');

  return (
    <SafeAreaView style={styling.sidebarContainer}>
      <View style={styling.closebuttonview}>
        <MyButton title={<Dashboardscreenimage path={require('@/assets/images/dashboard/closebtn.png')} styles={styling.backbtnimagenavbar} tintColor='#CCCCCC' />} onPress={onClose} style1={styling.closeButton} style2={styling.closeText} />
      </View>

      <View style={styling.sidebarHeader}>
        <TouchableOpacity onPress={pickImage}>
          {/* Profile image */}
          <Image
            source={profileImage ? { uri: profileImage } : require('@/assets/images/dashboard/noimage.png')} // Default image
            style={styling.profileImage} // Add styling for the profile image
          />
        </TouchableOpacity>

        {userData ? (
          <>
            <Heading title={userData.username} styles={styling.sidebarUserName} />
            <Paragraph paragraph={userData.email} styles={styling.sidebarUserEmail} />
          </>
        ) : (
          <Text>Loading user data...</Text>
        )}
      </View>

      <View style={styling.sidebarbody}>
        <View style={styling.sidebarbodysubview}>
          <LogoImgForScreen path={require('@/assets/images/sidebar/personalinfo.png')} styles={styling.sidebaricons} />
          <Link href={'/(User)/Profile'}>Personal info</Link>
        </View>
        <View style={styling.sidebarbodysubview}>
          <LogoImgForScreen path={require('@/assets/images/sidebar/key.png')} styles={styling.sidebaricons} />
          <MyButton title='Account Settings' style1={styling.sidebarbtn} style2={styling.none} onPress={() => router.navigate('/(User)/Profile')} />
        </View>
        <View style={styling.sidebarbodysubview}>
          <LogoImgForScreen path={require('@/assets/images/sidebar/notify.png')} styles={styling.sidebaricons} />
          <MyButton title='Notifications' style1={styling.sidebarbtn} style2={styling.none} onPress={() => router.navigate('/(User)/Gotonotifications')} />
        </View>
        <View style={styling.sidebarbodysubview}>
          <LogoImgForScreen path={require('@/assets/images/sidebar/ai.png')} styles={styling.sidebaricons} />
          <MyButton title='Fitpro AI' style1={styling.sidebarbtn} style2={styling.none} onPress={() => router.navigate('/AiScreens/Chatbot')} />
        </View>
      </View>

      <MyButton title={'Contact Us'} style1={styling.contactbtn} style2={styling.FullwidthbtnText} onPress={() => router.navigate('/Contact')} />
    </SafeAreaView>
  );
};

export default Sidebar;
