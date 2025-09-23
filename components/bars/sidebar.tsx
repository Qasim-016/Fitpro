import { View, Text, Image } from 'react-native';
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
import { SERVER_IP } from '@/app/config';
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
            const response = await axios.get(`${SERVER_IP}/api/auth/getUserdata`, {
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
    const userId = auth.currentUser?.uid;
    if (userId) {
      const response = await fetch(`${SERVER_IP}/user/${userId}`);
      const data = await response.json();

      if (data.profileImage) {
        setProfileImage(`data:image/jpeg;base64,${data.profileImage}`);
      }
    }
  } catch (error) {
    console.error('Error loading profile image:', error);
  }
};

  // Handle image selection
 

  if (!isVisible) return null;

  const { height } = Dimensions.get('screen');

  return (
    <SafeAreaView style={styling.sidebarContainer}>
      <View style={styling.closebuttonview}>
        <MyButton title={<Dashboardscreenimage path={require('@/assets/images/dashboard/closebtn.png')} styles={styling.backbtnimagenavbar} tintColor='#CCCCCC' />} onPress={onClose} style1={styling.closeButton} style2={styling.closeText} />
      </View>

      <View style={styling.sidebarHeader}>
        
          {/* Profile image */}
          <Image
            source={profileImage ? { uri: profileImage } : require('@/assets/images/dashboard/noimage.png')} // Default image
            style={styling.profileImage} // Add styling for the profile image
          />

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
          <LogoImgForScreen path={require('@/assets/images/sidebar/info.png')} styles={styling.sidebaricons} />
          <Link href={'/(User)/Profile'}>Personal info</Link>
        </View>
        <View style={styling.sidebarbodysubview}>
          <LogoImgForScreen path={require('@/assets/images/sidebar/key.png')} styles={styling.sidebaricons} />
          <MyButton title='Account Settings' style1={styling.sidebarbtn} style2={styling.none} onPress={() => router.navigate('/(User)/Profile')} />
        </View>
        <View style={styling.sidebarbodysubview}>
          <LogoImgForScreen path={require('@/assets/images/Usersite/nnn.png')} styles={styling.sidebaricons} />
          <MyButton title='Notifications' style1={styling.sidebarbtn} style2={styling.none} onPress={() => router.navigate('/(User)/Gotonotifications')} />
        </View>
        <View style={styling.sidebarbodysubview}>
          <LogoImgForScreen path={require('@/assets/images/sidebar/msg.png')} styles={styling.sidebaricons} />
          <MyButton title='Fitpro AI' style1={styling.sidebarbtn} style2={styling.none} onPress={() => router.navigate('/AiScreens/Chatbot')} />
        </View>
      </View>

      <MyButton title={'Contact Us'} style1={styling.contactbtn} style2={styling.FullwidthbtnText} onPress={() => router.navigate('/Contact')} />
    </SafeAreaView>
  );
};

export default Sidebar;
