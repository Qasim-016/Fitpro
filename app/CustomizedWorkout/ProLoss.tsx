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
  Mon: { title: '"Train your chest like\n a champion; the results\n will speak for themselves."\n 🏆', workouts: [{ id: 1, name: 'Flat Barbell\nBench Press', sets: '4 sets x 10-12', image: require('@/assets/images/Chest/Barbellpress.gif')},
    { id: 2, name: 'Incline Dumbbell Press', sets: '4 sets x 12-15', image: require('@/assets/images/Chest/Incline-Dumbbell-Press.gif')},
    { id: 3, name: 'Weighted Dips', sets: '4 sets x 12-15', image: require('@/assets/images/Chest/WEI_DIPS.gif')},
    { id: 4, name: 'Cable Crossovers\n(Drop Set)', sets: '4 sets x 12-15', image: require('@/assets/images/Chest/CROSS_OVER.gif')},
    { id: 5, name: 'Sprint', sets: '10 min', image: require('@/assets/images/Chest/sprint.gif')},
  ] },
 
  Tue: { title: '"Your back carries you\n through life—train it\n like it matters!" 🏋️‍♂️', workouts: [{ id: 7, name: 'Weighted Pull-Ups', sets: '4 sets x 10-12', image: require('@/assets/images/Back/WEI_PULL_UP.gif') },
    { id: 9, name: 'Single-Arm Dumbbell\nRows', sets: '4 sets x 6-8', image: require('@/assets/images/Back/OA_DB_ROW.gif') },
    { id: 10, name: 'T-Bar Row', sets: '4 sets x 10-12', image: require('@/assets/images/Back/T-Bar.gif') },
    { id: 11, name: 'Battle Ropes (Finisher)', sets: '3 sets x 60sec', image: require('@/assets/images/Back/BAT_ROPE.gif') },
    { id: 12, name: 'Deadlifts', sets: '4 sets x 10-12', image: require('@/assets/images/Back/barbell-deadlift-movement.gif') }
  ] },
  
  Wed: { title: '"Strong shoulders carry the\n weight of success!" 🏋️‍♂️', workouts: [{ id: 13, name: 'Barbell Overhead\nPress (Light & Fast)', sets: '5 sets x 12-15', image: require('@/assets/images/Shoulder/overheadpress.gif') },
    { id: 14, name: 'Dumbbell Arnold\nPress', sets: '4 sets x 12-15', image: require('@/assets/images/Shoulder/Arnold-Press.gif') },
    { id: 15, name: 'Face Pulls', sets: '4 sets x 15-20', image: require('@/assets/images/Shoulder/FACE_PULL.gif') },
    { id: 16, name: 'Cable Lateral\nRaises', sets: '4 sets x 12-15', image: require('@/assets/images/Shoulder/cablelateralrasies.gif') },
    { id: 17, name: 'Reverse Pec Dec\n(Rear Delts)', sets: '4 sets x 15-20', image: require('@/assets/images/Shoulder/seated-reverse-fly.gif') },
    { id: 18, name: 'Burpees', sets: '3 sets x 15-20', image: require('@/assets/images/Chest/burpees.gif') },
    
  ] },
  
  Thu: { title: '"Biceps for the flex, \ntriceps for the checks!"\n 💵💪', workouts: [{ id: 19, name: 'Barbell Curls\n(Light & Fast)', sets: '5 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/BarbellCurl.gif') },
    { id: 20, name: 'Chin-Ups (Bodyweight)', sets: '4 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/CHIN_UP.gif') },
    { id: 21, name: 'Rope Cable Curls', sets: '4 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/ropecurl.gif') },
    { id: 23, name: 'Close-Grip Bench\nPress (Light & Fast)', sets: '3 sets x 12', image: require('@/assets/images/Biceps&&Triceps/CG_BB_BP.gif') },
    { id: 24, name: 'Triceps Dips\n(Bodyweight)', sets: '3 sets x 12', image: require('@/assets/images/Biceps&&Triceps/BENCH_DIPS.gif') },
    { id: 26, name: 'Rope Tricep Pushdowns', sets: '3 sets x 12', image: require('@/assets/images/Biceps&&Triceps/Rope-Pushdown.gif') },
    { id: 27, name: 'Burpees', sets: '3 sets x 60sec', image: require('@/assets/images/Chest/burpees.gif') }
  ] },

  Fri: { title: '"Power starts from the\n hands—never skip forearms!"\n 💯握', workouts: [{ id: 28, name: 'Barbell Wrist\nCurls (Fast)', sets: '5 sets x 15-20', image: require('@/assets/images/Forearm/barbell-wrist-curl.gif') },
    { id: 29, name: 'Wrist Roller', sets: '5 sets x 15-20', image: require('@/assets/images/Forearm/WRIST_ROLLER.gif') },
    { id: 30, name: 'Zottman Curls', sets: '5 sets x 15-20', image: require('@/assets/images/Forearm/Seated-Zottman-Curl.gif') }
  ] },
  Sat: { title: '"Your body won’t go \nwhere your legs can’t\n take you!" 🚀💥', workouts: [{ id:31, name: 'Barbell Squats\n(Light & Fast)', sets: '5 sets x 12-15', image: require('@/assets/images/Legs/Squats.gif') },
    { id:32, name: 'Kettlebell Goblet\nSquats', sets: '4 sets x 12-15', image: require('@/assets/images/Legs/kettlebell-goblet-squat.gif') },
    { id:33, name: 'Bulgarian Split\nSquats (Weighted)', sets: '4 sets x 12-15per leg', image: require('@/assets/images/Legs/Dumbbell-Bulgarian-Split-Squat.gif') },
    { id:34, name: 'Step-Ups (Weighted)', sets: '4 sets x 12per leg', image: require('@/assets/images/Legs/WEI_STEP_UP.gif') },
    { id:35, name: 'Calf Raises', sets: '4 sets x 12-15', image: require('@/assets/images/Legs/Lever-Seated-Calf-Raise.gif') },
    { id:36, name: 'Jump Lunges', sets: '4 sets x 12per leg', image: require('@/assets/images/Legs/power-lunge.gif') }
  ] },
  Sun: { title: "Rest and recover,'\n'tomorrow is another'\n' challenge!", workouts: [] },
};

