import { View, Text } from 'react-native'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import React from 'react'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const SingleArmDumbbellRows = () => {
  return (
    <View>
      <View style={styling.Backbtn}>
        <MyButton
          title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
          onPress={() => router.back()}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Dumbbell Rows" styles={styling.HeaderText} />
      </View>

      <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
        <Image
          source={require('@/assets/images/Back/OA_DB_ROW.gif')}
          style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
        />
      </View>
      <View style={styling.BenchPresssubview}>
        <Heading title='Single Arm Dumbbell Rows' styles={styling.Heading} />
        <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
        <Paragraph paragraph='TThe Single-Arm Dumbbell Row is a compound back exercise performed by pulling a dumbbell in a rowing motion while supporting the body with the opposite hand.' styles={styling.Paragraph} />
        <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
        <Paragraph paragraph='Helps fix muscle imbalances by working each side independently.Engages core muscles and forearms for better stability and endurance.' styles={styling.Paragraph} />
      </View>
    </View>
  )
}

export default SingleArmDumbbellRows;