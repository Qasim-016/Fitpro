import { View, Text ,Image} from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import MyButton from '@/components/Buttons/MyButton'
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
import styling from '@/assets/Styles/styling'
import Heading from '@/components/Text/Heading'
import Paragraph from '@/components/Text/Paragraph'
import { SafeAreaView } from 'react-native-safe-area-context'

const intro3 = () => {
    const router = useRouter()
  const Back=()=>{
    router.back()
  }
  const Next=()=>{
    router.push("/welcome")
  }
    return (
        <SafeAreaView style={styling.intro3container}>
            <View style={styling.Backbtn}>
            <MyButton title={<LogoImgForScreen path={require('@/assets/images/nextback/back.png')} styles={styling.NextBackbtnimage}/>} onPress={Back} style1={styling.button} style2={styling.NextBackbtntext}/>
      </View>
            
            <Image source={require('@/assets/images/intro/Workout-rafiki 1.png')} />
            <Heading title={'Scheduling Made Easy'} styles={styling.Heading}/>
            <Paragraph paragraph={'Effortlessly manage classes, personal training sessions, and appointments with our scheduling features. Members can book and manage their own sessions, reducing administrative tasks for your staff.'} styles={styling.Paragraph}/>
            <View style={styling.DotsContainer}>
            <Paragraph paragraph={'•'} styles={styling.SimpleDot}/>
      <Paragraph paragraph={'•'} styles={styling.SimpleDot}/>
      <Paragraph paragraph={'•'} styles={styling.MarkDot}/>
            </View>
            <View style={styling.Nextbtn}>
            <MyButton title={<LogoImgForScreen path={require('@/assets/images/nextback/next.png')} styles={styling.NextBackbtnimage}/>} onPress={Next} style1={styling.Nextbutton} style2={styling.NextBackbtntext}/>
      </View>
        </SafeAreaView>

    
  )
}

export default intro3
