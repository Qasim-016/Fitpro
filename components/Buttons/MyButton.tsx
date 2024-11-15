import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import React from 'react';

interface MyButtonProps {
  title: string | React.ReactNode; // Allows title to be either a string or a React element
  onPress: () => void; // Function with no parameters and no return value
  style1?: ViewStyle; // Optional View style
  style2?: TextStyle; // Optional Text style
}

const MyButton: React.FC<MyButtonProps> = ({ title, onPress, style1, style2 }) => {
  return (
    <View>
      <TouchableOpacity activeOpacity={0.8} style={style1} onPress={onPress}>
        <Text style={style2}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyButton;
