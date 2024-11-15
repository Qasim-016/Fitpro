import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { Router, useRouter } from 'expo-router'
import styling from '@/assets/Styles/styling'
import Heading from '@/components/Text/Heading'

const dashboard = () => {
    const router =useRouter()
    const goto =()=>{
        router.navigate('/Bar')
    }

    
  return (
    <SafeAreaView>
      <View style={styling.Backbtn}>
      <MyButton 
          title={<LogoImgForScreen path={require('@/assets/images/Usersite/Sidebar.png')} styles={styling.NextBackbtnimage}/>} 
          onPress={goto}
          style1={styling.button} 
          style2={styling.NextBackbtntext} 
        />
        <Heading title={'Hi,Shawaiz'} styles={styling.HeaderText}/>
        <LogoImgForScreen path={require('@/assets/images/Usersite/notification.png')} styles={styling.marginright}/>
      </View>
    </SafeAreaView>
  )
}

export default dashboard