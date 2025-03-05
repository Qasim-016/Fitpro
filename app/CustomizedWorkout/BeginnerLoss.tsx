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
  Mon: { title: '"Train your chest like\n a champion; the results\n will speak for themselves."\n 🏆', workouts: [{ id: 1, name: 'Push-Ups', sets: '3 sets x 12-15', image: require('@/assets/images/Chest/Push-Up.gif')},
    { id: 2, name: 'Incline Knee\nPush-Ups', sets: '3 sets x 12-15', image: require('@/assets/images/Chest/knee-push-ups.gif')},
    { id: 3, name: 'Cable Flys', sets: '3 sets x 12-15', image: require('@/assets/images/Chest/CROSS_OVER.gif')},
    { id: 4, name: 'Dumbbell Press\n(Light Weight)', sets: '3 sets x 12-15', image: require('@/assets/images/Chest/Dumbbell-Press.gif')},
    { id: 5, name: 'Burpees', sets: '3 sets x 12-15', image: require('@/assets/images/Chest/burpees.gif')},
  ] },
  Tue: { title: '"Your back carries you\n through life—train it\n like it matters!" 🏋️‍♂️', workouts: [{ id: 7, name: 'Lat Pulldown\n(Light Weight)', sets: '3 sets x 12-15', image: require('@/assets/images/Back/Lat-Pulldown.gif') },
    { id: 8, name: 'Bent-over\nDumbbell Rows', sets: '3 sets x 12-15', image: require('@/assets/images/Back/DB_LOW.gif') },
    { id: 9, name: 'Seated Cable Row', sets: '3 sets x 15-20', image: require('@/assets/images/Back/seatedcablerow.gif') },
    { id: 10, name: 'Superman Holds', sets: '3 sets x 30sec', image: require('@/assets/images/Back/Superman.gif') },
    { id: 11, name: 'Jump Rope\n(Finisher)', sets: '3 sets x 60sec', image: require('@/assets/images/Back/Jump-Rope.gif') },
  ] },
  Wed: { title: '"Strong shoulders carry the\n weight of success!" 🏋️‍♂️', workouts: [{ id: 13, name: 'Dumbbell Shoulder\nPress', sets: '3 sets x 12-15', image: require('@/assets/images/Shoulder/SEAT_DB_SHD_PRESS.gif') },
    { id: 14, name: 'Front Raises (Dumbbell)', sets: '4 sets x 12-15', image: require('@/assets/images/Shoulder/Front-Raises.gif') },
    { id: 15, name: 'Lateral Raises', sets: '4 sets x 12-15', image: require('@/assets/images/Shoulder/Dumbbell-Lateral-Raise.gif') },
    { id: 16, name: 'Face Pulls', sets: '3 sets x 15-20', image: require('@/assets/images/Shoulder/FACE_PULL.gif') },
    { id: 17, name: 'Reverse Pec\nDec Machine', sets: '3 sets x 15-20', image: require('@/assets/images/Shoulder/seated-reverse-fly.gif') },
    { id: 18, name: 'Barbell Shrugs', sets: '3 sets x 15-20', image: require('@/assets/images/Shoulder/BB_SHRUG.gif') },
    
  ] },
  Thu: { title: '"Biceps for the flex, \ntriceps for the checks!"\n 💵💪', workouts: [{ id: 19, name: 'Biceps Curl', sets: '3 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/BarbellCurl.gif') },
    { id: 20, name: 'Hammer Curl', sets: '3 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/Hammer-Curl.gif') },
    { id: 21, name: 'Resistance Band\nCurls', sets: '3 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/Band-Biceps-Curl.gif') },
    { id: 23, name: 'Tricep Dips\n(Bench)', sets: '3 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/BENCH_DIPS.gif') },
    { id: 24, name: 'Resistance Band\nExtensions', sets: '3 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/Standing-Triceps-Extension.gif') },
    { id: 26, name: 'Rope Tricep\nPushdowns', sets: '3 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/Rope-Pushdown.gif') },
  ] },
  Fri: { title: '"Power starts from the\n hands—never skip forearms!"\n 💯握', workouts: [{ id: 28, name: 'Reverse Wrist Curls', sets: '3 sets x 15-20', image: require('@/assets/images/Forearm/REV_DB_WRIST_CURL.gif') },
    { id: 29, name: 'barbell Wrist\nCurls (Light)', sets: '3 sets x 15-20', image: require('@/assets/images/Forearm/barbell-wrist-curl.gif') },
    { id: 31, name: 'Jump Rope', sets: '3 sets x 60sec', image: require('@/assets/images/Forearm/Jump-Rope (1).gif') }
  ] },
  Sat: { title: '"Your body won’t go \nwhere your legs can’t\n take you!" 🚀💥', workouts: [{ id:31, name: 'Bodyweight Squats', sets: '3 sets x 15-20', image: require('@/assets/images/Legs/BW_OH_SQT.gif') },
    { id:32, name: 'Walking Lunges', sets: '3 sets x 12-15per leg', image: require('@/assets/images/Legs/power-lunge.gif') },
    { id:33, name: 'Romanian Deadlifts\n(Light)', sets: '3 sets x 15-20', image: require('@/assets/images/Back/barbell-deadlift-movement.gif') },
    { id:34, name: 'Step-Ups\n(Bodyweight)', sets: '3 sets x 15per leg', image: require('@/assets/images/Legs/STEP_UP.gif') },
    { id:35, name: 'Standing Calf Raises', sets: '3 sets x 20', image: require('@/assets/images/Legs/STD_CALF_RAISE.gif') },
    { id:36, name: 'Jump Squats\n(Finisher)', sets: '3 sets x 30sec', image: require('@/assets/images/Legs/Jump-Squat.gif') }
  ] },
  Sun: { title: 'Rest Day', workouts: [] },
};

