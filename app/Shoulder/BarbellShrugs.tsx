import { View, Text } from 'react-native'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import React from 'react'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const BarbellShrugs = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Barbell Shrugs" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Shoulder/BB_SHRUG.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>
            <View style={styling.BenchPresssubview}>
                <Heading title='Barbell Shrugs' styles={styling.Heading} />
                <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Barbell shrugs are a trap-focused exercise where you grip a barbell in front of your body and lift your shoulders toward your ears. This movement primarily targets the upper trapezius muscles, improving neck and upper back strength.' styles={styling.Paragraph} />
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Builds upper trap size, strength, and definition.Enhances posture, grip strength, and shoulder stability.' styles={styling.Paragraph} />
            </View>
        </View>
    )
}

export default BarbellShrugs;