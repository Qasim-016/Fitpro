import { View, Text, TextStyle } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

interface PlaceHolderHeadingProps {
  title: string;
}

const PlaceHolderHeading: React.FC<PlaceHolderHeadingProps> = ({ title }) => {
  return (
    <View>
      <Text style={styles.SH}>{title}</Text>
    </View>
  );
};

export default PlaceHolderHeading;

const styles = StyleSheet.create({
  SH: {
    fontWeight: 'bold',
  } as TextStyle,
});
