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
  Mon: {
    title: '"Train your chest like\n a champion; the results\n will speak for themselves."\n 🏆', workouts: [{ id: 1, name: 'Flat Barbell\nBench Press (Heavy)', sets: '5 sets x 6-8', image: require('@/assets/images/Chest/Barbellpress.gif') },
    { id: 2, name: 'Incline Barbell Press', sets: '4 sets x 8-10', image: require('@/assets/images/Chest/inclinebenchpress.gif') },
    { id: 3, name: 'Decline Dumbbell Flys\n(Slow & Controlled)', sets: '4 sets x 10-12', image: require('@/assets/images/Chest/DB_DEC_FLY.gif') },
    { id: 5, name: 'Cable Crossovers\n(High Reps Burnout)', sets: '4 sets x 12-15', image: require('@/assets/images/Chest/CROSS_OVER.gif') },
    ]
  },

  Tue: {
    title: '"Your back carries you\n through life—train it\n like it matters!" 🏋️‍♂️', workouts: [{ id: 7, name: 'Weighted Pull-Ups', sets: '4 sets x 8-10', image: require('@/assets/images/Back/WEI_PULL_UP.gif') },
    { id: 9, name: 'Seated Cable Rows\n(Heavy Load)', sets: '4 sets x 10-12', image: require('@/assets/images/Back/seatedcablerow.gif') },
    { id: 10, name: 'T-Bar Row', sets: '4 sets x 8-10', image: require('@/assets/images/Back/T-Bar.gif') },
    { id: 11, name: 'Hyperextensions', sets: '3 sets x 12-15', image: require('@/assets/images/Back/HPET.gif') },
    { id: 12, name: 'Deadlifts (Heavy Weight)', sets: '5 sets x 5-6', image: require('@/assets/images/Back/barbell-deadlift-movement.gif') }
    ]
  },

  Wed: {
    title: '"Strong shoulders carry the\n weight of success!" 🏋️‍♂️', workouts: [{ id: 13, name: 'Barbell Overhead\nPress (Heavy)', sets: '5 sets x 6-8', image: require('@/assets/images/Shoulder/overheadpress.gif') },
    { id: 14, name: 'Dumbbell Arnold\nPress', sets: '4 sets x 8-10', image: require('@/assets/images/Shoulder/Arnold-Press.gif') },
    { id: 15, name: 'Face Pulls (Heavy)', sets: '4 sets x 12-15', image: require('@/assets/images/Shoulder/FACE_PULL.gif') },
    { id: 16, name: 'Cable Side Raises', sets: '4 sets x 10-12', image: require('@/assets/images/Shoulder/cablelateralrasies.gif') },
    { id: 17, name: 'Reverse Pec Dec\n(Rear Delts)', sets: '4 sets x 12-15', image: require('@/assets/images/Shoulder/seated-reverse-fly.gif') },
    { id: 18, name: 'Barbell Shrugs\n(Heavy)', sets: '4 sets x 10-12', image: require('@/assets/images/Shoulder/BB_SHRUG.gif') },

    ]
  },
  Thu: {
    title: '"Biceps for the flex, \ntriceps for the checks!"\n 💵💪', workouts: [{ id: 19, name: 'Barbell Bicep\nCurls (Heavy)', sets: '5 sets x 6-8', image: require('@/assets/images/Biceps&&Triceps/BarbellCurl.gif') },
    { id: 20, name: 'Weighted Chin-Ups', sets: '4 sets x 6-8', image: require('@/assets/images/Biceps&&Triceps/WEI_CHIN_UP.gif') },
    { id: 21, name: 'Spider Curls', sets: '4 sets x 8-10', image: require('@/assets/images/Biceps&&Triceps/spider-curls.gif') },
    { id: 22, name: 'Rope Cable Curls', sets: '4 sets x 10-12', image: require('@/assets/images/Biceps&&Triceps/ropecurl.gif') },
    { id: 23, name: 'Close-Grip Bench\nPress (Heavy)', sets: '5 sets x 6-8', image: require('@/assets/images/Biceps&&Triceps/CG_BB_BP.gif') },
    { id: 24, name: 'Weighted Dips', sets: '4 sets x 6-8', image: require('@/assets/images/Biceps&&Triceps/WEI_DIPS.gif') },
    { id: 26, name: 'Overhead Cable\nExtensions', sets: '4 sets x 8-10', image: require('@/assets/images/Biceps&&Triceps/Standing-Triceps-Extension.gif') },
    { id: 27, name: 'one arm\nReverse-Grip\nTricep Pushdowns', sets: '4 sets x 10-12', image: require('@/assets/images/Biceps&&Triceps/reversegrip.gif') }
    ]
  },

  Fri: {
    title: '"Power starts from the\n hands—never skip forearms!"\n 💯握', workouts: [{ id: 28, name: 'Heavy Barbell\nWrist Curls', sets: '5 sets x 8-10', image: require('@/assets/images/Forearm/barbell-wrist-curl.gif') },
    { id: 29, name: 'Thick Grip\nDead Hangs', sets: '4 sets x 40sec', image: require('@/assets/images/Forearm/dead-hang.gif') },
    { id: 31, name: 'Towel Grip\nPull-ups', sets: '4 sets x 6-8', image: require('@/assets/images/Forearm/towelpullups.gif') }
    ]
  },

  Sat: {
    title: '"Your body won’t go \nwhere your legs can’t\n take you!" 🚀💥', workouts: [{ id: 31, name: 'Heavy Barbell\nSquats', sets: '5 sets x 6-8', image: require('@/assets/images/Legs/Squats.gif') },
    { id: 32, name: 'Leg Press', sets: '4 sets x 8012', image: require('@/assets/images/Legs/LEG_PRESS.gif') },
    { id: 33, name: 'Bulgarian Split\nSquats (Weighted)', sets: '4 sets x 8-10per leg', image: require('@/assets/images/Legs/Dumbbell-Bulgarian-Split-Squat.gif') },
    { id: 34, name: 'Romanian Deadlifts\n(Heavy)', sets: '4 sets x 8-10', image: require('@/assets/images/Back/barbell-deadlift-movement.gif') },
    { id: 36, name: 'Hack Squat\n(Machine)', sets: '4 sets x 10-12', image: require('@/assets/images/Legs/HACK_SQT.gif') },
    { id: 35, name: 'Stand Calf Raises', sets: '4 sets x 12-15', image: require('@/assets/images/Legs/STD_CALF_RAISE.gif') },
    ]
  },
  Sun: { title: 'Rest Day', workouts: [] },
};

