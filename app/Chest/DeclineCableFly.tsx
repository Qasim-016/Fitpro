import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const DeclineCableFly = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Decline Cable Fly" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Chest/Decline-Cable-Fly.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>
            <View style={styling.BenchPresssubview}>
                <Heading title='Decline Cable Fly' styles={styling.Heading} />
                <Heading title='Description' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='The Decline Cable Fly is a chest isolation exercise performed using a cable machine with a decline angle. It specifically targets the lower portion of the pectoral muscles, helping to enhance lower chest development and definition.' styles={styling.Paragraph} />
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions} />
                <Paragraph paragraph='Targets the lower pectorals for better chest shape.Cables keep tension on the chest throughout the movement, maximizing muscle activation.' styles={styling.Paragraph} />
            </View>
        </View>
    )
}

export default DeclineCableFly