import { View, Image, ImageStyle } from 'react-native';
import React from 'react';

interface Dashboardscreenimage {
  path: any; // The image path, typically an import or URI
  styles: ImageStyle; // The style of the image
  tintColor?: string; // Optional tintColor prop for changing image tint
}

const Dashboardscreenimage: React.FC<Dashboardscreenimage> = ({ path, styles, tintColor }) => {
  return (
    <View>
      <Image source={path} style={[styles, tintColor ? { tintColor } : null]} />
    </View>
  );
};

export default Dashboardscreenimage;
