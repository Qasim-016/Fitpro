import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import styling from '@/assets/Styles/styling';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import MyButton from '../Buttons/MyButton';
import LogoImgForScreen from '../ScreenImages/LogoImgForScreen';
import Dashboardscreenimage from '../ScreenImages/Dashboardscreenimages';

interface SidebarProps {
    isVisible: boolean; // Whether the sidebar is visible
    onClose: () => void;}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
    if (!isVisible) return null;
    const { height } = Dimensions.get('screen');

    return (
      <SafeAreaView style={[styling.sidebarContainer,{height}]}>
        <View style={styling.closebuttonview}>
        {/* <TouchableOpacity onPress={onClose} style={styling.closeButton}> */}
          {/* <Text style={styling.closeText}><MyButton title={}/></Text> */}
          <MyButton title={<Dashboardscreenimage path={require('@/assets/images/dashboard/closebtn.png')} styles={styling.backbtnimagenavbar} tintColor='white'/>} onPress={onClose} style1={styling.closeButton} style2={styling.closeText}/>
        {/* </TouchableOpacity> */}
        </View>
        
        <View style={styling.sidebarHeader}>
            <Text>hey, welcome</Text>
        </View>
      </SafeAreaView>
    );
  };

  export default Sidebar;



