import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styling from '@/assets/Styles/styling'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import { Dimensions } from 'react-native'

const Workoutplan = () => {
    const { height, width } = Dimensions.get('screen');
  
  return (
    <ImageBackground source={require('@/assets/User/Workout.png')} style={{ width, height }} resizeMode="cover">
      
      <View style={[styling.Workoutcontainer, styling.Gap]}>
        

        <MyButton
          title="Predefined"
          onPress={()=>router.push('/(User)/WorkoutNormal')}
          style1={styling.freetrialbtn}
          style2={styling.FreeTrialText}
          />
        <MyButton
          title="Customized"
          onPress={() => router.push('/CustomizedWorkout')}
          style1={styling.FullWidthbutton}
          style2={styling.FullwidthbtnText}
          />
      </View>
       </ImageBackground>
  )
}

export default Workoutplan