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
  Mon: { title: '"Train your chest like\n a champion; the results\n will speak for themselves."\n 🏆', workouts: [{ id: 1, name: 'Flat Barbell\nBench Press', sets: '4 sets x 8-10', image: require('@/assets/images/Chest/Barbellpress.gif')},
    { id: 2, name: 'Incline Dumbbell Press', sets: '4 sets x 10-12', image: require('@/assets/images/Chest/Incline-Dumbbell-Press.gif')},
    { id: 3, name: 'Decline Dumbbell\nFly', sets: '3 sets x 10-12', image: require('@/assets/images/Chest/DB_DEC_FLY.gif')},
    { id: 4, name: 'Cable Flys\n(Drop Set)', sets: '3 sets x 12-15', image: require('@/assets/images/Chest/CROSS_OVER.gif')},
    { id: 5, name: 'Dips\n(Chest Focused)', sets: '4 sets x 10-12', image: require('@/assets/images/Chest/Dips.gif')},
  ] },
  Tue: { title: '"Your back carries you\n through life—train it\n like it matters!" 🏋️‍♂️', workouts: [{ id: 7, name: 'Lat Pulldown\n(Heavy Weight)', sets: '4 sets x 8-10', image: require('@/assets/images/Back/Lat-Pulldown.gif') },
    { id: 8, name: 'Bent-Over\nBarbell Row', sets: '4 sets x 10-12', image: require('@/assets/images/Back/bentoverbarbellrow.gif') },
    { id: 9, name: 'Pull-Ups', sets: '3 sets x 10-12', image: require('@/assets/images/Back/pull-up.gif') },
    { id: 10, name: 'Single-Arm\nDumbbell Rows', sets: '4 sets x 10-12', image: require('@/assets/images/Back/OA_DB_ROW.gif') },
    { id: 11, name: 'Face Pulls', sets: '3 sets x 12-15', image: require('@/assets/images/Back/Cross-Cable-Face-Pull.gif') },
  ] },
  Wed: { title: '"Strong shoulders carry the\n weight of success!" 🏋️‍♂️', workouts: [{ id: 13, name: 'Overhead Press', sets: '4 sets x 8-10', image: require('@/assets/images/Shoulder/overheadpress.gif') },
    { id: 14, name: 'Arnold Press', sets: '4 sets x 8-10', image: require('@/assets/images/Shoulder/Arnold-Press.gif') },
    { id: 15, name: 'Upright Rows (Dumbbell)', sets: '4 sets x 10-12', image: require('@/assets/images/Shoulder/DB_UPRIGHT_ROW.gif') },
    { id: 16, name: 'Cable Lateral Raises', sets: '4 sets x 10-12', image: require('@/assets/images/Shoulder/cablelateralrasies.gif') },
    { id: 17, name: 'Reverse Pec\nDec Machine', sets: '4 sets x 12-15', image: require('@/assets/images/Shoulder/seated-reverse-fly.gif') },
    { id: 18, name: 'Back Barbell Shrugs', sets: '4 sets x 12-15', image: require('@/assets/images/Shoulder/Back-Barbell-Shrug.gif') },
    
  ] },
  Thu: { title: '"Biceps for the flex, \ntriceps for the checks!"\n 💵💪', workouts: [{ id: 19, name: 'Biceps Curl', sets: '4 sets x 8-10', image: require('@/assets/images/Biceps&&Triceps/BarbellCurl.gif') },
    { id: 20, name: 'Zottman Curls', sets: '3 sets x 10-12', image: require('@/assets/images/Forearm/Seated-Zottman-Curl.gif') },
    { id: 21, name: 'Preacher Curl', sets: '4 sets x 8-10', image: require('@/assets/images/Biceps&&Triceps/Preacher-Curl.gif') },
    { id: 22, name: 'Incline Dumbbell Curl', sets: '4 sets x 8-10', image: require('@/assets/images/Biceps&&Triceps/inclinedumbbellbicepcurl.gif') },
    { id: 23, name: 'Skull Crushers', sets: '4 sets x 8-10', image: require('@/assets/images/Biceps&&Triceps/Skull-Crusher.gif') },
    { id: 24, name: 'Close-Grip\nBench Press', sets: '4 sets x 8-10', image: require('@/assets/images/Biceps&&Triceps/CG_BB_BP.gif') },
    { id: 26, name: 'Diamond Push-Ups', sets: '3 sets x 10-12', image: require('@/assets/images/Biceps&&Triceps/Diamond-Push-up.gif') },
    { id: 27, name: 'Dips (Weighted)', sets: '3 sets x 10-12', image: require('@/assets/images/Biceps&&Triceps/tricepdips.gif') }
  ] },
  Fri: { title: '"Power starts from the\n hands—never skip forearms!"\n 💯握', workouts: [{ id: 28, name: 'Reverse Wrist Curls', sets: '4 sets x 10-12', image: require('@/assets/images/Forearm/REV_DB_WRIST_CURL.gif') },
    { id: 29, name: 'Heavy Farmer’s Carry', sets: '4 sets x 30sec', image: require('@/assets/images/Forearm/Farmerwalk.gif') },
    { id: 31, name: 'Wrist Roller\n(Up & Down)', sets: '3 sets x 60sec', image: require('@/assets/images/Forearm/WRIST_ROLLER.gif') }
  ] },
  Sat: { title: '"Your body won’t go \nwhere your legs can’t\n take you!" 🚀💥', workouts: [{ id:31, name: 'Barbell Squats', sets: '4 sets x 8-10', image: require('@/assets/images/Legs/Squats.gif') },
    { id:32, name: 'Leg Press(Heavy)', sets: '4 sets x 10-12', image: require('@/assets/images/Legs/LEG_PRESS.gif') },
    { id:33, name: 'Bulgarian Split\nSquats', sets: '4 sets x 8-10per leg', image: require('@/assets/images/Legs/Dumbbell-Bulgarian-Split-Squat.gif') },
    { id:34, name: 'Romanian Barbell\nDeadlift', sets: '4 sets x 10-12', image: require('@/assets/images/Back/barbell-deadlift-movement.gif') },
    { id:36, name: 'Seated Hamstring Curl', sets: '4 sets x 12-15', image: require('@/assets/images/Legs/HAM.gif') },
    { id:35, name: 'Seated Calf Raises', sets: '4 sets x 12-15', image: require('@/assets/images/Legs/Lever-Seated-Calf-Raise.gif') },
  ] },
  Sun: { title: 'Rest Day', workouts: [] },
};

