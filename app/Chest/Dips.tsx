import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'
import InclineDumbbellCurl from '../Biceps/InclineDumbbellCurl'

const Dips = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Dips" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Chest/Dips.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>    
            <View style={styling.BenchPresssubview}>
                <Heading title='Dips' styles={styling.Heading}/>
                <Heading title='Description' styles={styling.workoutheadingsdescriptions}/>
                <Paragraph paragraph='Dips are a bodyweight exercise where you lower and lift your body using parallel bars or a sturdy surface, primarily targeting the triceps, chest, and shoulders. They can be done using parallel bars (for chest and triceps) or a bench (bench dips) for a triceps-focused variation.' styles={styling.Paragraph}/>
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions}/>
                <Paragraph paragraph='Builds upper body strength, focusing on triceps, chest, and shoulders.Enhances muscle endurance, improves pushing power, and requires no equipment for bench dips.' styles={styling.Paragraph}/>
            </View>
            </View>
    )
}

export default Dips;