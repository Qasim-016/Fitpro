import { View, Image, ImageStyle } from 'react-native';
import React from 'react';

interface LogoImgForScreenProps {
  path: any; // The image path, typically an import or URI
  styles: ImageStyle; // The style of the image
}

const LogoImgForScreen: React.FC<LogoImgForScreenProps> = ({ path, styles }) => {
  return (
    <View>
      <Image source={path}  style={styles}/>
    </View>
  );
};

export default LogoImgForScreen;
