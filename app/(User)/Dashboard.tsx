import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyButton from '@/components/Buttons/MyButton';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Heading from '@/components/Text/Heading';
import Sidebar from '@/components/bars/sidebar';
import styling from '@/assets/Styles/styling';
import { router, useLocalSearchParams } from 'expo-router';
import { auth } from '../(AuthScreens)/firebaseConfig';
import axios from 'axios';
import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';
import PaymentForm from './PaymentForm';
import GymScheduleScreen from './GymScheduleScreen';

const Dashboard = () => {
  const { selectedSection } = useLocalSearchParams(); 
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedSectionState, setSelectedSection] = useState<string>(Array.isArray(selectedSection) ? selectedSection[0] : selectedSection || 'home');
  const [userData, setUserData] = useState<{username: string } | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        const response = await axios.get('http://192.168.0.115:5000/api/auth/getUserdata', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  const openSidebar = () => {
    setIsSidebarVisible(true);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };

  const { width, height } = Dimensions.get('screen');

  // Function to determine the tintColor for the image based on the selection
  const getImageTintColor = (section: string) => {
    return selectedSectionState === section ? '#4CAF50' : '#000000'; // Green for selected, black for unselected
  };

  return (
    <SafeAreaView style={{ height }}>
      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
      <View style={{ flex: 1 }}>
        {/* Navbar - Show only on the 'home' page */}
        {selectedSectionState === 'home' && (
          <View style={styling.subcontainerfornavbar}>
            <View style={styling.navbarleftside}>
              <MyButton
                title={
                  <LogoImgForScreen
                    path={require('@/assets/images/Usersite/Sidebar.png')}
                    styles={styling.dashboardbtnimages}
                  />
                }
                onPress={openSidebar}
                style1={styling.button}
                style2={styling.NextBackbtntext}
              />
              {userData ? (
                <>
                  <Heading title={`Hi, ${userData.username}`} styles={styling.HeaderText}/>
                </>
              ) : (
                <Heading title='Loading'/>
              )}
            </View>
            <View style={styling.navbarleftside}>
              <MyButton
                title={
                  <LogoImgForScreen
                    path={require('@/assets/images/Usersite/notification.png')}
                    styles={styling.dashboardbtnimages}
                  />
                }
                onPress={() => router.navigate('/(User)/Gotonotifications')}
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
          </View>
        )}

        {/* Content Area */}
        {selectedSectionState === 'home' && (
          <View>
            <ImageBackground
              source={require('@/assets/images/dashboard/Body.png')}
              style={[{ width }, styling.dashboardimage]}
            >
              
                  <Heading title={`Welcome To \nFitpro.`} styles={styling.DashboardHeading}/>
            </ImageBackground>
              <Heading title='Features' styles={styling.featureheading}/>
            <View style={styling.dashbaordfeaturesmainview}>
              <View style={styling.featuresubview}>
                <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/workoutplan2.png')} styles={styling.featureimage}/>} style1={styling.button} style2={styling.NextBackbtntext} onPress={() => router.navigate('/Workoutplan')}/>
                <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/Dietplan.png')} styles={styling.featureimage}/>} style1={styling.button} style2={styling.NextBackbtntext} onPress={() => router.navigate('/Dietplan')}/>
              </View>
              <View style={styling.featuresubview}>
                
                <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/bot.png')} styles={styling.featurebotimage}/>} style1={styling.button} style2={styling.NextBackbtntext} onPress={() => router.navigate('/AiScreens/Chatbot')}/>
                {/* <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/Dietplan.png')} styles={styling.featureimage}/>} style1={styling.button} style2={styling.NextBackbtntext} onPress={() => router.navigate('/AiScreens/Chatbot')}/> */}
              </View>
            </View>
          </View>
        )}

        {selectedSectionState === 'watch' && (
          <View style={styling.viewpayment}>
          <View style={styling.subcontainerfornavbar}>
            <View style={styling.navbarleftside}>
                <MyButton
                  title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage}/>}
                  onPress={() => router.navigate('/(User)/Dashboard')}
                  style1={styling.button}
                  style2={styling.NextBackbtntext}
                />
            <Heading title={'Gym Timing'} styles={styling.HeaderText}/>

              </View>

          </View>
          <View style={styling.paymentcardview}>

              <LogoImgForScreen path={require('@/assets/images/Chatbot/gymtiming.jpg')} styles={{ resizeMode: 'contain', width: '100%',height:240 }}/> 
          </View>
          <GymScheduleScreen/>
</View>
        )}

        {selectedSectionState === 'payment' && (
          <View style={styling.viewpayment}>
            <View style={styling.subcontainerfornavbar}>
              <View style={styling.navbarleftside}>
                <MyButton
                  title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage}/>}
                  onPress={() => router.navigate('/(User)/Dashboard')}
                  style1={styling.button}
                  style2={styling.NextBackbtntext}
                />
                <Heading title={'Payment'} styles={styling.HeaderText}/>
              </View>
            </View>
            <View style={styling.paymentcardview}>
              <LogoImgForScreen path={require('@/assets/images/payment/Card.png')} styles={{ resizeMode: 'contain', width: '100%' }}/>
            </View>
            <PaymentForm/>
          </View>
        )}

        {selectedSectionState === 'profile' && (
          <View>
            <Heading title={'Profile Section'} styles={styling.Heading}/>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={[styling.dashbaordfooter, styling.line]}>
        {/* Home Button */}
        <MyButton
          title={<Dashboardscreenimage path={require('@/assets/images/dashboard/home.png')} styles={styling.dashboardfooterbtnimages} tintColor={getImageTintColor('home')}/>}
          onPress={() => setSelectedSection('home')}
          style1={selectedSectionState === 'home' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
        />
        {/* Watch Button */}
        <MyButton
          title={<Dashboardscreenimage path={require('@/assets/images/dashboard/Watch.png')} styles={styling.dashboardfooterbtnimages} tintColor={getImageTintColor('watch')}/>}
          onPress={() => setSelectedSection('watch')}
          style1={selectedSectionState === 'watch' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
        />
        {/* Payment Button */}
        <MyButton
          title={<Dashboardscreenimage path={require('@/assets/images/dashboard/payment.png')} styles={styling.dashboardfooterbtnimages} tintColor={getImageTintColor('payment')}/>}
          onPress={() => setSelectedSection('payment')}
          style1={selectedSectionState === 'payment' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
        />
        {/* Profile Button */}
        <MyButton
          title={<Dashboardscreenimage path={require('@/assets/images/dashboard/profile.png')} styles={styling.dashboardfooterbtnimages} tintColor={getImageTintColor('profile')}/>}
          onPress={() => setSelectedSection('profile')}
          style1={selectedSectionState === 'profile' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
        />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
