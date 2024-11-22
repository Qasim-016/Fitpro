import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { Router, useRouter } from 'expo-router'
import styling from '@/assets/Styles/styling'
import Heading from '@/components/Text/Heading'
import { useState } from 'react'
import Sidebar from '@/components/bars/sidebar'
const dashboard = () => {
    const router =useRouter()
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const openSidebar = () => {
    setIsSidebarVisible(true);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };
    
    

    
  return (
    <SafeAreaView>
      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
      <View style={styling.Backbtn}>
      <MyButton 
          title={<LogoImgForScreen path={require('@/assets/images/Usersite/Sidebar.png')} styles={styling.NextBackbtnimage}/>} 
          onPress={openSidebar}
          style1={styling.button} 
          style2={styling.NextBackbtntext} 
        />
        <Heading title={'Hi,Qasim'} styles={styling.HeaderText}/>
        <LogoImgForScreen path={require('@/assets/images/Usersite/notification.png')} styles={styling.marginright}/>
      </View>
    </SafeAreaView>
  )
}

export default dashboard