const ProLoss = () => {
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
                  <Text style={styling.restDayQuote}></Text>
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
      'Weighted Dips': '/Chest/WeiDips' as Href,
      'Cable Crossovers\n(Drop Set)': '/Chest/CableCrossover' as Href,
      'Sprint': '/Chest/Sprint' as Href,
      'Weighted Pull-Ups': '/Back/WeightedPullUps' as Href,
      'Single-Arm Dumbbell\nRows': '/Back/SingleArmDumbbellRows' as Href,
      'Battle Ropes (Finisher)': '/Back/BattleRopes' as Href,
      'T-Bar Row': '/Back/TBar' as Href,
      'Deadlifts': '/Back/Deadlifts' as Href,
      'Barbell Overhead\nPress (Light & Fast)': '/Shoulder/OverheadPress' as Href,
      'Dumbbell Arnold\nPress': '/Shoulder/ArnoldPress' as Href,
      'Face Pulls': '/Shoulder/FacePulls' as Href,
      'Cable Lateral\nRaises': '/Shoulder/CableLateralRaises' as Href,
      'Reverse Pec Dec\n(Rear Delts)': '/Shoulder/ReversePecDecMachine' as Href,
      'Burpees': '/Chest/Burpees' as Href,
      'Barbell Curls\n(Light & Fast)': '/Biceps/BarbellCurl' as Href,
      'Chin-Ups (Bodyweight)': '/Biceps/ChinUps' as Href,
      'Rope Cable Curls': '/Biceps/RopeCableCurls' as Href,
      'Close-Grip Bench\nPress (Light & Fast)': '/Biceps/CloseGripBenchPress' as Href,
      'Triceps Dips\n(Bodyweight)': '/Biceps/TricepDips' as Href,
      'Rope Tricep Pushdowns': '/Biceps/RopePushdowns' as Href,
      'Burpee': '/Chest/Burpees' as Href,
      'Barbell Wrist\nCurls (Fast)': '/Forearm/Barbellwristcurls' as Href,
      'Zottman Curls': '/Forearm/ZottmanCurls' as Href,
      'Wrist Roller': '/Forearm/WristRoller' as Href,
      'Barbell Squats\n(Light & Fast)': '/Legs/BarbellSquats' as Href,
      'Kettlebell Goblet\nSquats': '/Legs/KettlebellSquats' as Href,
      'Bulgarian Split\nSquats (Weighted)': '/Legs/BulgarianSquats' as Href,
      'Step-Ups (Weighted)': '/Legs/StepUps' as Href,
      'Calf Raises': '/Legs/CalfRaises' as Href,
      'Jump Lunges': '/Legs/WalkingLunges' as Href,
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

export default ProLoss;
