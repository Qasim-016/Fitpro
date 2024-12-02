import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import styling from '@/assets/Styles/styling';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import axios from 'axios';
import MyButton from '../Buttons/MyButton';
import LogoImgForScreen from '../ScreenImages/LogoImgForScreen';
import Dashboardscreenimage from '../ScreenImages/Dashboardscreenimages';
// import { auth } from './firebaseConfig';
import { auth } from '@/app/(AuthScreens)/firebaseConfig'; // Make sure this is the correct path for Firebase
import Heading from '../Text/Heading';
import Paragraph from '../Text/Paragraph';
import { Link, router } from 'expo-router';

interface SidebarProps {
  isVisible: boolean; // Whether the sidebar is visible
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const [userData, setUserData] = useState<{ email: string, username: string } | null>(null);

  useEffect(() => {
    // Fetch user data when sidebar is visible
    if (isVisible) {
      const fetchUserData = async () => {
        try {
          // Get the Firebase ID token
          const idToken = await auth.currentUser?.getIdToken();

          if (idToken) {
            const response = await axios.get('http://192.168.0.106:5000/api/auth/getUserdata', {
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
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const { height } = Dimensions.get('screen');

  return (
    <SafeAreaView style={styling.sidebarContainer}>
      <View style={styling.closebuttonview}>
        <MyButton title={<Dashboardscreenimage path={require('@/assets/images/dashboard/closebtn.png')} styles={styling.backbtnimagenavbar} tintColor='white' />} onPress={onClose} style1={styling.closeButton} style2={styling.closeText} />
      </View>

      <View style={styling.sidebarHeader}>
        {userData ? (
          <>
            <Heading title={userData.username} styles={styling.sidebarUserName}/>
            <Paragraph paragraph={userData.email} styles={styling.sidebarUserEmail}/>
          </>
        ) : (
          <Text>Loading user data...</Text>
        )}
      </View>
      <View style={styling.sidebarbody}>
        <View style={styling.sidebarbodysubview}>
        <LogoImgForScreen path={require('@/assets/images/sidebar/personalinfo.png')} styles={styling.sidebaricons}/>
        <Link href={'/AiScreens/Chatbot'}>Personal info</Link>
        {/* <MyButton title='Personal info' style1={styling.sidebarbtn} style2={styling.none} onPress={()=>router.push('/AiScreens/Chatbot')}/> */}
        </View>
        <View style={styling.sidebarbodysubview}>
        <LogoImgForScreen path={require('@/assets/images/sidebar/key.png')} styles={styling.sidebaricons}/>
        <MyButton title='Account Settings' style1={styling.sidebarbtn} style2={styling.none} onPress={()=>router.navigate('/AiScreens/Chatbot')}/>
       </View>
       <View style={styling.sidebarbodysubview}>
        <LogoImgForScreen path={require('@/assets/images/sidebar/notify.png')} styles={styling.sidebaricons}/>
        <MyButton title='Notifications' style1={styling.sidebarbtn} style2={styling.none} onPress={()=>router.navigate('/(User)/Gotonotifications')}/>
        </View>
        <View style={styling.sidebarbodysubview}>
        <LogoImgForScreen path={require('@/assets/images/sidebar/ai.png')} styles={styling.sidebaricons}/>
        <MyButton title='Fitpro AI' style1={styling.sidebarbtn} style2={styling.none} onPress={()=>router.navigate('/AiScreens/Chatbot')}/>
      </View>
      </View>
    </SafeAreaView>
  );
};

export default Sidebar;



