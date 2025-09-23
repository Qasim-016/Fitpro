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
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    fetchUserData();
    checkTrialAndSubscriptionStatus();
  
    const interval = setInterval(() => {
      fetchUserData(); // ✅ Call this inside interval too
      checkTrialAndSubscriptionStatus();
    }, 1000); // every 1 second
  
    return () => clearInterval(interval);
  }, []);
  

  const fetchUserData = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        const response = await axios.get(`${SERVER_IP}/api/auth/getUserdata`, {
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

      //Check trial status first
      try {
        const trialResponse = await axios.get(`${SERVER_IP}/api/trial/${userId}`);
        if (trialResponse.data.trialStatus === 'active') {
          setHasAccess(true);
          return; // Exit early
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
        } else {
          return;
        }
      }

      //If no active trial, check subscription
      try {
        const subscriptionResponse = await axios.get(`${SERVER_IP}/api/subscription/${userId}`);
        const subscriptionData = subscriptionResponse.data;

        const currentTime = Date.now();
        const isSubscriptionActive = subscriptionData.subscriptionEndTime > currentTime;

        if (isSubscriptionActive) {
          setHasAccess(true);
          return; // Exit early
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
        } else {
          console.error("Error checking subscription:", error);
          return;
        }
      }
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
      const response = await axios.get(`${SERVER_IP}/api/workout/getWorkoutPlan`, {
        headers: { Authorization: token }
      });

      if (response.data && response.data.workoutPlan) {
        const { level, goal } = response.data.workoutPlan;

        console.log('User Workout Plan:', level, goal); 

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
        router.push('/(User)/Workoutplan');
      }
    } catch (error: any) {
      router.push('/(User)/Workoutplan');
    }
  };


  
   const handleDietPress = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            Alert.alert('Error', 'You must be logged in to save your diet plan.');
            return;
        }
       
        try {
          const token = await user.getIdToken();
          const response = await axios.get(`${SERVER_IP}/api/diet/getDietPlan`, {
            headers: { Authorization: token }
          });
            if (response.data && response.data.dietPlan) {
              const { gender, height, level, duration, goal, currentWeight } = response.data.dietPlan;
              const heightNum = Number(height);
              const currentWeightNum = Number(currentWeight);
            if (goal === 'Weight Gain') {

                if (gender === 'Male' || gender === 'Other') {
                    
                    if (heightNum < 170 &&
                        currentWeightNum <=40
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=40) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <=45
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=45) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <=50
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=50) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=55
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=55) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=65
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=65) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <=70
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=70) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                    }
                }

                else if (heightNum < 170 &&
                    currentWeightNum <=75
                ) {
                    if (level === '1-3 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2800');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2900');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C3000');
                            return;
                        }
                    } else if (level === '4-5 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2900');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C3000');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C3100');
                            return;
                        }
                    }
                    else if (level === '5-6 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C3000');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C3100');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C3200');
                            return;
                        }
                    }
                }
                else if (
                    heightNum < 190 &&
                    currentWeightNum <=75) {
                    if (level === '1-3 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2900');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C3000');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C3100');
                            return;
                        }
                    }
                    else if (level === '4-5 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C3000');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C3100');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C3200');
                            return;
                        }
                    }
                    else if (level === '5-6 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C3100');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C3200');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C3300');
                            return;
                        }
                }
            }


                    else if (heightNum < 170 &&
                        currentWeightNum <=80
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                    }
                       else if( heightNum < 190 &&
                        currentWeightNum <=80) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <=85
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                    }
                       else if( heightNum < 190 &&
                        currentWeightNum <=85) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <=90
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=90){
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                    }




                   else if (heightNum < 170 &&
                        currentWeightNum <=95
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=95) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <=100
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=100) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
    
                    }
                        }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                    }



                    else if (
                        heightNum < 170 &&
                        currentWeightNum <=110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                    }




                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C5000');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C5000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C5000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C5100');
                                return;
                            }
                        }
                    }
                
                }

                if (gender === 'Female') {
                    
                    if (heightNum < 170 &&
                        currentWeightNum <=40
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=40) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <=45
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=45) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <=50
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=50) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=55
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=55) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=65
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=65) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <=70
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=70) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                    }
                }

                else if (heightNum < 170 &&
                    currentWeightNum <=75
                ) {
                    if (level === '1-3 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2700');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2800');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2900');
                            return;
                        }
                    } else if (level === '4-5 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2800');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2900');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C3000');
                            return;
                        }
                    }
                    else if (level === '5-6 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2900');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C3000');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C3100');
                            return;
                        }
                    }
                }
                else if (
                    heightNum < 190 &&
                    currentWeightNum <=75) {
                    if (level === '1-3 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2800');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2900');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C3000');
                            return;
                        }
                    }
                    else if (level === '4-5 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2900');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C3000');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C3100');
                            return;
                        }
                    }
                    else if (level === '5-6 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C3000');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C3100');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C3200');
                            return;
                        }
                }
            }


                    else if (heightNum < 170 &&
                        currentWeightNum <=80
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                    }
                       else if( heightNum < 190 &&
                        currentWeightNum <=80) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <=85
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                    }
                       else if( heightNum < 190 &&
                        currentWeightNum <=85) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <=90
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=90){
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                    }




                   else if (heightNum < 170 &&
                        currentWeightNum <=95
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=95) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <=100
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=100) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
    
                    }
                        }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                        }
                    }



                    else if (
                        heightNum < 170 &&
                        currentWeightNum <=110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                    }




                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C5000');
                                return;
                            }
                        }
                    }
                }
            }


            

            if (goal === 'Weight loss') {

                if (gender === 'Male' || gender === 'Other') {


                    if (heightNum < 170 &&
                        currentWeightNum <=40
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=40) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <=45
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=45) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <=50
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=50) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=55
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=55) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=65
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=65) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <=70
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=70) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                    }
                }

                else if (heightNum < 170 &&
                    currentWeightNum <=75
                ) {
                    if (level === '1-3 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2400');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2300');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2200');
                            return;
                        }
                    } else if (level === '4-5 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2500');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2400');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2300');
                            return;
                        }
                    }
                    else if (level === '5-6 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2600');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2500');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2400');
                            return;
                        }
                    }
                }
                else if (
                    heightNum < 190 &&
                    currentWeightNum <=75) {
                    if (level === '1-3 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2500');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2400');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2300');
                            return;
                        }
                    }
                    else if (level === '4-5 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2600');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2500');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2400');
                            return;
                        }
                    }
                    else if (level === '5-6 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2700');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2600');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2500');
                            return;
                        }
                }
            }


                    else if (heightNum < 170 &&
                        currentWeightNum <=80
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                    }
                       else if( heightNum < 190 &&
                        currentWeightNum <=80) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <=85
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                    }
                       else if( heightNum < 190 &&
                        currentWeightNum <=85) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <=90
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=90){
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                    }




                   else if (heightNum < 170 &&
                        currentWeightNum <=95
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=95) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <=100
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=100) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
    
                    }
                        }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                    }



                    else if (
                        heightNum < 170 &&
                        currentWeightNum <=110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                    }




                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                    }

                }

                if (gender === 'Female') {

                    if (heightNum < 170 &&
                        currentWeightNum <=40
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=40) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <=45
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=45) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <=50
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=50) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=55
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=55) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <=65
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=65) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <=70
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=70) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                    }
                }

                else if (heightNum < 170 &&
                    currentWeightNum <=75
                ) {
                    if (level === '1-3 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2300');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2200');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2100');
                            return;
                        }
                    } else if (level === '4-5 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2400');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2300');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2200');
                            return;
                        }
                    }
                    else if (level === '5-6 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2500');
                            return;
                        } else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2400');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2300');
                            return;
                        }
                    }
                }
                else if (
                    heightNum < 190 &&
                    currentWeightNum <=75) {
                    if (level === '1-3 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2400');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2300');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2200');
                            return;
                        }
                    }
                    else if (level === '4-5 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2500');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2400');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2300');
                            return;
                        }
                    }
                    else if (level === '5-6 Times') {
                        if (duration === '0.5kg') {
                            router.push('/CustomizedDiet/C2600');
                            return;
                        }
                        else if (duration === '1kg') {
                            router.push('/CustomizedDiet/C2500');
                            return;
                        }
                        else if (duration === '1.5kg') {
                            router.push('/CustomizedDiet/C2400');
                            return;
                        }
                }
            }


                    else if (heightNum < 170 &&
                        currentWeightNum <=80
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                    }
                       else if( heightNum < 190 &&
                        currentWeightNum <=80) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <=85
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                    }
                       else if( heightNum < 190 &&
                        currentWeightNum <=85) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <=90
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=90){
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                    }




                   else if (heightNum < 170 &&
                        currentWeightNum <=95
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=95) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <=100
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=100) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
    
                    }
                        }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                    }



                    else if (
                        heightNum < 170 &&
                        currentWeightNum <=110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <=110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                    }




                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                    }

                }
            
            }}
            else {
              router.push('/(User)/Dietplan'); // If no plan exists, navigate to DietPlan
            }
        } catch (error) {
            router.push('/(User)/Dietplan'); // If no plan exists, navigate to DietPlan
          
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
                    path={require('@/assets/images/Usersite/nn.png')}
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
                  onPress={() => {setSelectedSection('home')}}
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
                  onPress={() => {setSelectedSection('home')}}
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
          title={<Dashboardscreenimage path={require('@/assets/images/dashboard/clocks.png')} styles={styling.dashboardfooterbtnimages} tintColor={getImageTintColor('watch')} />}
          onPress={() => setSelectedSection('watch')}
          style1={selectedSectionState === 'watch' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
          disabled={!hasAccess}
        />
        {/* Payment Button */}
        <MyButton
          title={<Dashboardscreenimage path={require('@/assets/images/dashboard/cards.png')} styles={styling.dashboardfooterbtnimages} tintColor={getImageTintColor('payment')} />}
          onPress={() => setSelectedSection('payment')}
          style1={selectedSectionState === 'payment' ? styling.selectedButton : styling.button1}
          style2={styling.NextBackbtntext}
        />
        {/* Profile Button */}
        <MyButton
          title={<Dashboardscreenimage path={require('@/assets/images/dashboard/p.png')} styles={styling.dashboardfooterbtnimages} tintColor={getImageTintColor('profile')} />}
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