const BeginnerLoss = () => {
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
      'Push-Ups': '/Chest/PushUps' as Href,
      'Incline Knee\nPush-Ups': '/Chest/KneePushups' as Href,
      'Cable Flys': '/Chest/CableCrossover' as Href,
      'Dumbbell Press\n(Light Weight)': '/Chest/DumbbellPress' as Href,
      'Burpees': '/Chest/Burpees' as Href,
      'Lat Pulldown\n(Light Weight)': '/Back/LatPullDown' as Href,
      'Bent-over\nDumbbell Rows': '/Back/DumbbellBentOverRow' as Href,
      'Seated Cable Row': '/Back/SeatedCableRow' as Href,
      'Superman Holds': '/Back/SupermanHolds' as Href,
      'Jump Rope\n(Finisher)': '/Back/JumpRope' as Href,
      'Dumbbell Shoulder\nPress': '/Shoulder/DumbbellPress' as Href,
      'Front Raises (Dumbbell)': '/Shoulder/FrontRaises' as Href,
      'Lateral Raises': '/Shoulder/LateralRaises' as Href,
      'Face Pulls': '/Shoulder/FacePulls' as Href,
      'Reverse Pec\nDec Machine': '/Shoulder/ReversePecDecMachine' as Href,
      'Barbell Shrugs': '/Shoulder/BarbellShrugs' as Href,
      'Biceps Curl': '/Biceps/BarbellCurl' as Href,
      'Hammer Curl': '/Biceps/HammerCurl' as Href,
      'Resistance Band\nCurls': '/Biceps/ResistanceBandCurls' as Href,
      'Tricep Dips\n(Bench)': '/Biceps/TricepDips' as Href,
      'Resistance Band\nExtensions': '/Biceps/ResistanceBandExt' as Href,
      'Rope Tricep\nPushdowns': '/Biceps/RopePushdowns' as Href,
      'Reverse Wrist Curls': '/Forearm/ReverseDbWristCurls' as Href,
      'barbell Wrist\nCurls (Light)': '/Forearm/Barbellwristcurls' as Href,
      'Jump Rope': '/Back/JumpRope' as Href,
      'Bodyweight Squats': '/Legs/BodyweightSquats' as Href,
      'Walking Lunges': '/Legs/WalkingLunges' as Href,
      'Romanian Deadlifts\n(Light)': '/Back/Deadlifts' as Href,
      'Step-Ups\n(Bodyweight)': '/Legs/StepUpsBw' as Href,
      'Standing Calf Raises': '/Legs/StandingCalfRaises' as Href,
      'Jump Squats\n(Finisher)': '/Legs/JumpSquats' as Href,
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

export default BeginnerLoss;
