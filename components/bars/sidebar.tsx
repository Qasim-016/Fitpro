import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import styling from '@/assets/Styles/styling';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

interface SidebarProps {
    isVisible: boolean; // Whether the sidebar is visible
    onClose: () => void;}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
    if (!isVisible) return null;
    const { height } = Dimensions.get('screen');

    return (
      <SafeAreaView style={[styling.sidebarContainer,{height}]}>
        <TouchableOpacity onPress={onClose} style={styling.closeButton}>
          <Text style={styling.closeText}>X</Text>
        </TouchableOpacity>
        <View style={styling.sidebarHeader}>
            <Text>hey, welcome</Text>
        </View>
      </SafeAreaView>
    );
  };

  export default Sidebar;