import { View, Text } from 'react-native'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import React from 'react'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const SpiderCurls = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Spider Curls" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Biceps&&Triceps/spider-curls.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>
            <View style={styling.BenchPresssubview}>
                <Heading title='Spider Curls' styles={styling.Heading} />
                <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Spider Curls are a bicep isolation exercise performed while lying chest-down on an inclined bench, allowing for a strict range of motion. This variation targets the short head of the biceps, maximizing muscle contraction and peak development.' styles={styling.Paragraph} />
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Provides full contraction for better arm shape.Ensures strict form, preventing cheating and improving muscle activation.' styles={styling.Paragraph} />
            </View>
        </View>
    )
}

export default SpiderCurls;