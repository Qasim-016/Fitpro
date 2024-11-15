
import { View, Text, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import Heading from '@/components/Text/Heading'
import styling from '@/assets/Styles/styling'
import LogoImg from '@/components/ScreenImages/LogoImgForScreen'
import { SafeAreaView } from 'react-native-safe-area-context'

const Index = () => {
  const router = useRouter()
  const welcome=()=>{
    router.push('/intro1')
  }
  const loading_timeout=()=>{
    setloading(true)
    setTimeout(welcome,1000)
  }
  const [loading, setloading] = useState(true)
  useEffect(()=>{
    setTimeout(loading_timeout,1000)
  },[])
  return (
    <SafeAreaView style={styling.container}>
      <LogoImg path={require("@/assets/images/splash.png")} styles={styling.Indeximg}/>
      <View style={styling.IndexView}>
        {loading?(
          <><ActivityIndicator  size={50} color={'#2ecc71'}/>
          <Heading title={'Loading...'} styles={styling.TextwithColor}/>
          </>
        ):(<><Text></Text></>)}
      </View>
    </SafeAreaView>
  )
}

export default Index

