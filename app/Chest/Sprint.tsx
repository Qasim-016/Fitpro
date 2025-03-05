import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const Sprint = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Sprint" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Chest/sprint.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>    
            <View style={styling.BenchPresssubview}>
                <Heading title='Sprint' styles={styling.Heading}/>
                <Heading title='Description' styles={styling.workoutheadingsdescriptions}/>
                <Paragraph paragraph='Sprinting is a high-intensity running exercise performed at maximum speed for a short distance. It primarily targets the legs, glutes, and core while improving cardiovascular fitness and explosive power.' styles={styling.Paragraph}/>
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions}/>
                <Paragraph paragraph='Builds speed, endurance, and lower body strength.Boosts metabolism, burns fat, and enhances athletic performance.' styles={styling.Paragraph}/>
            </View>
            </View>
    )
}

export default Sprint;