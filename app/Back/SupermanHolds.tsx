import { View, Text } from 'react-native'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import React from 'react'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const SupermanHolds = () => {
  return (
    <View>
      <View style={styling.Backbtn}>
        <MyButton
          title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
          onPress={() => router.back()}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Superman Holds" styles={styling.HeaderText} />
      </View>

      <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
        <Image
          source={require('@/assets/images/Back/Superman.gif')}
          style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
        />
      </View>
      <View style={styling.BenchPresssubview}>
        <Heading title='Superman Holds' styles={styling.Heading} />
        <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
        <Paragraph paragraph='The Superman Hold is a bodyweight exercise where you lie face down and lift your arms, chest, and legs off the ground, holding the position to engage the lower back, glutes, and core.' styles={styling.Paragraph} />
        <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
        <Paragraph paragraph='Helps improve posture and spinal stability.Supports lower body strength and injury prevention.' styles={styling.Paragraph} />
      </View>
    </View>
  )
}

export default SupermanHolds;