import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Href } from 'expo-router'; // Import Href type

import Heading from '@/components/Text/Heading';
import MyButton from '@/components/Buttons/MyButton';

import styling from '@/assets/Styles/styling';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import { router } from 'expo-router';
import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const currentDayIndex = new Date().getDay();
const currentDay = days[currentDayIndex === 0 ? 6 : currentDayIndex - 1]; // Adjust for Sunday (0) being last

type WorkoutPlan = {
  title: string;
  workouts: { id: number; name: string; sets: string; image: any }[];
};
const workoutPlans: Record<string, WorkoutPlan> = {
  Mon: { title: '"Train your chest like\n a champion; the results\n will speak for themselves."\n 🏆', workouts: [{ id: 1, name: 'Incline Dumbbell Press', sets: '4 sets x 12-15', image: require('@/assets/images/Chest/Incline-Dumbbell-Press.gif')},
    { id: 2, name: 'Dips', sets: '4 sets x 12-15', image: require('@/assets/images/Chest/Dips.gif')},
    { id: 3, name: 'Decline Push-Ups', sets: '4 sets x 12-15', image: require('@/assets/images/Chest/Decline-PushUps.gif')},
    { id: 4, name: 'Cable Flys', sets: '4 sets x 12-15', image: require('@/assets/images/Chest/CROSS_OVER.gif')},
    { id: 5, name: 'Jumping Burpees', sets: '4 sets x 12-15', image: require('@/assets/images/Chest/burpees.gif')},
  ] },
  Tue: { title: '"Your back carries you\n through life—train it\n like it matters!" 🏋️‍♂️', workouts: [{ id: 7, name: 'Pull-Ups', sets: '3 sets x 10-12', image: require('@/assets/images/Back/pull-up.gif') },
    { id: 8, name: 'Bent-Over Barbell\nRow', sets: '4 sets x 12-15', image: require('@/assets/images/Back/bentoverbarbellrow.gif') },
    { id: 9, name: 'Lat Pulldown\n(Moderate Weight)', sets: '4 sets x 12-15', image: require('@/assets/images/Back/Lat-Pulldown.gif') },
    { id: 10, name: 'Face Pulls\n(Cable or Bands)', sets: '3 sets x 12-15', image: require('@/assets/images/Back/Cross-Cable-Face-Pull.gif') },
    { id: 11, name: 'Mountain Climbers\n(Finisher)', sets: '3 sets x 60sec', image: require('@/assets/images/Back/Mountain-climber.gif') },
  ] },
  Wed: { title: '"Strong shoulders carry the\n weight of success!" 🏋️‍♂️', workouts: [{ id: 13, name: 'Barbell Overhead\nPress (Light)', sets: '4 sets x 12-15', image: require('@/assets/images/Shoulder/overheadpress.gif') },
    { id: 14, name: 'Arnold Press', sets: '4 sets x 12-15', image: require('@/assets/images/Shoulder/Arnold-Press.gif') },
    { id: 15, name: 'Lateral Raises', sets: '4 sets x 15-20', image: require('@/assets/images/Shoulder/Dumbbell-Lateral-Raise.gif') },
    { id: 16, name: 'Upright Rows\n(Dumbbell)', sets: '4 sets x 15-20', image: require('@/assets/images/Shoulder/DB_UPRIGHT_ROW.gif') },
    { id: 17, name: 'Reverse Pec Dec\n(Rear Delts)', sets: '4 sets x 15-20', image: require('@/assets/images/Shoulder/seated-reverse-fly.gif') },
    { id: 18, name: 'Battle Rope\n(Finisher)', sets: '3 sets x 30sec', image: require('@/assets/images/Back/BAT_ROPE.gif') },
    
  ] },
  Thu: { title: '"Biceps for the flex, \ntriceps for the checks!"\n 💵💪', workouts: [{ id: 19, name: 'Biceps Curl', sets: '4 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/BarbellCurl.gif') },
    { id: 20, name: 'Zottman Curls', sets: '4 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/zottman.gif') },
    { id: 22, name: 'Incline Dumbbell Curl', sets: '4 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/inclinedumbbellbicepcurl.gif') },
    { id: 23, name: 'Skull Crushers', sets: '4 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/SKULL_CRUSH.gif') },
    { id: 24, name: 'Close-Grip Bench\nPress (Light)', sets: '4 sets x 12-15', image: require('@/assets/images/Biceps&&Triceps/CG_BB_BP.gif') },
    { id: 26, name: 'Diamond Push-Ups', sets: '4 sets x 15-20', image: require('@/assets/images/Biceps&&Triceps/Diamond-Push-up.gif') },
    { id: 27, name: 'Battle Rope', sets: '3 sets x 30sec', image: require('@/assets/images/Back/BAT_ROPE.gif') }
  ] },
  Fri: { title: '"Power starts from the\n hands—never skip forearms!"\n 💯握', workouts: [{ id: 28, name: 'Barbell Wrist\nCurls (Light & Fast)', sets: '3 sets x 15', image: require('@/assets/images/Forearm/barbell-wrist-curl.gif') },
    { id: 29, name: 'Reverse Wrist Curls', sets: '3 sets x 15', image: require('@/assets/images/Forearm/REV_DB_WRIST_CURL.gif') },
    { id: 30, name: 'Battle Rope', sets: '4 sets x 30sec', image: require('@/assets/images/Back/BAT_ROPE.gif') }
  ] },
  Sat: { title: '"Your body won’t go \nwhere your legs can’t\n take you!" 🚀💥', workouts: [{ id:31, name: 'Goblet Squats', sets: '4 sets x 12-15', image: require('@/assets/images/Legs/Dumbbell-Goblet-Squat.gif') },
    { id:32, name: 'Bulgarian Split\nSquats (Bodyweight)', sets: '4 sets x 12-15per leg', image: require('@/assets/images/Legs/Bodyweight-Bulgarian-Split-Squat.gif') },
    { id:33, name: 'Kettlebell Swings', sets: '4 sets x 15-20', image: require('@/assets/images/Legs/KB_SWING.gif') },
    { id:34, name: 'Jump Squats', sets: '4 sets x 15-20', image: require('@/assets/images/Legs/Jump-Squat.gif') },
    { id:35, name: 'Box Jumps', sets: '4 sets x 15', image: require('@/assets/images/Legs/box-jump.gif') },
    { id:36, name: 'Seated Calf Raise', sets: '4 sets x 12-15', image: require('@/assets/images/Legs/Lever-Seated-Calf-Raise.gif') }
  ] },
  Sun: { title: "Rest and recover,'\n'tomorrow is another'\n' challenge!", workouts: [] },
};

