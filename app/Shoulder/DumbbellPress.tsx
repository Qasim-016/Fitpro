import { View, Text } from 'react-native'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import React from 'react'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const DumbbellPress = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Dumbbell Press" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Shoulder/SEAT_DB_SHD_PRESS.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>
            <View style={styling.BenchPresssubview}>
                <Heading title='Dumbbell Press' styles={styling.Heading} />
                <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='The shoulder dumbbell press is a strength exercise where you press dumbbells overhead from shoulder level while seated or standing. It primarily targets the deltoid muscles, along with the triceps and upper chest.' styles={styling.Paragraph} />
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Builds shoulder strength, size, and stability.Enhances overhead pressing power and improves upper body endurance.' styles={styling.Paragraph} />
            </View>
        </View>
    )
}

export default DumbbellPress