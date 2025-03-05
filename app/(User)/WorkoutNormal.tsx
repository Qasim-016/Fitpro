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
  Mon: { title: '"Train your chest like\n a champion; the results\n will speak for themselves."\n 🏆', workouts: [{ id: 1, name: 'Barbell Press', sets: '3 sets x 10', image: require('@/assets/images/Chest/Barbellpress.gif')},
    { id: 2, name: 'Incline Barbell Press', sets: '3 sets x 10', image: require('@/assets/images/Chest/inclinebenchpress.gif')},
    { id: 3, name: 'Decline Barbell Press', sets: '3 sets x 10', image: require('@/assets/images/Chest/declinepress.gif')},
    { id: 4, name: 'Dumbbell Press', sets: '3 sets x 10', image: require('@/assets/images/Chest/Dumbbell-Press.gif')},
    { id: 5, name: 'Decline Cable Fly', sets: '3 sets x 10', image: require('@/assets/images/Chest/Decline-Cable-Fly.gif')},
    { id: 6, name: 'Low Cable Crossover', sets: '3 sets x 10', image: require('@/assets/images/Chest/Low-Cable-Crossover.gif')},
  ] },
  Tue: { title: '"Your back carries you\n through life—train it\n like it matters!" 🏋️‍♂️', workouts: [{ id: 7, name: 'Lat Pull Down', sets: '3 sets x 8', image: require('@/assets/images/Back/Lat-Pulldown.gif') },
    { id: 8, name: 'Bent-Over Barbell Row', sets: '3 sets x 8', image: require('@/assets/images/Back/bentoverbarbellrow.gif') },
    { id: 9, name: 'Seated Cable Row', sets: '3 sets x 8', image: require('@/assets/images/Back/seatedcablerow.gif') },
    { id: 10, name: 'T-Bar Row', sets: '3 sets x 8', image: require('@/assets/images/Back/T-Bar.gif') },
    { id: 11, name: 'Chest-Supported Row', sets: '3 sets x 8', image: require('@/assets/images/Back/chestsupportedrow.gif') },
    { id: 12, name: 'Deadlifts', sets: '3 sets x 8', image: require('@/assets/images/Back/barbell-deadlift-movement.gif') }
  ] },
  Wed: { title: '"Strong shoulders carry the\n weight of success!" 🏋️‍♂️', workouts: [{ id: 13, name: 'Overhead Press', sets: '3 sets x 10', image: require('@/assets/images/Shoulder/overheadpress.gif') },
    { id: 14, name: 'Front Raises', sets: '3 sets x 10', image: require('@/assets/images/Shoulder/Front-Raises.gif') },
    { id: 15, name: 'Lateral Raises', sets: '3 sets x 10', image: require('@/assets/images/Shoulder/cablelateralrasies.gif') },
    { id: 16, name: 'Cable Lateral Raises', sets: '3 sets x 10', image: require('@/assets/images/Shoulder/Dumbbell-Lateral-Raise.gif') },
    { id: 17, name: 'Reverse Pec Deck Machine', sets: '3 sets x 10', image: require('@/assets/images/Shoulder/seated-reverse-fly.gif') },
    { id: 18, name: 'Back Barbell Shrugs', sets: '3 sets x 10', image: require('@/assets/images/Shoulder/Back-Barbell-Shrug.gif') },
    
  ] },
  Thu: { title: '"Biceps for the flex, \ntriceps for the checks!"\n 💵💪', workouts: [{ id: 19, name: 'Biceps Curl', sets: '3 sets x 12', image: require('@/assets/images/Biceps&&Triceps/BarbellCurl.gif') },
    { id: 20, name: 'Hammer Curl', sets: '3 sets x 12', image: require('@/assets/images/Biceps&&Triceps/Hammer-Curl.gif') },
    { id: 21, name: 'Preacher Curl', sets: '3 sets x 12', image: require('@/assets/images/Biceps&&Triceps/Preacher-Curl.gif') },
    { id: 22, name: 'Incline Dumbbell Curl', sets: '3 sets x 12', image: require('@/assets/images/Biceps&&Triceps/inclinedumbbellbicepcurl.gif') },
    { id: 23, name: 'Skull Crushers', sets: '3 sets x 12', image: require('@/assets/images/Biceps&&Triceps/Skull-Crusher.gif') },
    { id: 24, name: 'Overhead Triceps Extension', sets: '3 sets x 12', image: require('@/assets/images/Biceps&&Triceps/overheadtricepextension.gif') },
    { id: 26, name: 'Rope Pushdowns', sets: '3 sets x 12', image: require('@/assets/images/Biceps&&Triceps/Rope-Pushdown.gif') },
    { id: 27, name: 'Pushdown', sets: '3 sets x 12', image: require('@/assets/images/Biceps&&Triceps/Pushdown.gif') }
  ] },
  Fri: { title: '"Power starts from the\n hands—never skip forearms!"\n 💯握', workouts: [{ id: 28, name: 'Reverse Curls', sets: '3 sets x 15', image: require('@/assets/images/Forearm/dumbbell-reverse-curl.gif') },
    { id: 29, name: 'Wrist Roller', sets: '3 sets x 15', image: require('@/assets/images/Forearm/WRIST_ROLLER.gif') },
    { id: 31, name: 'Zottman Curls', sets: '3 sets x 15', image: require('@/assets/images/Forearm/Seated-Zottman-Curl.gif') }
  ] },
  Sat: { title: '"Your body won’t go \nwhere your legs can’t\n take you!" 🚀💥', workouts: [{ id:31, name: 'Barbell Squats', sets: '4 sets x 12', image: require('@/assets/images/Legs/Squats.gif') },
    { id:32, name: 'Leg Press', sets: '4 sets x 12', image: require('@/assets/images/Legs/LEG_PRESS.gif') },
    { id:33, name: 'Lunges', sets: '4 sets x 12', image: require('@/assets/images/Legs/dumbbell-lunges.gif') },
    { id:34, name: 'Leg Extensions', sets: '4 sets x 12', image: require('@/assets/images/Legs/LEG-EXTENSION.gif') },
    { id:35, name: 'Calf Raises', sets: '4 sets x 12', image: require('@/assets/images/Legs/Lever-Seated-Calf-Raise.gif') },
    { id:36, name: 'Hip Thrusts', sets: '4 sets x 12', image: require('@/assets/images/Legs/Barbell-Hip-Thrust.gif') }
  ] },
  Sun: { title: 'Rest Day', workouts: [] },
};