const InterLoss = () => {
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
      'Incline Dumbbell Press': '/Chest/InclineDumbbellPress' as Href,
      'Dips': '/Chest/Dips' as Href,
      'Decline Push-Ups': '/Chest/DeclinePushUps' as Href,
      'Jumping Burpees': '/Chest/Burpees' as Href,
      'Cable Flys': '/Chest/CableCrossover' as Href,
      'Lat Pulldown\n(Moderate Weight)': '/Back/LatPullDown' as Href,
      'Bent-Over Barbell\nRow': '/Back/BentOverBarbellRow' as Href,
      'Pull-Ups': '/Back/PullUps' as Href,
      'Face Pulls\n(Cable or Bands)': '/Back/FacePulls' as Href,
      'Mountain Climbers\n(Finisher)': '/Back/MountainClimbers' as Href,
      'Barbell Overhead\nPress (Light)': '/Shoulder/OverheadPress' as Href,
      'Arnold Press': '/Shoulder/ArnoldPress' as Href,
      'Lateral Raises': '/Shoulder/LateralRaises' as Href,
      'Upright Rows\n(Dumbbell)': '/Shoulder/UprightRows' as Href,
      'Reverse Pec Dec\n(Rear Delts)': '/Shoulder/ReversePecDecMachine' as Href,
      'Battle Rope\n(Finisher)': '/Back/BattleRopes' as Href,
      'Biceps Curl': '/Biceps/BarbellCurl' as Href,
      'Zottman Curls': '/Forearm/ZottmanCurls' as Href,
      'Incline Dumbbell Curl': '/Biceps/InclineDumbbellCurl' as Href,
      'Skull Crushers': '/Biceps/SkullCrushers' as Href,
      'Close-Grip Bench\nPress (Light)': '/Biceps/CloseGripBenchPress' as Href,
      'Diamond Push-Ups': '/Biceps/DiamondPushUps' as Href,
      'Battle Rope': '/Back/BattleRopes' as Href,
      'Barbell Wrist\nCurls (Light & Fast)': '/Forearm/Barbellwristcurls' as Href,
      'Reverse Wrist Curls': '/Forearm/ReverseDbWristCurls' as Href,
      'Rope': '/Back/BatlleRopes' as Href,
      'Goblet Squats': '/Legs/GobletSquats' as Href,
      'Bulgarian Split\nSquats (Bodyweight)': '/Legs/BulgarianSquatsBW' as Href,
      'Kettlebell Swings': '/Legs/KettlebellSwings' as Href,
      'Jump Squats': '/Legs/JumpSquats' as Href,
      'Seated Calf Raise': '/Legs/CalfRaises' as Href,
      'Box Jumps': '/Legs/BoxJumps' as Href,
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

export default InterLoss;
