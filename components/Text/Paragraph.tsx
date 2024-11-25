import { View, Text, TextStyle } from 'react-native';
import React from 'react';

// Define prop types for the Paragraph component
interface ParagraphProps {
  paragraph: string; // Define paragraph as a string
  styles?: TextStyle; // Define styles as TextStyle, making it optional
}

const Paragraph: React.FC<ParagraphProps> = ({ paragraph, styles }) => {
  return (
    <View>
      <Text style={styles}>{paragraph}</Text>
    </View>
  );
};

export default Paragraph;
