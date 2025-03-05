import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const DeclineDumbbellFly = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="DeclineDumbbellFly" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Chest/DB_DEC_FLY.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>
            <View style={styling.BenchPresssubview}>
                <Heading title='DeclineDumbbellFly' styles={styling.Heading} />
                <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='The Decline Dumbbell Fly is a chest isolation exercise performed on a decline bench using dumbbells. It primarily targets the lower portion of the pectoral muscles, helping to build a well-rounded chest.' styles={styling.Paragraph} />
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Helps create a fuller and more defined chest.Stretches and strengthens pectorals, reducing injury risk.' styles={styling.Paragraph} />
            </View>   
             </View>
    )
}

export default DeclineDumbbellFly;