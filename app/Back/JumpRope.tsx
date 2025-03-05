import { View, Text } from 'react-native'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import React from 'react'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const JumpRope = () => {
  return (
    <View>
      <View style={styling.Backbtn}>
        <MyButton
          title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
          onPress={() => router.back()}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Jump Rope" styles={styling.HeaderText} />
      </View>

      <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
        <Image
          source={require('@/assets/images/Back/Jump-Rope.gif')}
          style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
        />
      </View>
      <View style={styling.BenchPresssubview}>
        <Heading title='Jump Rope' styles={styling.Heading} />
        <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
        <Paragraph paragraph='Jump rope is a high-intensity cardio exercise that involves continuously jumping over a rotating rope, improving coordination, endurance, and agility.' styles={styling.Paragraph} />
        <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
        <Paragraph paragraph='Effective for fat loss and cardiovascular fitness.Enhances footwork, balance, and reaction time.' styles={styling.Paragraph} />
      </View>
    </View>
  )
}

export default JumpRope;