// import { View, Text } from 'react-native'
// import React from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import MyButton from '@/components/Buttons/MyButton'
// import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
// import { Router, useRouter } from 'expo-router'
// import styling from '@/assets/Styles/styling'
// import Heading from '@/components/Text/Heading'
// import { useState } from 'react'
// import Sidebar from '@/components/bars/sidebar'
// import { ImageBackground } from 'react-native'
// import { Dimensions } from 'react-native'
// import Paragraph from '@/components/Text/Paragraph'
// const dashboard = () => {
//     const router =useRouter()
//     const [isSidebarVisible, setIsSidebarVisible] = useState(false);

//   const openSidebar = () => {
//     setIsSidebarVisible(true);
//   };

//   const closeSidebar = () => {
//     setIsSidebarVisible(false);
//   };
  
    
//   const { width } = Dimensions.get('screen');
// const {height} = Dimensions.get('screen')
    
//   return (
//     <SafeAreaView style={{height}}>
//       <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
//       <View style={styling.subcontainerfornavbar}>
//         <View style={styling.navbarleftside}>

//       <MyButton 
//           title={<LogoImgForScreen path={require('@/assets/images/Usersite/Sidebar.png')} styles={styling.dashboardbtnimages}/>} 
//           onPress={openSidebar}
//           style1={styling.button} 
//           style2={styling.NextBackbtntext} 
//           />
//         <Heading title={'Hi,Qasim'} styles={styling.HeaderText}/>
//           </View>
//           <View style={styling.navbarleftside}>
// <MyButton title={<LogoImgForScreen path={require('@/assets/images/Usersite/notification.png')} styles={styling.dashboardbtnimages}/>} style1={styling.button} style2={styling.NextBackbtntext} onPress={() => router.push('GoNofification')}/>
        
//        <MyButton title={<LogoImgForScreen path={require('@/assets/images/icons/logout.png')} styles={styling.dashboardbtnimages}/>} onPress={() => router.push('/(AuthScreens)/login')} style1={styling.button} style2={styling.NextBackbtntext}/>
//      </View>
//       </View>
//       <View style={styling.dashboardimageview}>

//       <ImageBackground source={require('@/assets/images/dashboard/Body.png')} style={[{width},styling.dashboardimage]} >
//       <Heading title={'Your Fitness \nJourney Starts\n Here'} styles={styling.DashboardHeading}/>
//       </ImageBackground>

//       </ View>
//       <View style={styling.dashbaordfeaturesmainview}>
//         <Heading title={'Features'} styles={styling.Heading}/>
//       </View>
//       <View style={styling.dashbaordfooter}>
//         {/* <View style={styling.subcontainerforfooter}> */}

//       <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/home.png')} styles={styling.dashboardbtnimages}/>} onPress={() => router.push('/(User)/Dashboard')} style1={styling.button} style2={styling.NextBackbtntext}/>
//       <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/Watch.png')} styles={styling.dashboardbtnimages}/>} onPress={() => router.push('/(User)/Dashboard')} style1={styling.button} style2={styling.NextBackbtntext}/>
//       <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/payment.png')} styles={styling.dashboardbtnimages}/>} onPress={() => router.push('/(AuthScreens)/login')} style1={styling.button} style2={styling.NextBackbtntext}/>
//       <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/profile.png')} styles={styling.dashboardbtnimages}/>} onPress={() => router.push('/(AuthScreens)/login')} style1={styling.button} style2={styling.NextBackbtntext}/>
//         {/* </View> */}
//       </View>
//     </SafeAreaView>
//   )
// }

// export default dashboard


// import { View, ImageBackground } from 'react-native';
// import React, { useState } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import MyButton from '@/components/Buttons/MyButton';
// import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
// import { useRouter } from 'expo-router';
// import styling from '@/assets/Styles/styling';
// import Heading from '@/components/Text/Heading';
// import Sidebar from '@/components/bars/sidebar';
// import { Dimensions } from 'react-native';
// import { Href } from 'expo-router';

// const Dashboard = () => {
//   const router = useRouter();
//   const [isSidebarVisible, setIsSidebarVisible] = useState(false);
//   const [selectedButton, setSelectedButton] = useState<string | null>('home'); // Default to 'home'

//   const openSidebar = () => {
//     setIsSidebarVisible(true);
//   };

//   const closeSidebar = () => {
//     setIsSidebarVisible(false);
//   };

//   const handleButtonPress = (buttonId: string, route: string) => {
//     setSelectedButton(buttonId); // Update the selected button
//     router.push(route as Href); // Navigate to the specified route
//   };

//   const { width } = Dimensions.get('screen');
//   const { height } = Dimensions.get('screen');

