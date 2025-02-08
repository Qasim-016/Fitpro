import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import MyButton from '@/components/Buttons/MyButton';
import styling from '@/assets/Styles/styling';
import { router } from 'expo-router';
import axios from 'axios'; // Import axios to make the API request
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Heading from '@/components/Text/Heading';
// import Paragraph from '@/components/Text/Paragraph';

const Paragraph = ({ paragraph }: { paragraph: string }) => {
    const parts = paragraph.split(' '); // Split the paragraph into parts by spaces
  
    return (
      <View style={styles.paragraphContainer}>
        {parts.map((word, index) => {
          // Apply green color to "Diet" and "Workout"
          if (word === 'Diet' || word === 'Workout' || word === 'plan?') {
            return (
              <Text key={index} style={styles.greenText}>
                {word}{' '}
              </Text>
            );
          }
          // Apply black color to all other words
          return (
            <Text key={index} style={styles.blackText}>
              {word}{' '}
            </Text>
          );
        })}
      </View>
    );
  };
  

  


// Define a type for each schedule item
interface GymScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
  status: string;
}

const GymScheduleScreen = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [isGymOpen, setIsGymOpen] = useState(false);
  const [gymSchedule, setGymSchedule] = useState<GymScheduleItem | null>(null); // Store only the current day's schedule
  const [error, setError] = useState<string | null>(null); // Store error messages

  // Fetch gym schedule from the backend
  const fetchGymSchedule = async () => {
    try {
      const response = await axios.get('http://192.168.0.114:5000/api/gym-schedule');
      const today = moment().format('dddd'); // Get current day (e.g., 'Monday')
      const todaySchedule = response.data.find((schedule: GymScheduleItem) => schedule.day === today);

      if (todaySchedule) {
        setGymSchedule(todaySchedule);
      } else {
        setGymSchedule(null); // No schedule found for today
        setError('No schedule found for today');
      }

      console.log(response.data); // Log the response to check the structure of the data
    } catch (error) {
      console.error('Error fetching gym schedule:', error);
      setError('Error fetching gym schedule');
    }
  };

  useEffect(() => {
    // Set the current date
    const date = moment().format('dddd, MMMM Do YYYY');
    setCurrentDate(date);

    // Set gym status based on time (e.g., open from 6:00 AM to 10:00 PM)
    const currentHour = moment().hour();
    setIsGymOpen(currentHour >= 6 && currentHour < 22);

    // Fetch gym schedule
    fetchGymSchedule();
  }, []); // Empty dependency array means this will run once after the component mounts

  return (
    <View style={styles.container}>
      <Text style={styling.featureheadingtiming}>{currentDate}</Text>
           {/* <Text style={styles.statusText}>
        {isGymOpen ? 'The gym is open!' : 'The gym is closed.'}
      </Text> */}

      {/* Display gym schedule for today */}
      <View style={styles.scheduleContainer}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : gymSchedule ? (
            <View style={styles.scheduleItem}>
            {/* <Text>{gymSchedule.startTime} - {gymSchedule.endTime}</Text> */}
              <Text style={styles.statusText}>{gymSchedule.status ? gymSchedule.status : 'No status available'}</Text>
            <View style={styles.timing}>
            <Heading title='From' styles={styling.featureheadingtiming}/>

            <View>

                        <MyButton title={gymSchedule.startTime ? gymSchedule.startTime : '-'} onPress={() => router} style1={styles.buton} style2={styles.btntext} />
            </View>
            <Heading title='to' styles={styling.featureheadingtiming}/>
            
            <View>

                        <MyButton title={gymSchedule.endTime ? gymSchedule.endTime : '-'} onPress={() => router} style1={styles.buton} style2={styles.btntext} />
            </View>
            </View>

          </View>
        ) : (
          <Text>Loading today's gym schedule...</Text>
        )}
      </View>

      <View style={styles.GymtimingbuttonContainer}>
        <Paragraph paragraph='Want to know about Workout and Diet plan?'/>
        {/* <Text>Want to know about Diet and Workout Plan?</Text> */}
        <MyButton title={'Diet Plan'} onPress={() => router.push('/(User)/Dietplan')} style1={styling.FullwidthWhitebtn} style2={styling.FreeTrialText} />
        <MyButton title={'Goto admin panel'} onPress={() => router.push('/Admin')} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
        <MyButton title={'Workout Plan'} onPress={() => router.push('/(User)/Workoutplan')} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },textview:{
    // flex:1,
    width:150,height:50,borderWidth:2,borderColor:'#2ecc71',textAlign:'center',color:'#333'
  },
  statusText: {
    fontSize: 18,
    color: '#2ecc71',
    marginBottom: 20,
  },
  scheduleContainer: {
    flex:1,justifyContent:'center',borderWidth:2,borderColor:'#2ecc71',marginBottom:10,paddingHorizontal:10,
    // marginBottom: 20,
    
  },buton:{
    width:80,borderWidth:2,borderColor:'#2ecc71',alignItems:'center',height:50,justifyContent:'center'
  },btntext:{
    color:'black',fontWeight:'bold',fontSize:16
  },
  scheduleItem: {
    marginBottom: 10,
    fontSize: 16,
    color: '#333'
  },timing:{
    flexDirection:'row',gap:10
  },
  GymtimingbuttonContainer: {
    marginBottom:150,
    flex:1,
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  }, greenText: {
    color: '#2ecc71',fontWeight:'bold',fontSize:16,
  },
  blackText: {
    color: 'black',fontSize:16,
  },paragraphContainer: {
    flexDirection: 'row', // Set to 'row' for horizontal text display
    flexWrap: 'wrap', // Allows wrapping in case text overflows
    alignItems: 'center',
    // marginBottom: 20,
  },
});

export default GymScheduleScreen;



