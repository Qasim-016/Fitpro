import { View, Image, ImageStyle } from 'react-native';
import React from 'react';

interface FullScreenImageProps {
  path: any; // The image path, typically an import or URI
  styles: ImageStyle; // The style of the image
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({ path, styles }) => {
  return (
    <View>
      <Image source={path} style={styles} resizeMode='cover' />
    </View>
  );
};

export default FullScreenImage;