//   return (
//     <SafeAreaView style={{ height }}>
//       <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
//       <View style={styling.subcontainerfornavbar}>
//         <View style={styling.navbarleftside}>
//           <MyButton
//             title={
//               <LogoImgForScreen
//                 path={require('@/assets/images/Usersite/Sidebar.png')}
//                 styles={styling.dashboardbtnimages}
//               />
//             }
//             onPress={openSidebar}
//             style1={styling.button}
//             style2={styling.NextBackbtntext}
//           />
//           <Heading title={'Hi, Qasim'} styles={styling.HeaderText} />
//         </View>
//         <View style={styling.navbarleftside}>
//           <MyButton
//             title={
//               <LogoImgForScreen
//                 path={require('@/assets/images/Usersite/notification.png')}
//                 styles={styling.dashboardbtnimages}
//               />
//             }
//             style1={styling.button}
//             style2={styling.NextBackbtntext}
//             onPress={() => router.push('GoNotification')}
//           />
//           <MyButton
//             title={
//               <LogoImgForScreen
//                 path={require('@/assets/images/icons/logout.png')}
//                 styles={styling.dashboardbtnimages}
//               />
//             }
//             onPress={() => router.push('/(AuthScreens)/login')}
//             style1={styling.button}
//             style2={styling.NextBackbtntext}
//           />
//         </View>
//       </View>
//       <View style={styling.dashboardimageview}>
//         <ImageBackground
//           source={require('@/assets/images/dashboard/Body.png')}
//           style={[{ width }, styling.dashboardimage]}
//         >
//           <Heading
//             title={'Your Fitness \nJourney Starts\n Here'}
//             styles={styling.DashboardHeading}
//           />
//         </ImageBackground>
//       </View>
//       <View style={styling.dashbaordfeaturesmainview}>
//         <Heading title={'Features'} styles={styling.Heading} />
//       </View>
//       <View style={styling.dashbaordfooter}>
//         {/* Home Button */}
//         <MyButton
//           title={
//             <LogoImgForScreen
//               path={require('@/assets/images/dashboard/home.png')}
//               styles={styling.dashboardbtnimages}
//             />
//           }
//           onPress={() => handleButtonPress('home', '/(User)/Dashboard')}
//           style1={
//             selectedButton === 'home'
//               ? styling.selectedButton
//               : styling.button1
//           }
//           style2={styling.NextBackbtntext}
//         />

//         {/* Watch Button */}
//         <MyButton
//           title={
//             <LogoImgForScreen
//               path={require('@/assets/images/dashboard/Watch.png')}
//               styles={styling.dashboardbtnimages}
//             />
//           }
//           onPress={() => handleButtonPress('watch', '/(User)/Bar')}
//           style1={
//             selectedButton === 'watch'
//               ? styling.selectedButton
//               : styling.button1
//           }
//           style2={styling.NextBackbtntext}
//         />

//         {/* Payment Button */}
//         <MyButton
//           title={
//             <LogoImgForScreen
//               path={require('@/assets/images/dashboard/payment.png')}
//               styles={styling.dashboardbtnimages}
//             />
//           }
//           onPress={() => handleButtonPress('payment', '/(AuthScreens)/login')}
//           style1={
//             selectedButton === 'payment'
//               ? styling.selectedButton
//               : styling.button1
//           }
//           style2={styling.NextBackbtntext}
//         />

//         {/* Profile Button */}
//         <MyButton
//           title={
//             <LogoImgForScreen
//               path={require('@/assets/images/dashboard/profile.png')}
//               styles={styling.dashboardbtnimages}
//             />
//           }
//           onPress={() => handleButtonPress('profile', '/(AuthScreens)/login')}
//           style1={
//             selectedButton === 'profile'
//               ? styling.selectedButton
//               : styling.button1
//           }
//           style2={styling.NextBackbtntext}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Dashboard;


// import React, { useState } from 'react';
// import { View, ImageBackground, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import MyButton from '@/components/Buttons/MyButton';
// import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
// import Heading from '@/components/Text/Heading';
// import Sidebar from '@/components/bars/sidebar';
// import styling from '@/assets/Styles/styling';
// import { router } from 'expo-router';

// const Dashboard = () => {
//   const [isSidebarVisible, setIsSidebarVisible] = useState(false);
//   const [selectedSection, setSelectedSection] = useState<string>('home'); // Default to 'home'

//   const openSidebar = () => {
//     setIsSidebarVisible(true);
//   };

//   const closeSidebar = () => {
//     setIsSidebarVisible(false);
//   };

//   const { width } = Dimensions.get('screen');
//   const { height } = Dimensions.get('screen');

