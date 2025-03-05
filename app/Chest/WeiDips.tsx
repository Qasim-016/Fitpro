import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import { router } from 'expo-router'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'

const WeiDips = () => {
    return (
        <View>
            <View style={styling.Backbtn}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Weighted Dips" styles={styling.HeaderText} />
            </View>

            <View style={[styling.bicepcurlview, { backgroundColor: 'transparent' }]}>
                <Image
                    source={require('@/assets/images/Chest/WEI_DIPS.gif')}
                    style={{ width: 300, height: 430, resizeMode: 'contain', backgroundColor: 'transparent' }}
                />
            </View>    
            <View style={styling.BenchPresssubview}>
                <Heading title='Weighted Dips' styles={styling.Heading}/>
                <Heading title='Description' styles={styling.workoutheadingsdescriptions}/>
                <Paragraph paragraph='Weighted dips are an advanced bodyweight exercise where extra weight (via a belt, dumbbell, or vest) is added while performing dips on parallel bars. This movement primarily targets the chest, triceps, and shoulders.' styles={styling.Paragraph}/>
                <Heading title='Benefits' styles={styling.workoutheadingsdescriptions}/>
                <Paragraph paragraph='Increases upper body strength, muscle mass, and endurance.Enhances pushing power and improves overall pressing movements.' styles={styling.Paragraph}/>
            </View>
            </View>
    )
}

export default WeiDips;