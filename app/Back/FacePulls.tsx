import { View, Text } from 'react-native'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import React from 'react'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const FacePulls = () => {
  return (
    <View>
      <View style={styling.Backbtn}>
        <MyButton
          title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
          onPress={() => router.back()}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Face Pull" styles={styling.HeaderText} />
      </View>

      <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
        <Image
          source={require('@/assets/images/Back/Cross-Cable-Face-Pull.gif')}
          style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
        />
      </View>
      <View style={styling.BenchPresssubview}>
        <Heading title='Face Pull' styles={styling.Heading} />
        <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
        <Paragraph paragraph='The Face Pull is an essential shoulder and upper back exercise performed using a cable machine with a rope attachment.' styles={styling.Paragraph} />
        <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
        <Paragraph paragraph='Improves shoulder stability and balances shoulder development.Helps fix rounded shoulders by strengthening postural muscles.' styles={styling.Paragraph} />
      </View>
    </View>
  )
}

export default FacePulls;