import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { TextStyle } from 'react-native'
interface HeadingProps {
  title: string; // Define paragraph as a string
  styles?: TextStyle; // Define styles as TextStyle, making it optional
}
const Heading: React.FC<HeadingProps> = ({ title, styles }) => {
  return (
    <View>
      <Text style={styles}>{title}</Text>
    </View>
  )
}

export default Heading



// Heading.tsx (or wherever it's defined)
