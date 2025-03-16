import { View, Text,ImageBackground } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styling from '@/assets/Styles/styling'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import { Dimensions } from 'react-native'

const Dietplan = () => {
      const { height, width } = Dimensions.get('screen');
  
  return (
    <ImageBackground source={require('@/assets/User/diet.png')} style={{ width, height }} resizeMode="cover">
    {/* <View style={styling.Backbtn}>
      <MyButton title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
      onPress={() => router.back()}
        style1={styling.button}
        style2={styling.NextBackbtntext} />
        <Heading title="Workout Plan" styles={styling.HeaderText} />
        </View>    */}
    <View style={[styling.container, styling.Gap]}>
     

      <MyButton
        title="Predefined"
        onPress={()=>router.push('/DietNormal')}
        style1={styling.freetrialbtn}
        style2={styling.FreeTrialText}
        />
      <MyButton
        title="Customized"
        onPress={() => router.push('/(User)/CustomizedDiet')}
        style1={styling.FullWidthbutton}
        style2={styling.FullwidthbtnText}
        />
    </View>
     </ImageBackground>
  )
}

export default Dietplan