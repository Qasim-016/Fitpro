import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'

const Heading = ({title,styles}) => {
  return (
    <View>
      <Text style={styles}>{title}</Text>
    </View>
  )
}

export default Heading

const style = StyleSheet.create({
    T1:{fontSize:30,fontWeight:'bold'
    }
})