import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const KneePushups = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Knee Push Ups" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Chest/knee-push-ups.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>
            <View style={styling.BenchPresssubview}>
                <Heading title='Knee Push Ups' styles={styling.Heading} />
                <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Knee push-ups are a beginner-friendly variation of standard push-ups, performed with knees on the ground to reduce resistance. They primarily target the chest, shoulders, and triceps while engaging the core.' styles={styling.Paragraph} />
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Builds upper body strength and endurance, making it ideal for beginners.Improves push-up form and gradually prepares for standard push-ups.' styles={styling.Paragraph} />
            </View>   
             </View>
    )
}

export default KneePushups;