//   return (
//     <SafeAreaView style={{ height }}>
//       <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
//       <View style={{ flex: 1 }}>
//         {/* Navbar - Show only on the 'home' page */}
//         {selectedSection === 'home' && (
//           <View style={styling.subcontainerfornavbar}>
//             <View style={styling.navbarleftside}>
//               <MyButton
//                 title={
//                   <LogoImgForScreen
//                     path={require('@/assets/images/Usersite/Sidebar.png')}
//                     styles={styling.dashboardbtnimages}
//                   />
//                 }
//                 onPress={openSidebar}
//                 style1={styling.button}
//                 style2={styling.NextBackbtntext}
//               />
//               <Heading title={'Hi, Qasim'} styles={styling.HeaderText} />
//             </View>
//             <View style={styling.navbarleftside}>
//               <MyButton
//                 title={
//                   <LogoImgForScreen
//                     path={require('@/assets/images/Usersite/notification.png')}
//                     styles={styling.dashboardbtnimages}
//                   />
//                 }
//                 onPress={() => router.push('/(User)GoNofification')}
//                 style1={styling.button}
//                 style2={styling.NextBackbtntext}
//               />
//               <MyButton
//                 title={
//                   <LogoImgForScreen
//                     path={require('@/assets/images/icons/logout.png')}
//                     styles={styling.dashboardbtnimages}
//                   />
//                 }
//                 onPress={() => setSelectedSection('login')}
//                 style1={styling.button}
//                 style2={styling.NextBackbtntext}
//               />
//             </View>
//           </View>
//         )}

//         {/* Content Area */}
//         {selectedSection === 'home' && (
//           <View>
//             <ImageBackground
//               source={require('@/assets/images/dashboard/Body.png')}
//               style={[{ width }, styling.dashboardimage]}
//             >
//               <Heading
//                 title={'Your Fitness \nJourney Starts\n Here'}
//                 styles={styling.DashboardHeading}
//               />
//             </ImageBackground>
//           </View>
//         )}

//         {selectedSection === 'watch' && (
//           <View style={[{ width }, { height }]}>
//             <Heading title={'Watch Section'} styles={styling.Heading} />
//             {/* Add more watch section content here */}
//           </View>
//         )}

//         {selectedSection === 'payment' && (
//           <View>
//             <Heading title={'Payment Section'} styles={styling.Heading} />
//             {/* Add payment-related content here */}
//           </View>
//         )}

//         {selectedSection === 'profile' && (
//           <View>
//             <Heading title={'Profile Section'} styles={styling.Heading} />
//             {/* Add profile-related content here */}
//           </View>
//         )}
//       </View>

//       {/* Footer */}
//       <View style={styling.dashbaordfooter}>
//         {/* Home Button */}
//         <MyButton
//           title={
//             <LogoImgForScreen
//               path={require('@/assets/images/dashboard/home.png')}
//               styles={styling.dashboardbtnimages}
//             />
//           }
//           onPress={() => setSelectedSection('home')}
//           style1={
//             selectedSection === 'home'
//               ? styling.selectedButton
//               : styling.button1
//           }
//           style2={styling.NextBackbtntext}
//         />

//         {/* Watch Button */}
//         <MyButton
//           title={
//             <LogoImgForScreen
//               path={require('@/assets/images/dashboard/Watch.png')}
//               styles={styling.dashboardbtnimages}
//             />
//           }
//           onPress={() => setSelectedSection('watch')}
//           style1={
//             selectedSection === 'watch'
//               ? styling.selectedButton
//               : styling.button1
//           }
//           style2={styling.NextBackbtntext}
//         />

//         {/* Payment Button */}
//         <MyButton
//           title={
//             <LogoImgForScreen
//               path={require('@/assets/images/dashboard/payment.png')}
//               styles={styling.dashboardbtnimages}
//             />
//           }
//           onPress={() => setSelectedSection('payment')}
//           style1={
//             selectedSection === 'payment'
//               ? styling.selectedButton
//               : styling.button1
//           }
//           style2={styling.NextBackbtntext}
//         />

//         {/* Profile Button */}
//         <MyButton
//           title={
//             <LogoImgForScreen
//               path={require('@/assets/images/dashboard/profile.png')}
//               styles={styling.dashboardbtnimages}
//             />
//           }
//           onPress={() => setSelectedSection('profile')}
//           style1={
//             selectedSection === 'profile'
//               ? styling.selectedButton
//               : styling.button1
//           }
//           style2={styling.NextBackbtntext}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Dashboard;


