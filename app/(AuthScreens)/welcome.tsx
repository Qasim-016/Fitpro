import MyButton from "@/components/Buttons/MyButton";
import { Link, useRouter } from "expo-router";
import { Text, View,Image } from "react-native";
import LogoImgForScreen from "@/components/ScreenImages/LogoImgForScreen";
import Heading from "@/components/Text/Heading";
import styling from "@/assets/Styles/styling";
import LogoImg from "@/components/ScreenImages/LogoImgForScreen";
import Paragraph from "@/components/Text/Paragraph";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome() {
  const router = useRouter()
  const Back=()=>{
    router.back()
  }
  const GotoLogin=()=>{
    router.navigate("/login")
  }
  const GotoSignup=()=>{
    router.navigate("/signup")
  }
  return (
    <SafeAreaView
      style={styling.WelcomeContainer}
    >
      <View style={styling.Backbtn}>
      <MyButton title={<LogoImgForScreen path={require('@/assets/images/weui_back-filled.png')} styles={styling.NextBackbtnimage}/>} onPress={Back} style1={styling.button} style2={styling.NextBackbtntext}/>
      <Heading title={'Welcome'} styles={styling.HeaderText}/>
      </View>
    <View 
    style={styling.Welcomesubcontainer}>
    <LogoImg path={require("@/assets/images/welcome.png")} styles={styling.loginimg}/>
    <Heading title={'Welcome to FitPro'} styles={styling.Heading}/>
      <Paragraph paragraph={"Welcome to your fitness journey!\n Our gym app is your perfect companion\n to track progress, train effectively,\n and transform your body." } styles={styling.Paragraph}/>
      <MyButton title={"Login"} onPress={GotoLogin} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText}/>
      <MyButton title={"Create Account"} onPress={GotoSignup} style1={styling.FullwidthWhitebtn} style2={styling.whitebtntext}/>
     </View>
    </SafeAreaView>
  );
}


