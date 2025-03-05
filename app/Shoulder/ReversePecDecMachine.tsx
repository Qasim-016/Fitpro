import { View, Text } from 'react-native'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import React from 'react'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const ReversePecDecMachine = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Pec Dec" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Shoulder/seated-reverse-fly.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>
            <View style={styling.BenchPresssubview}>
                <Heading title='ReversePecDecMachine' styles={styling.Heading} />
                <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='The reverse pec deck machine is an isolation exercise where you sit facing the machine and pull the handles outward, squeezing your shoulder blades together. It primarily targets the rear delts, traps, and upper back muscles.' styles={styling.Paragraph} />
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Strengthens rear delts, improving shoulder balance and posture.Enhances upper back definition and reduces the risk of shoulder injuries.' styles={styling.Paragraph} />
            </View>
        </View>
    )
}

export default ReversePecDecMachine