const WorkoutNormal = () => {
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
              onPress={()=>router.navigate('/(User)/Workoutplan')}
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
      'Barbell Press': '/Chest/BenchPress' as Href,
      'Incline Barbell Press': '/Chest/InclinePress' as Href,
      'Decline Barbell Press': '/Chest/DeclinePress' as Href,
      'Dumbbell Press': '/Chest/DumbbellPress' as Href,
      'Decline Cable Fly': '/Chest/DeclineCableFly' as Href,
      'Low Cable Crossover': '/Chest/LowCableCrossover' as Href,
      'Lat Pull Down': '/Back/LatPullDown' as Href,
      'Bent-Over Barbell Row': '/Back/BentOverBarbellRow' as Href,
      'Seated Cable Row': '/Back/SeatedCableRow' as Href,
      'T-Bar Row': '/Back/TBar' as Href,
      'Chest-Supported Row': '/Back/ChestSupportedRow' as Href,
      'Deadlifts': '/Back/Deadlifts' as Href,
      'Overhead Press': '/Shoulder/OverheadPress' as Href,
      'Front Raises': '/Shoulder/FrontRaises' as Href,
      'Lateral Raises': '/Shoulder/LateralRaises' as Href,
      'Cable Lateral Raises': '/Shoulder/CableLateralRaises' as Href,
      'Reverse Pec Deck Machine': '/Shoulder/ReversePecDeckMachine' as Href,
      'Back Barbell Shrugs': '/Shoulder/BackBarbellShrugs' as Href,
      'Biceps Curl': '/Biceps/BarbellCurl' as Href,
      'Hammer Curl': '/Biceps/HammerCurl' as Href,
      'Preacher Curl': '/Biceps/PreacherCurl' as Href,
      'Incline Dumbbell Curl': '/Biceps/InclineDumbbellCurl' as Href,
      'Skull Crushers': '/Biceps/SkullCrushers' as Href,
      'Overhead Triceps Extension': '/Biceps/OverheadTricepsExtension' as Href,
      'Rope Pushdowns': '/Biceps/RopePushdowns' as Href,
      'Pushdown': '/Biceps/Pushdown' as Href,
      'Reverse Curls': '/Forearm/WristCurls' as Href,
      'Zottman Curls': '/Forearm/ZottmanCurls' as Href,
      'Wrist Roller': '/Forearm/WristRoller' as Href,
      'Barbell Squats': '/Legs/BarbellSquats' as Href,
      'Leg Press': '/Legs/LegPress' as Href,
      'Lunges': '/Legs/Lunges' as Href,
      'Leg Extensions': '/Legs/LegExtensions' as Href,
      'Calf Raises': '/Legs/CalfRaises' as Href,
      'Hip Thrusts': '/Legs/HipThrusts' as Href,
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

export default WorkoutNormal;
