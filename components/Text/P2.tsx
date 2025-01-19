import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const P2 = ({ paragraph }: { paragraph: string }) => {
  const parts = paragraph.split(' '); // Split the paragraph into parts by spaces

  return (
    <View>
      {parts.map((word, index) => {
        // Apply green color to "Diet" and "Workout"
        if (word === 'Diet' || word === 'Workout') {
          return (
            <Text key={index} style={styles.greenText}>
              {word} 
            </Text>
          );
        }
        // Apply black color to all other words
        return (
          <Text key={index} style={styles.blackText}>
            {word} 
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  greenText: {
    color: 'green',
  },
  blackText: {
    color: 'black',
  },
});
export default P2