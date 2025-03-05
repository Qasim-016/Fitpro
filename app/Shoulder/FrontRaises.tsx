import { View, Text } from 'react-native'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import React from 'react'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'


const FrontRaises = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="FrontRaises" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Shoulder/Front-Raises.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>
            <View style={styling.BenchPresssubview}>
                <Heading title='FrontRaises' styles={styling.Heading} />
                <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Front raises are an isolation exercise where you lift dumbbells, a barbell, or a cable from thigh level to shoulder height while keeping your arms straight. This movement primarily targets the anterior (front) deltoids.' styles={styling.Paragraph} />
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Builds front shoulder strength and enhances muscle definition.Improves shoulder stability and assists in overhead pressing movements.' styles={styling.Paragraph} />
            </View>
        </View>
    )
}

export default FrontRaises