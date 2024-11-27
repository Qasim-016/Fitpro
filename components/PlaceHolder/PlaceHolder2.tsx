import React from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styling from '@/assets/Styles/styling';

interface PlaceHolderProps extends TextInputProps {
    placeholderText: string; // Changed to a more standard naming for clarity
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    iconName?: string;
    showPassword?: boolean;
    onTogglePassword?: () => void;
}

const PlaceHolder2: React.FC<PlaceHolderProps> = ({
    placeholderText,
    value,
    onChangeText,
    secureTextEntry,
    iconName,
    showPassword,
    onTogglePassword
}) => {
    return (
        <View style={styling.inputContainer}>
            <TextInput
                placeholder={placeholderText} // Changed prop name here
                value={value}
                onChangeText={onChangeText}
                style={styling.chatInput}
                secureTextEntry={secureTextEntry}
            />
            {iconName && (
                <MaterialIcons name={iconName} size={20} color="#888" style={styling.icon} />
            )}
            {onTogglePassword && (
                <TouchableOpacity onPress={onTogglePassword} style={styling.none}>
                    <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="#888" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default PlaceHolder2;