import React, { useState } from 'react';
import { View, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyButton from '@/components/Buttons/MyButton';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Heading from '@/components/Text/Heading';
import Sidebar from '@/components/bars/sidebar';
import styling from '@/assets/Styles/styling';
import { router } from 'expo-router';
import Dashboardscreenimage from '@/components/ScreenImages/dashboardscreenimages';
const Dashboard = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('home'); // Default to 'home'

  const openSidebar = () => {
    setIsSidebarVisible(true);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };

  const { width } = Dimensions.get('screen');
  const { height } = Dimensions.get('screen');

  // Function to determine the tintColor for the image based on the selection
  const getImageTintColor = (section: string) => {
    return selectedSection === section ? '#4CAF50' : '#000000'; // Green for selected, black for unselected
  };

  return (
    <SafeAreaView style={{ height }}>
      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
      <View style={{ flex: 1 }}>
        {/* Navbar - Show only on the 'home' page */}
        {selectedSection === 'home' && (
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
              <Heading title={'Hi, Qasim'} styles={styling.HeaderText} />
            </View>
            <View style={styling.navbarleftside}>
              <MyButton
                title={
                  <LogoImgForScreen
                    path={require('@/assets/images/Usersite/notification.png')}
                    styles={styling.dashboardbtnimages}
                  />
                }
                onPress={() => router.push('/GoNofification')}
                style1={styling.button}
                style2={styling.NextBackbtntext}
              />
              <MyButton
                title={
                  <LogoImgForScreen
                    path={require('@/assets/images/icons/logout.png')}
                    styles={styling.dashboardbtnimages}
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
        {selectedSection === 'home' && (
          <View>
            <ImageBackground
              source={require('@/assets/images/dashboard/Body.png')}
              style={[{ width }, styling.dashboardimage]}
            >
              <Heading
                title={'Your Fitness \nJourney Starts\n Here'}
                styles={styling.DashboardHeading}
              />
            </ImageBackground>
            <View style={styling.dashbaordfeaturesmainview}>
              <Heading title='Features' styles={styling.Heading}/>
              <View style={styling.featuresubview}>
                <MyButton title={
                <LogoImgForScreen path={require('@/assets/images/dashboard/Workoutplan.png')} styles={styling.featureimage}/>
                 } style1={styling.button} style2={styling.NextBackbtntext} onPress={()=>router.navigate('/Workoutplan')}/>
                 <MyButton title={
                <LogoImgForScreen path={require('@/assets/images/dashboard/Dietplan.png')} styles={styling.featureimage}/>
                 } style1={styling.button} style2={styling.NextBackbtntext} onPress={()=>router.navigate('/Dietplan')}/>
                   </View>
                   <View style={styling.featuresubview}>
                <MyButton title={
                <LogoImgForScreen path={require('@/assets/images/dashboard/Workoutplan.png')} styles={styling.featureimage}/>
                 } style1={styling.button} style2={styling.NextBackbtntext} onPress={()=>router.navigate('/Workoutplan')}/>
                 <MyButton title={
                <LogoImgForScreen path={require('@/assets/images/dashboard/Dietplan.png')} styles={styling.featureimage}/>
                 } style1={styling.button} style2={styling.NextBackbtntext} onPress={()=>router.navigate('/Chatbot')}/>
                   </View>
                
            </View>
          </View>
        )}

        {selectedSection === 'watch' && (
          <View style={[{ width }, { height }]}>
            <Heading title={'Watch Section'} styles={styling.Heading} />
            {/* Add more watch section content here */}
          </View>
        )}

        {selectedSection === 'payment' && (
          <View>
            <Heading title={'Payment Section'} styles={styling.Heading} />
            {/* Add payment-related content here */}
          </View>
        )}

        {selectedSection === 'profile' && (
          <View>
            <Heading title={'Profile Section'} styles={styling.Heading} />
            {/* Add profile-related content here */}
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styling.dashbaordfooter}>
        {/* Home Button */}
        <MyButton
          title={
            <Dashboardscreenimage
              path={require('@/assets/images/dashboard/home.png')}
              styles={styling.dashboardbtnimages}
              tintColor={getImageTintColor('home')} // Change the tintColor based on selection
            />
          }
          onPress={() => setSelectedSection('home')}
          style1={selectedSection === 'home' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
        />

        {/* Watch Button */}
        <MyButton
          title={
            <Dashboardscreenimage
              path={require('@/assets/images/dashboard/Watch.png')}
              styles={styling.dashboardbtnimages}
              tintColor={getImageTintColor('watch')} // Change the tintColor based on selection
            />
          }
          onPress={() => setSelectedSection('watch')}
          style1={selectedSection === 'watch' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
        />

        {/* Payment Button */}
        <MyButton
          title={
            <Dashboardscreenimage
              path={require('@/assets/images/dashboard/payment.png')}
              styles={styling.dashboardbtnimages}
              tintColor={getImageTintColor('payment')} // Change the tintColor based on selection
            />
          }
          onPress={() => setSelectedSection('payment')}
          style1={selectedSection === 'payment' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
        />

        {/* Profile Button */}
        <MyButton
          title={
            <Dashboardscreenimage
              path={require('@/assets/images/dashboard/profile.png')}
              styles={styling.dashboardbtnimages}
              tintColor={getImageTintColor('profile')} // Change the tintColor based on selection
            />
          }
          onPress={() => setSelectedSection('profile')}
          style1={selectedSection === 'profile' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
        />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
