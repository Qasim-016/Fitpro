import { View, Text, Image } from 'react-native'
import React from 'react'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'

import { useRouter } from 'expo-router'
import styling from '@/assets/Styles/styling'
import LogoImg from '@/components/ScreenImages/LogoImgForScreen'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'
import { SafeAreaView } from 'react-native-safe-area-context'

const Intro2 = () => {
  const router = useRouter()
  const Back = () => {
    router.back()
  }
  const Next = () => {
    router.push("/intro3")
  }
  return (
    <SafeAreaView style={styling.intro2container}>
      <View style={styling.Backbtn}>
        <MyButton title={<LogoImgForScreen path={require('@/assets/images/nextback/back.png')} styles={styling.NextBackbtnimage} />} onPress={Back} style1={styling.button} style2={styling.NextBackbtntext} />
      </View>

      <Image source={require('@/assets/images/intro/Gym-bro 1.png')} />
      <Heading title={'Seamless Payments and Billing'} styles={styling.Headinglong} />
      <Paragraph paragraph={'Automate billing, process secure payments, and generate professional invoices with our integrated payment gateway. Reduce errors, save time, and enhance the member experience.'} styles={styling.Paragraph} />
      <View style={styling.DotsContainer}>
        <Paragraph paragraph={'•'} styles={styling.SimpleDot} />
        <Paragraph paragraph={'•'} styles={styling.MarkDot} />
        <Paragraph paragraph={'•'} styles={styling.SimpleDot} />
      </View>
      <View style={styling.Nextbtn}>
        <MyButton title={<LogoImgForScreen path={require('@/assets/images/nextback/next.png')} styles={styling.NextBackbtnimage} />} onPress={Next} style1={styling.Nextbutton} style2={styling.NextBackbtntext} />
      </View>
    </SafeAreaView>

  )
}

export default Intro2

