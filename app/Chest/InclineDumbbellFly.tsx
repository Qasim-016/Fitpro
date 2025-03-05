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

const InclineDumbbellFly = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Incline Dumbbell Fly" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Chest/DB_INC_FLY.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>    
            <View style={styling.BenchPresssubview}>
                <Heading title='Incline Dumbbell Fly' styles={styling.Heading}/>
                <Heading title='Description' styles={styling.workoutheadingsdescriptions}/>
                <Paragraph paragraph='The incline dumbbell fly is an isolation exercise performed on an inclined bench, where you lower and raise dumbbells in a wide arc. It primarily targets the upper chest and shoulders while improving muscle definition.' styles={styling.Paragraph}/>
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions}/>
                <Paragraph paragraph=' Enhances upper chest development and improves muscle flexibility.Strengthens stabilizing muscles and promotes better chest definition.' styles={styling.Paragraph}/>
            </View>
            </View>
    )
}

export default InclineDumbbellFly;