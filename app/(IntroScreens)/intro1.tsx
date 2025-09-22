import { View, Text, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import Heading from '@/components/Text/Heading'
import styling from '@/assets/Styles/styling'
import Paragraph from '@/components/Text/Paragraph'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { SafeAreaView } from 'react-native-safe-area-context'

const intro1 = () => {
  const router = useRouter()
  const Back = () => {
    router.back()
  }
  const Next = () => {
    router.navigate('/intro2')
  }
  return (
    <SafeAreaView style={styling.intro1container}>
      {/* <View style={styling.Backbtn}>
        <MyButton title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />} onPress={Back} style1={styling.button} style2={styling.NextBackbtntext} />
      </View> */}
      <Image source={require("@/assets/images/intro/Gym-amico 1.png")} />
      <Heading title={'Member Management'} styles={styling.Heading} />
      <Paragraph paragraph={'Streamline member relationships with our intuitive management tools. Easily view member profiles, track attendence, and access payment history.'} styles={styling.Paragraph} />
      <View style={styling.DotsContainer}>
        <Paragraph paragraph={'•'} styles={styling.MarkDot
        } />
        <Paragraph paragraph={'•'} styles={styling.SimpleDot} />
        <Paragraph paragraph={'•'} styles={styling.SimpleDot} />
      </View>
      <View style={styling.Nextbtn}>

        <MyButton title={<LogoImgForScreen path={require('@/assets/images/nextback/next.png')} styles={styling.NextBackbtnimage} />} onPress={Next} style1={styling.Nextbutton} style2={styling.none} />
      </View>

    </SafeAreaView>
  )
}

export default intro1

