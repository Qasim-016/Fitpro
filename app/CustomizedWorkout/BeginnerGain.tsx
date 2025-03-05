import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Href } from 'expo-router'; // Import Href type

import Heading from '@/components/Text/Heading';
import MyButton from '@/components/Buttons/MyButton';

import styling from '@/assets/Styles/styling';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import { router } from 'expo-router';
import Video from 'react-native-video'; // Import video player
import Paragraph from '@/components/Text/Paragraph';
import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const currentDayIndex = new Date().getDay();
const currentDay = days[currentDayIndex === 0 ? 6 : currentDayIndex - 1]; // Adjust for Sunday (0) being last

type WorkoutPlan = {
  title: string;
  workouts: { id: number; name: string; sets: string; image: any }[];
};
const workoutPlans: Record<string, WorkoutPlan> = {
  Mon: { title: '"Train your chest like\n a champion; the results\n will speak for themselves."\n 🏆', workouts: [{ id: 1, name: 'Flat Dumbbell Press', sets: '3 sets x 12-15', image: require('@/assets/images/Chest/Dumbbell-Press.gif')},
    { id: 2, name: 'Incline Dumbbell Press', sets: '3 sets x 12-15', image: require('@/assets/images/Chest/Incline-Dumbbell-Press.gif')},
    { id: 3, name: 'Incline Dumbbell Flys', sets: '3 sets x 12-15', image: require('@/assets/images/Chest/DB_INC_FLY.gif')},
    { id: 4, name: 'Push-Ups', sets: '3 sets x 15-20', image: require('@/assets/images/Chest/Push-Up.gif')},
    { id: 5, name: 'Cable Crossovers\n(Light Weight)', sets: '3 sets x 12-15', image: require('@/assets/images/Chest/CROSS_OVER.gif')},
  ] },
  Tue: { title: '"Your back carries you\n through life—train it\n like it matters!" 🏋️‍♂️', workouts: [{ id: 7, name: 'Lat Pull Down', sets: '3 sets x 10-12', image: require('@/assets/images/Back/Lat-Pulldown.gif') },
    { id: 8, name: 'Dumbbell Bent-over\nRows', sets: '3 sets x 10-12', image: require('@/assets/images/Back/DB_LOW.gif') },
    { id: 9, name: 'Seated Cable Row', sets: '3 sets x 12-15', image: require('@/assets/images/Back/seatedcablerow.gif') },
    { id: 10, name: 'Face Pulls', sets: '3 sets x 12-15', image: require('@/assets/images/Back/Cross-Cable-Face-Pull.gif') },
    { id: 11, name: 'Hyperextensions\n(Bodyweight)', sets: '3 sets x 15-20', image: require('@/assets/images/Back/HPET.gif') },
  ] },
  Wed: { title: '"Strong shoulders carry the\n weight of success!" 🏋️‍♂️', workouts: [{ id: 13, name: 'Seated Dumbbell\nShoulder Press', sets: '3 sets x 10-12', image: require('@/assets/images/Shoulder/SEAT_DB_SHD_PRESS.gif') },
    { id: 14, name: 'Front Raises\n(Dumbbell)', sets: '3 sets x 10-12', image: require('@/assets/images/Shoulder/Front-Raises.gif') },
    { id: 15, name: 'Dumbbell Lateral\nRaises', sets: '3 sets x 8-10', image: require('@/assets/images/Shoulder/Dumbbell-Lateral-Raise.gif') },
    { id: 16, name: 'Face Pulls (Cable)', sets: '3 sets x 8-10', image: require('@/assets/images/Shoulder/FACE_PULL.gif') },
    { id: 17, name: 'Reverse Pec\nDec Machine', sets: '3 sets x 10-12', image: require('@/assets/images/Shoulder/seated-reverse-fly.gif') },
    { id: 18, name: 'Barbell Shrugs', sets: '3 sets x 10-12', image: require('@/assets/images/Shoulder/BB_SHRUG.gif') },
    
  ] },
  Thu: { title: '"Biceps for the flex, \ntriceps for the checks!"\n 💵💪', workouts: [{ id: 19, name: 'Biceps Curl', sets: '3 sets x 10-12', image: require('@/assets/images/Biceps&&Triceps/BarbellCurl.gif') },
    { id: 20, name: 'Hammer Curl', sets: '3 sets x 10-12', image: require('@/assets/images/Biceps&&Triceps/Hammer-Curl.gif') },
    { id: 21, name: 'Concentration Curls', sets: '3 sets x 10-12', image: require('@/assets/images/Biceps&&Triceps/Concentration-Curl.gif') },
    { id: 23, name: 'Tricep Dips (Bench)', sets: '3 sets x 10-12', image: require('@/assets/images/Biceps&&Triceps/BENCH_DIPS.gif') },
    { id: 26, name: 'Rope Tricep Pushdowns', sets: '3 sets x 10-12', image: require('@/assets/images/Biceps&&Triceps/Rope-Pushdown.gif') },
    { id: 27, name: 'Dumbbell Overhead\nExtensions', sets: '3 sets x 10-12', image: require('@/assets/images/Biceps&&Triceps/DB_TRI_EXT.gif') }
  ] },
  Fri: { title: '"Power starts from the\n hands—never skip forearms!"\n 💯握', workouts: [{ id: 28, name: 'Barbell Wrist Curls', sets: '3 sets x 12-15', image: require('@/assets/images/Forearm/barbell-wrist-curl.gif') },
    { id: 29, name: 'Reverse Wrist Curls', sets: '3 sets x 12-15', image: require('@/assets/images/Forearm/REV_DB_WRIST_CURL.gif') },
    { id: 31, name: 'Hammer Curls\n(for Brachioradialis)', sets: '3 sets x 10-12', image: require('@/assets/images/Biceps&&Triceps/Hammer-Curl.gif') }
  ] },
  Sat: { title: '"Your body won’t go \nwhere your legs can’t\n take you!" 🚀💥', workouts: [{ id:31, name: 'Dumbbell Squats', sets: '3 sets x 10-12', image: require('@/assets/images/Legs/Dumbbell-Squat.gif') },
    { id:32, name: 'Leg Press (Machine)', sets: '3 sets x 12-15', image: require('@/assets/images/Legs/LEG_PRESS.gif') },
    { id:33, name: 'Lunges (Dumbbell)', sets: '3 sets x 10-12per leg', image: require('@/assets/images/Legs/dumbbell-lunges.gif') },
    { id:34, name: 'Romanian Deadlifts\n(Dumbbell)', sets: '3 sets x 10-12', image: require('@/assets/images/Legs/DB_RM_DL.gif') },
    { id:35, name: 'Seated Calf Raises', sets: '3 sets x 15-20', image: require('@/assets/images/Legs/Lever-Seated-Calf-Raise.gif') },
    { id:36, name: 'Standing Calf Raises', sets: '3 sets x 15-20', image: require('@/assets/images/Legs/STD_CALF_RAISE.gif') }
  ] },
  Sun: { title: 'Rest Day', workouts: [] },
};

