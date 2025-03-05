import { View, Text } from 'react-native'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import React from 'react'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const MountainClimbers = () => {
  return (
    <View>
      <View style={styling.Backbtn}>
        <MyButton
          title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
          onPress={() => router.back()}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Mountain Climbers" styles={styling.HeaderText} />
      </View>

      <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
        <Image
          source={require('@/assets/images/Back/Mountain-climber.gif')}
          style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
        />
      </View>
      <View style={styling.BenchPresssubview}>
        <Heading title='Mountain Climbers' styles={styling.Heading} />
        <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
        <Paragraph paragraph='Mountain climbers are a high-intensity, full-body exercise that involves bringing the knees toward the chest in a running motion while in a plank position.' styles={styling.Paragraph} />
        <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
        <Paragraph paragraph='Great for fat loss, endurance, and heart health.Engages abs, obliques, and hip flexors for better stability.' styles={styling.Paragraph} />
      </View>
    </View>
  )
}

export default MountainClimbers;