const ProGain = () => {
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
        <View style={{ position: 'absolute', right: 5, top: 30 }}>
          <MyButton
            title={
              <Dashboardscreenimage
                path={require('@/assets/images/Profile/edit.png')}
                styles={styling.dashboardbtnimages}
              // tintColor='#2ecc71'
              />
            }
            onPress={() => router.navigate('/(User)/CustomizedWorkout')}
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
                      'Flat Barbell\nBench Press (Heavy)': '/Chest/BenchPress' as Href,
                      'Incline Barbell Press': '/Chest/InclinePress' as Href,
                      'Decline Dumbbell Flys\n(Slow & Controlled)': '/Chest/DeclineDumbbellFly' as Href,
                      'Cable Crossovers\n(High Reps Burnout)': '/Chest/CableCrossover' as Href,
                      'Weighted Pull-Ups': '/Back/WeightedPullUps' as Href,
                      'Hyperextensions': '/Back/HyperextensionsBody' as Href,
                      'Seated Cable Rows\n(Heavy Load)': '/Back/SeatedCableRow' as Href,
                      'T-Bar Row': '/Back/TBar' as Href,
                      'Deadlifts (Heavy Weight)': '/Back/Deadlifts' as Href,
                      'Barbell Overhead\nPress (Heavy)': '/Shoulder/OverheadPress' as Href,
                      'Dumbbell Arnold\nPress': '/Shoulder/ArnoldPress' as Href,
                      'Face Pulls (Heavy)': '/Shoulder/FacePulls' as Href,
                      'Cable Side Raises': '/Shoulder/CableLateralRaises' as Href,
                      'Reverse Pec Dec\n(Rear Delts)': '/Shoulder/ReversePecDecMachine' as Href,
                      'Barbell Shrugs\n(Heavy)': '/Shoulder/BarbellShrugs' as Href,
                      'Barbell Bicep\nCurls (Heavy)': '/Biceps/BarbellCurl' as Href,
                      'Weighted Chin-Ups': '/Biceps/WeightedChinUps' as Href,
                      'Spider Curls': '/Biceps/SpiderCurls' as Href,
                      'Rope Cable Curls': '/Biceps/RopeCableCurls' as Href,
                      'Close-Grip Bench\nPress (Heavy)': '/Biceps/CloseGripBenchPress' as Href,
                      'Overhead Cable\nExtensions': '/Biceps/OverheadTricepsExtension' as Href,
                      'Weighted Dips': '/Biceps/WeightedDips' as Href,
                      'one arm\nReverse-Grip\nTricep Pushdowns': '/Biceps/OnearmReverseGripTricep' as Href,
                      'Heavy Barbell\nWrist Curls': '/Forearm/Barbellwristcurls' as Href,
                      'Thick Grip\nDead Hangs': '/Forearm/DeadHangs' as Href,
                      'Towel Grip\nPull-ups': '/Forearm/TowelGripPullups' as Href,
                      'Heavy Barbell\nSquats': '/Legs/BarbellSquats' as Href,
                      'Leg Press': '/Legs/LegPress' as Href,
                      'Bulgarian Split\nSquats (Weighted)': '/Legs/BulgarianSquats' as Href,
                      'Romanian Deadlifts\n(Heavy)': '/Back/Deadlifts' as Href,
                      'Hack Squat\n(Machine)': '/Legs/HackSquat' as Href,
                      'Stand Calf Raises': '/Legs/StandingCalfRaises' as Href,
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

export default ProGain;