const BeginnerGain = () => {
  const [selectedDay, setSelectedDay] = useState<keyof typeof workoutPlans>(currentDay);
  const currentWorkout = workoutPlans[selectedDay];

  return (
    <View style={styling.workoutnormalcontainer}>
      {/* Navbar with Back Button */}
      <View style={styling.navbar}>
        <MyButton 
          title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
          onPress={() => router.back()}
          style1={styling.button}
          style2={styling.NextBackbtntext} 
        />
        <Heading title="Workout Plan" styles={styling.HeaderText} />
        <View style={{position:'absolute',right:5,top:30}}>
        <MyButton
              title={
                <Dashboardscreenimage
                  path={require('@/assets/images/Profile/edit.png')}
                  styles={styling.dashboardbtnimages}
                // tintColor='#2ecc71'
                />
              }
              onPress={()=>router.navigate('/(User)/CustomizedWorkout')}
              style1={styling.button}
              style2={styling.NextBackbtntext}
            />
        </View>
      </View>

      {/* Day Selector */}
      <View style={styling.daySelector}>
        {days.map(day => (
          <TouchableOpacity 
            key={day} 
            onPress={() => setSelectedDay(day as keyof typeof workoutPlans)}
            style={[styling.dayButton, selectedDay === day && styling.selectedDay]}>
            <Text style={styling.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        <View style={styling.workoutCard}>
          <View style={styling.workoutRowContainer}> 
            <View style={styling.workoutDetailsContainer}>
              <Text style={styling.workoutTitle}>{selectedDay}</Text>
              <Text style={styling.workoutSubtitle2}>{currentWorkout.title}</Text>
              <View style={styling.buttonRow}>
                {selectedDay !== 'Sun' ? (
                  <></>
                ) : (
                  <Text style={styling.restDayQuote}>"Rest and recover, tomorrow is another challenge!"</Text>
                )}
              </View>
            </View>
            <LogoImgForScreen 
              path={require('@/assets/images/Chatbot/workoutimage.png')} 
              styles={styling.workoutImageRight} 
            />
          </View>
        </View>

        <Text style={styling.sectionTitle}>Workout</Text>
        {currentWorkout.workouts.length > 0 ? (
          currentWorkout.workouts.map((workout) => (
            <View key={workout.id} style={styling.workoutItem}>
              <Image source={workout.image} style={styling.workoutImage} />
              <View style={styling.workoutRow}>
                <View style={styling.workoutDetails}>
                  <Text style={styling.workoutName}>{workout.name}</Text>
                  <Text style={styling.workoutSets}>{workout.sets}</Text>
                </View>
                        <TouchableOpacity 
  style={styling.viewButton} 
  onPress={() => {
    const workoutRoutes: Record<string, Href> = {
      'Flat Dumbbell Press': '/Chest/DumbbellPress' as Href,
      'Incline Dumbbell Press': '/Chest/InclineDumbbellPress' as Href,
      'Incline Dumbbell Flys': '/Chest/InclineDumbbellFly' as Href,
      'Push-Ups': '/Chest/PushUps' as Href,
      'Cable Crossovers\n(Light Weight)': '/Chest/CableCrossover' as Href,
      'Low Cable Crossover': '/Chest/LowCableCrossover' as Href,
      'Lat Pull Down': '/Back/LatPullDown' as Href,
      'Dumbbell Bent-over\nRows': '/Back/DumbbellBentOverRow' as Href,
      'Seated Cable Row': '/Back/SeatedCableRow' as Href,
      'Face Pulls': '/Back/FacePulls' as Href,
      'Hyperextensions\n(Bodyweight)': '/Back/HyperextensionsBody' as Href,
      'Seated Dumbbell\nShoulder Press': '/Shoulder/DumbbellPress' as Href,
      'Front Raises\n(Dumbbell)': '/Shoulder/FrontRaises' as Href,
      'Dumbbell Lateral\nRaises': '/Shoulder/LateralRaises' as Href,
      'Face Pulls (Cable)': '/Shoulder/FacePulls' as Href,
      'Reverse Pec\nDec Machine': '/Shoulder/ReversePecDecMachine' as Href,
      'Barbell Shrugs': '/Shoulder/BarbellShrugs' as Href,
      'Biceps Curl': '/Biceps/BarbellCurl' as Href,
      'Hammer Curl': '/Biceps/HammerCurl' as Href,
      'Concentration Curls': '/Biceps/ConcentrationCurls' as Href,
      'Tricep Dips (Bench)': '/Biceps/TricepDips' as Href,
      'Rope Tricep Pushdowns': '/Biceps/RopePushdowns' as Href,
      'Dumbbell Overhead\nExtensions': '/Biceps/OverheadTricepsExtension' as Href,
      'Barbell Wrist Curls': '/Forearm/Barbellwristcurls' as Href,
      'Reverse Wrist Curls': '/Forearm/ReverseDbWristCurls' as Href,
      'Hammer Curls\n(for Brachioradialis)': '/Biceps/HammerCurl' as Href,
      'Dumbbell Squats': '/Legs/DumbbellSquats' as Href,
      'Leg Press (Machine)': '/Legs/LegPress' as Href,
      'Lunges (Dumbbell)': '/Legs/Lunges' as Href,
      'Romanian Deadlifts\n(Dumbbell)': '/Legs/RmDeadliftsDumbbell' as Href,
      'Seated Calf Raises': '/Legs/CalfRaises' as Href,
      'Standing Calf Raises': '/Legs/StandingCalfRaises' as Href,
    };

    const route = workoutRoutes[workout.name]; // Get route for selected workout
    if (route) {
      router.push(route);
    } else {
      console.warn('No route found for:', workout.name); // Debugging message if route is missing
    }
  }}
>
  <Text style={styling.viewButtonText}>View</Text>
</TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styling.restDayMessage}>No workout today! Enjoy your rest. 💪</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default BeginnerGain;
