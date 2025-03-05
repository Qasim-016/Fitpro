import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const DeclinePushUps = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Decline Push Ups" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Chest/Decline-PushUps.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>    
            <View style={styling.BenchPresssubview}>
                <Heading title='Decline Push Ups' styles={styling.Heading}/>
                <Heading title='Description' styles={styling.workoutheadingsdescriptions}/>
                <Paragraph paragraph='ecline push-ups are a variation of the traditional push-up where your feet are elevated on a platform, such as a bench, step, or sturdy surface. This positioning shifts more of your body weight onto your upper body, particularly targeting the upper chest and shoulders.' styles={styling.Paragraph}/>
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions}/>
                <Paragraph paragraph='Emphasizes the upper portion of the pectoral muscles and the anterior deltoids.Builds strength in the chest, shoulders, and triceps, helping improve overall pushing power.' styles={styling.Paragraph}/>
            </View>
            </View>
    )
}

export default DeclinePushUps;