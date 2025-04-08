import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyButton from '@/components/Buttons/MyButton';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Heading from '@/components/Text/Heading';
import Sidebar from '@/components/bars/sidebar';
import styling from '@/assets/Styles/styling';
import { router, useLocalSearchParams } from 'expo-router';
import { auth } from '../(AuthScreens)/firebaseConfig';
import axios from 'axios';
import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';
import PaymentForm from './PaymentForm';
import GymScheduleScreen from './GymScheduleScreen';
import Profile from './Profile';
import { Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { SERVER_IP } from '../config';
const Dashboard = () => {
  const { selectedSection } = useLocalSearchParams();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedSectionState, setSelectedSection] = useState<string>(Array.isArray(selectedSection) ? selectedSection[0] : selectedSection || 'home');
  const [userData, setUserData] = useState<{ username: string } | null>(null);
  const [hasAccess, setHasAccess] = useState(true); // Track access permission

  useEffect(() => {
    fetchUserData();
    checkTrialAndSubscriptionStatus(); //  Check both trial & subscription on mount
    const interval = setInterval(checkTrialAndSubscriptionStatus, 1000); // Check every 10 sec
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fetchUserData = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        const response = await axios.get(`http://${SERVER_IP}:5000/api/auth/getUserdata`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };


  const checkTrialAndSubscriptionStatus = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      // 🔹 Check trial status first
      try {
        const trialResponse = await axios.get(`http://${SERVER_IP}:5000/api/trial/${userId}`);
        if (trialResponse.data.trialStatus === 'active') {
          // console.log(" Free trial is active. Granting access.");
          setHasAccess(true);
          return; // Exit early
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // console.log(" No active free trial found. Checking subscription...");
        } else {
          // console.error(" Error checking trial:", error);
          return;
        }
      }

      // 🔹 If no active trial, check subscription
      try {
        const subscriptionResponse = await axios.get(`http://${SERVER_IP}:5000/api/subscription/${userId}`);
        const subscriptionData = subscriptionResponse.data;

        const currentTime = Date.now();
        const isSubscriptionActive = subscriptionData.subscriptionEndTime > currentTime;

        if (isSubscriptionActive) {
          // console.log("Subscription is active. Granting access.");
          setHasAccess(true);
          return; // Exit early
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // console.log("No active subscription found.");
        } else {
          console.error("Error checking subscription:", error);
          return;
        }
      }

      //  If neither trial nor subscription is active, restrict access
      // console.log(" No active trial or subscription. Restricting access.");
      setHasAccess(false);
      setSelectedSection('payment'); // Redirect to Payment page

    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };


  const handleWorkoutPress = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await axios.get(`http://${SERVER_IP}:5000/getWorkoutPlan`, {
        headers: { Authorization: token }
      });

      if (response.data && response.data.workoutPlan) {
        const { level, goal } = response.data.workoutPlan;

        console.log('User Workout Plan:', level, goal); // Debugging

        // 🔹 Apply conditions based on fitness level and goal
        if (level === 'Begin' && goal === 'Weight Gain') {
          router.push('/CustomizedWorkout/BeginnerGain');
          return;
        } else if (level === 'Begin' && goal === 'Weight Loss') {
          router.push('/CustomizedWorkout/BeginnerLoss');
          return;
        } else if (level === 'Intermediate' && goal === 'Weight Gain') {
          router.push('/CustomizedWorkout/InterGain');
          return;
        } else if (level === 'Intermediate' && goal === 'Weight Loss') {
          router.push('/CustomizedWorkout/InterLoss');
          return;
        } else if (level === 'Pro' && goal === 'Weight Gain') {
          router.push('/CustomizedWorkout/ProGain');
          return;
        } else{
          router.push('/CustomizedWorkout/ProLoss');
          return;
        }
      } else {
        router.push('/(User)/Workoutplan'); // If no plan exists, navigate to WorkoutPlan
      }
    } catch (error: any) {
      // console.error('Error fetching workout plan:', error.response?.data || error.message || error);
      // Alert.alert('Error', 'Failed to fetch workout plan.');
      router.push('/(User)/Workoutplan'); // If error, redirect to WorkoutPlan
    }
  };


  
   const handleDietPress = async () => {
    // const { goal, gender, height,currentWeight, level, duration,targetWeight }=req.body[]
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            Alert.alert('Error', 'You must be logged in to save your diet plan.');
            return;
        }
       
        try {
          const token = await user.getIdToken();
          const response = await axios.get(`http://${SERVER_IP}:5000/getDietPlan`, {
            headers: { Authorization: token }
          });
            if (response.data && response.data.dietPlan) {
              const { gender, height, level, duration, goal, currentWeight } = response.data.dietPlan;
              const heightNum = Number(height);
              const currentWeightNum = Number(currentWeight);
            if (goal === 'Weight Gain') {

                if (gender === 'Male' || gender === 'Other') {

                    if (heightNum < 170 &&
                        currentWeightNum < 60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain1');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain4');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain7');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain2');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain5');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain8');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain3');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain6');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain9');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum > 169 &&
                        currentWeightNum < 60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain10');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain13');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain16');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain11');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain14');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain17');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain12');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain15');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain18');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum > 59) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain4');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain7');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain19');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain5');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain8');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain20');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain6');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain9');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain21');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum > 59) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain11');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain14');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain17');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain12');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain15');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain18');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Gain13');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Gain16');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Gain22');
                                return;
                            }
                        }
                    }

                }

                if (gender === 'Female') {

                    if (heightNum < 170 &&
                        currentWeightNum < 60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain1');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain4');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain7');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain2');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain5');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain8');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain3');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain6');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain9');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum > 169 &&
                        currentWeightNum < 60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain10');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain13');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain16');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain11');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain14');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain17');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain12');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain15');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain18');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum > 59) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain4');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain7');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain19');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain5');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain8');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain20');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain6');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain9');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain21');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum > 59) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain11');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain14');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain17');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain12');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain15');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain18');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/FGain13');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/FGain16');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/FGain22');
                                return;
                            }
                        }
                    }

                }
            }

            if (goal === 'Weight loss') {

                if (gender === 'Male' || gender === 'Other') {

                    if (heightNum < 170 &&
                        currentWeightNum < 60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1200');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum > 169 &&
                        currentWeightNum < 60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum > 59) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1600');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum > 59) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1700');
                                return;
                            }
                        }
                    }

                }

                if (gender === 'Female') {

                    if (heightNum < 170 &&
                        currentWeightNum < 60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1200');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum > 169 &&
                        currentWeightNum < 60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1300');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 170 &&
                        currentWeightNum > 59) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum > 59) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/Loss1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/Loss1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/Loss1500');
                                return;
                            }
                        }
                    }

                }
            }}
            else {
              router.push('/(User)/Dietplan'); // If no plan exists, navigate to WorkoutPlan
            }
        } catch (error) {
            router.push('/(User)/Dietplan'); // If no plan exists, navigate to WorkoutPlan
          
        }
    };




  const openSidebar = () => {
    setIsSidebarVisible(true);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };

  const { width, height } = Dimensions.get('screen');

  // Function to determine the tintColor for the image based on the selection
  const getImageTintColor = (section: string) => {
    return selectedSectionState === section ? '#4CAF50' : '#000000'; // Green for selected, black for unselected
  };

  return (
    <SafeAreaView style={{ height }}>
      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
      <View style={{ flex: 1 }}>
        {/* Navbar - Show only on the 'home' page */}
        {selectedSectionState === 'home' && (
          <View style={styling.subcontainerfornavbar}>
            <View style={styling.navbarleftside}>
              <MyButton
                title={
                  <LogoImgForScreen
                    path={require('@/assets/images/Usersite/Sidebar.png')}
                    styles={styling.dashboardbtnimages}
                  />
                }
                onPress={openSidebar}
                style1={styling.button}
                style2={styling.NextBackbtntext}
              />
              {userData ? (
                <>
                  <Heading title={`Hi, ${userData.username}`} styles={styling.HeaderText} />
                </>
              ) : (
                <Heading title='Loading' />
              )}
            </View>
            <View style={styling.navbarleftside}>
              <MyButton
                title={
                  <LogoImgForScreen
                    path={require('@/assets/images/Usersite/notification.png')}
                    styles={styling.dashboardbtnimages}
                  />
                }
                onPress={() => router.navigate('/(User)/Gotonotifications')}
                style1={styling.button}
                style2={styling.NextBackbtntext}
              />
              <MyButton
                title={
                  <Dashboardscreenimage
                    path={require('@/assets/images/dashboard/logout.png')}
                    styles={styling.dashboardbtnimages}
                    tintColor='#2ecc71'
                  />
                }
                onPress={() => router.navigate('/(AuthScreens)/login')}
                style1={styling.button}
                style2={styling.NextBackbtntext}
              />
            </View>
          </View>
        )}

        {/* Content Area */}
        {selectedSectionState === 'home' && (
          <View>
            <ImageBackground
              source={require('@/assets/images/dashboard/Body.png')}
              style={[{ width }, styling.dashboardimage]}
            >

              <Heading title={`Welcome To \nFitpro.`} styles={styling.DashboardHeading} />
            </ImageBackground>
            <Heading title='Features' styles={styling.featureheading} />
            <View style={styling.dashbaordfeaturesmainview}>
              <View style={styling.featuresubview}>
                <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/workoutplan2.png')} styles={styling.featureimage} />} style1={styling.button} style2={styling.NextBackbtntext} onPress={handleWorkoutPress} />
                <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/Dietplan.png')} styles={styling.featureimage} />} style1={styling.button} style2={styling.NextBackbtntext} onPress={handleDietPress} />
              </View>
              <View style={styling.featuresubview}>

                <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/bot.png')} styles={styling.featurebotimage} />} style1={styling.button} style2={styling.NextBackbtntext} onPress={() => router.navigate('/AiScreens/Chatbot')} />
                {/* <MyButton title={<LogoImgForScreen path={require('@/assets/images/dashboard/Dietplan.png')} styles={styling.featureimage}/>} style1={styling.button} style2={styling.NextBackbtntext} onPress={() => router.navigate('/AiScreens/Chatbot')}/> */}
              </View>
            </View>
          </View>
        )}

        {selectedSectionState === 'watch' && (
          <View style={styling.viewpayment}>
            <View style={styling.subcontainerfornavbar}>
              <View style={styling.navbarleftside}>
                <MyButton
                  title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                  onPress={() => router.navigate('/(User)/Dashboard')}
                  style1={styling.button}
                  style2={styling.NextBackbtntext}
                />
                <Heading title={'Gym Timing'} styles={styling.HeaderText} />

              </View>

            </View>
            <View style={styling.paymentcardview}>

              <LogoImgForScreen path={require('@/assets/images/Chatbot/gymtiming.jpg')} styles={{ resizeMode: 'contain', width: '100%', height: 240 }} />
            </View>
            <GymScheduleScreen />
          </View>
        )}

        {selectedSectionState === 'payment' && (
          <View style={styling.viewpayment}>
            <View style={styling.subcontainerfornavbar}>
              <View style={styling.navbarleftside}>
                <MyButton
                  title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                  onPress={() => router.navigate('/(User)/Dashboard')}
                  style1={styling.button}
                  style2={styling.NextBackbtntext}
                />
                <Heading title={'Payment'} styles={styling.HeaderText} />
              </View>
            </View>
            <View style={styling.paymentcardview}>
              <LogoImgForScreen path={require('@/assets/images/payment/Card.png')} styles={{ resizeMode: 'contain', width: '100%' }} />
            </View>
            <PaymentForm />
          </View>
        )}

        {selectedSectionState === 'profile' && (
          <View style={styling.viewpayment}>

            <Profile />
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={[styling.dashbaordfooter, styling.line]}>
        {/* Home Button */}
        <MyButton
          title={<Dashboardscreenimage path={require('@/assets/images/dashboard/home.png')} styles={styling.dashboardfooterbtnimages} tintColor={getImageTintColor('home')} />}
          onPress={() => setSelectedSection('home')}
          style1={selectedSectionState === 'home' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
          disabled={!hasAccess}
        />
        {/* Watch Button */}
        <MyButton
          title={<Dashboardscreenimage path={require('@/assets/images/dashboard/Watch.png')} styles={styling.dashboardfooterbtnimages} tintColor={getImageTintColor('watch')} />}
          onPress={() => setSelectedSection('watch')}
          style1={selectedSectionState === 'watch' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
          disabled={!hasAccess}
        />
        {/* Payment Button */}
        <MyButton
          title={<Dashboardscreenimage path={require('@/assets/images/dashboard/payment.png')} styles={styling.dashboardfooterbtnimages} tintColor={getImageTintColor('payment')} />}
          onPress={() => setSelectedSection('payment')}
          style1={selectedSectionState === 'payment' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
        />
        {/* Profile Button */}
        <MyButton
          title={<Dashboardscreenimage path={require('@/assets/images/dashboard/profile.png')} styles={styling.dashboardfooterbtnimages} tintColor={getImageTintColor('profile')} />}
          onPress={() => setSelectedSection('profile')}
          style1={selectedSectionState === 'profile' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
          disabled={!hasAccess}
        />
      </View>

    </SafeAreaView>
  );
};

export default Dashboard;