const InterGain = () => {
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
      'Flat Barbell\nBench Press': '/Chest/BenchPress' as Href,
      'Incline Dumbbell Press': '/Chest/InclineDumbbellPress' as Href,
      'Decline Dumbbell\nFly': '/Chest/DeclineDumbbellFly' as Href,
      'Cable Flys\n(Drop Set)': '/Chest/CableCrossover' as Href,
      'Dips\n(Chest Focused)': '/Chest/Dips' as Href,
      'Lat Pulldown\n(Heavy Weight)': '/Back/LatPullDown' as Href,
      'Bent-Over\nBarbell Row': '/Back/BentOverBarbellRow' as Href,
      'Pull-Ups': '/Back/PullUps' as Href,
      'Single-Arm\nDumbbell Rows': '/Back/SingleArmDumbbellRows' as Href,
      'Face Pulls': '/Back/FacePulls' as Href,
      'Overhead Press': '/Shoulder/OverheadPress' as Href,
      'Arnold Press': '/Shoulder/ArnoldPress' as Href,
      'Upright Rows (Dumbbell)': '/Shoulder/UprightRows' as Href,
      'Cable Lateral Raises': '/Shoulder/CableLateralRaises' as Href,
      'Reverse Pec\nDec Machine': '/Shoulder/ReversePecDecMachine' as Href,
      'Back Barbell Shrugs': '/Shoulder/BackBarbellShrugs' as Href,
      'Biceps Curl': '/Biceps/BarbellCurl' as Href,
      'Zottman Curls': '/Forearm/ZottmanCurls' as Href,
      'Preacher Curl': '/Biceps/PreacherCurl' as Href,
      'Incline Dumbbell Curl': '/Biceps/InclineDumbbellCurl' as Href,
      'Skull Crushers': '/Biceps/SkullCrushers' as Href,
      'Close-Grip\nBench Press': '/Biceps/CloseGripBenchPress' as Href,
      'Diamond Push-Ups': '/Biceps/DiamondPushUps' as Href,
      'Dips (Weighted)': '/Biceps/WeightedDips' as Href,
      'Reverse Wrist Curls': '/Forearm/ReverseDbWristCurls' as Href,
      'Heavy Farmer’s Carry': '/Forearm/HeavyFarmerCarry' as Href,
      'Wrist Roller\n(Up & Down)': '/Forearm/WristRoller' as Href,
      'Barbell Squats': '/Legs/BarbellSquats' as Href,
      'Leg Press(Heavy)': '/Legs/LegPress' as Href,
      'Bulgarian Split\nSquats': '/Legs/BulgarianSquats' as Href,
      'Romanian Barbell\nDeadlift': '/Back/Deadlifts' as Href,
      'Seated Calf Raises': '/Legs/CalfRaises' as Href,
      'Seated Hamstring Curl': '/Legs/Hamstring' as Href,
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

export default InterGain;
