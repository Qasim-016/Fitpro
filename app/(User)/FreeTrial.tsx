import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import styling from '@/assets/Styles/styling'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'
import { useRouter } from 'expo-router'
import MyButton from '@/components/Buttons/MyButton'
import { Dimensions } from 'react-native'

const FreeTrial = () => {
  const router = useRouter()
  const Next=()=>{
    router.push("/Dashboard")
  }
  const { height } = Dimensions.get('screen');
  const { width } = Dimensions.get('screen');

  return (
    

    <ImageBackground source={require('@/assets/User/free-trial.jpg')} style={[{width},{height}]} resizeMode='cover'>

    <View style={[styling.container,styling.Gap]}>
      



      <Heading title={'Welcome to FitPro'} styles={styling.whitetextheading}/>
      <Paragraph paragraph={'Welcome to FitPro! Your fitness journey starts here. Explore our workout library, book classes, track progress, and connect with like-minded individuals. Receive personalized coaching, expert advice, and dedicated support. Participate in challenges, earn rewards, and stay motivated.  body.'} styles={styling.whitetextparagraph}/>

  


    <MyButton title={'3 Days Free Trial'} onPress={Next} style1={styling.freetrialbtn} style2={styling.FreeTrialText}/>
     <MyButton title={'Get Premium'} onPress={Next} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText}/>
    </View>
      {/* <FreeTrialButton title={'3 Day Free Trial'} onPress={Next}/> */}
    
    
    </ImageBackground>
  )
}

export default FreeTrial