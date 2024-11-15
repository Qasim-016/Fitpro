import { View, Text } from 'react-native'
import React from 'react'

const Paragraph = ({paragraph,styles}) => {
  return (
    <View>
      <Text style = {styles}>{paragraph}</Text>
    </View>
  )
}

export default Paragraph