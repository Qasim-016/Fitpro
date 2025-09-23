import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import MyButton from '@/components/Buttons/MyButton';
import styling from '@/assets/Styles/styling';
import { router } from 'expo-router';
import axios from 'axios'; // Import axios to make the API request
import Heading from '@/components/Text/Heading';
import { getAuth } from 'firebase/auth';
import { Alert } from 'react-native';
import { SERVER_IP } from '../config';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Paragraph = ({ paragraph }: { paragraph: string }) => {

    const parts = paragraph.split(' '); // Split the paragraph into parts by space



    return (
        <View style={styling.paragraphContainerG}>
            {parts.map((word, index) => {
                // Apply green color to "Diet" and "Workout"
                if (word === 'Diet' || word === 'Workout' || word === 'plan?') {
                    return (
                        <Text key={index} style={styling.greenTextG}>
                            {word}{' '}
                        </Text>
                    );
                }
                // Apply black color to all other words
                return (
                    <Text key={index} style={styling.blackTextG}>
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
    const handleWorkoutPress = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            Alert.alert('Error', 'You must be logged in.');
            return;
        }

        try {
            const token = await user.getIdToken();
            const response = await axios.get(`http://${SERVER_IP}:5000/api/workout/getWorkoutPlan`, {
                headers: { Authorization: token }
            });

            if (response.data && response.data.workoutPlan) {
                const { level, goal } = response.data.workoutPlan;

                console.log('User Workout Plan:', level, goal); // Debugging

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
                } else {
                    router.push('/CustomizedWorkout/ProLoss');
                    return;
                }
            } else {
                router.push('/(User)/Workoutplan'); // If no plan exists, navigate to WorkoutPlan
            }
        } catch (error: any) {
            router.push('/(User)/Workoutplan'); // If error, redirect to WorkoutPlan
        }
    };






    const [prevGymStatus, setPrevGymStatus] = useState<string | null>(null);

    const fetchGymSchedule = async () => {
        try {
            const response = await axios.get(`${SERVER_IP}/api/gym-schedule`);
            const today = moment().format('dddd'); // Get current day (e.g., 'Monday')
            const todaySchedule = response.data.find((schedule: GymScheduleItem) => schedule.day === today);

            if (todaySchedule) {
                setGymSchedule(todaySchedule);

                setPrevGymStatus((prevStatus) => {
                    if (prevStatus !== todaySchedule.status) {
                        if (prevStatus === 'The gym is Closed' && todaySchedule.status === 'The gym is Opened') {
                            sendGymNotification('Gym is Open!', 'The gym is now open. Come and start your workout!');
                        } else if (prevStatus === 'The gym is Opened' && todaySchedule.status === 'The gym is Closed') {
                            sendGymNotification('Gym is Closed', 'The gym is now closed. See you next time!');
                        }
                    }

                    return todaySchedule.status;
                });
            } else {
                setGymSchedule(null);
                setError('No schedule found for today');
            }
        } catch (error) {
            setError('Error fetching gym schedule');
        }
    };

    // 🔔 Function to Send Notifications
    const sendGymNotification = async (title: string, message: string) => {
        console.log('🔔 Sending Notification:', title, message);

        PushNotification.localNotification({
            channelId: 'fitpro_channel', // Ensure this channel exists
            title: title,
            message: message,
            playSound: true,
            soundName: 'default',
            importance: 'high',
            priority: 'high',
            vibrate: true,
        });

        // 🔹 Store Notification in AsyncStorage
        try {
            const existingNotifications = await AsyncStorage.getItem('notifications_gym');
            const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
            notifications.push({ id: Date.now().toString(), title, message, timestamp: new Date().toISOString() });
            await AsyncStorage.setItem('notifications_gym', JSON.stringify(notifications));
        } catch (error) {
            console.error('Error storing notification:', error);
        }
    };

    useEffect(() => {
        fetchGymSchedule(); // Fetch on mount
        const interval = setInterval(fetchGymSchedule, 600); // Fetch every 1 min
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);


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
                            currentWeightNum <= 40
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
                            currentWeightNum <= 40) {
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
                            currentWeightNum <= 45
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
                            currentWeightNum <= 45) {
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
                            currentWeightNum <= 50
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
                            currentWeightNum <= 50) {
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
                            currentWeightNum <= 55
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
                            currentWeightNum <= 55) {
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
                            currentWeightNum <= 60
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
                            currentWeightNum <= 60) {
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
                            currentWeightNum <= 65
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
                            currentWeightNum <= 65) {
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
                            currentWeightNum <= 70
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
                            currentWeightNum <= 70) {
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
                            currentWeightNum <= 75
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
                            currentWeightNum <= 75) {
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
                            currentWeightNum <= 80
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
                        else if (heightNum < 190 &&
                            currentWeightNum <= 80) {
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
                            currentWeightNum <= 85
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
                        else if (heightNum < 190 &&
                            currentWeightNum <= 85) {
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
                            currentWeightNum <= 90
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
                            currentWeightNum <= 90) {
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
                            currentWeightNum <= 95
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
                            currentWeightNum <= 95) {
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
                            currentWeightNum <= 100
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
                            currentWeightNum <= 100) {
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
                            currentWeightNum <= 105) {
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
                            currentWeightNum <= 110) {
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
                            currentWeightNum <= 110) {
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
                            currentWeightNum <= 40
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
                            currentWeightNum <= 40) {
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
                            currentWeightNum <= 45
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
                            currentWeightNum <= 45) {
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
                            currentWeightNum <= 50
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
                            currentWeightNum <= 50) {
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
                            currentWeightNum <= 55
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
                            currentWeightNum <= 55) {
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
                            currentWeightNum <= 60
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
                            currentWeightNum <= 60) {
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
                            currentWeightNum <= 65
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
                            currentWeightNum <= 65) {
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
                            currentWeightNum <= 70
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
                            currentWeightNum <= 70) {
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
                            currentWeightNum <= 75
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
                            currentWeightNum <= 75) {
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
                            currentWeightNum <= 80
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
                        else if (heightNum < 190 &&
                            currentWeightNum <= 80) {
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
                            currentWeightNum <= 85
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
                        else if (heightNum < 190 &&
                            currentWeightNum <= 85) {
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
                            currentWeightNum <= 90
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
                            currentWeightNum <= 90) {
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
                            currentWeightNum <= 95
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
                            currentWeightNum <= 95) {
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
                            currentWeightNum <= 100
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
                            currentWeightNum <= 100) {
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
                            heightNum < 170 &&
                            currentWeightNum <= 110) {
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
                            currentWeightNum <= 110) {
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
                            currentWeightNum <= 40
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
                            currentWeightNum <= 40) {
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
                            currentWeightNum <= 45
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
                            currentWeightNum <= 45) {
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
                            currentWeightNum <= 50
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
                            currentWeightNum <= 50) {
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
                            currentWeightNum <= 55
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
                            currentWeightNum <= 55) {
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
                            currentWeightNum <= 60
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
                            currentWeightNum <= 60) {
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
                            currentWeightNum <= 65
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
                            currentWeightNum <= 65) {
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
                            currentWeightNum <= 70
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
                            currentWeightNum <= 70) {
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
                            currentWeightNum <= 75
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
                            currentWeightNum <= 75) {
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
                            currentWeightNum <= 80
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
                        else if (heightNum < 190 &&
                            currentWeightNum <= 80) {
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
                            currentWeightNum <= 85
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
                        else if (heightNum < 190 &&
                            currentWeightNum <= 85) {
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
                            currentWeightNum <= 90
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
                            currentWeightNum <= 90) {
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
                            currentWeightNum <= 95
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
                            currentWeightNum <= 95) {
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
                            currentWeightNum <= 100
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
                            currentWeightNum <= 100) {
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
                            currentWeightNum <= 105) {
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
                            currentWeightNum <= 110) {
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
                            currentWeightNum <= 110) {
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
                            currentWeightNum <= 40
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
                            currentWeightNum <= 40) {
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
                            currentWeightNum <= 45
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
                            currentWeightNum <= 45) {
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
                            currentWeightNum <= 50
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
                            currentWeightNum <= 50) {
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
                            currentWeightNum <= 55
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
                            currentWeightNum <= 55) {
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
                            currentWeightNum <= 60
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
                            currentWeightNum <= 60) {
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
                            currentWeightNum <= 65
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
                            currentWeightNum <= 65) {
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
                            currentWeightNum <= 70
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
                            currentWeightNum <= 70) {
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
                            currentWeightNum <= 75
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
                            currentWeightNum <= 75) {
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
                            currentWeightNum <= 80
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
                        else if (heightNum < 190 &&
                            currentWeightNum <= 80) {
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
                            currentWeightNum <= 85
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
                        else if (heightNum < 190 &&
                            currentWeightNum <= 85) {
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
                            currentWeightNum <= 90
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
                            currentWeightNum <= 90) {
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
                            currentWeightNum <= 95
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
                            currentWeightNum <= 95) {
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
                            currentWeightNum <= 100
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
                            currentWeightNum <= 100) {
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
                            heightNum < 170 &&
                            currentWeightNum <= 110) {
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
                            currentWeightNum <= 110) {
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
                    }
                }
                else {
                    router.push('/(User)/Dietplan'); // If no plan exists, navigate to WorkoutPlan
                }
            } catch (error) {
                router.push('/(User)/Dietplan'); // If no plan exists, navigate to WorkoutPlan

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
        }, []);
        return (
            <View style={styling.containerG}>
                <Text style={styling.featureheadingtiming}>{currentDate}</Text>

                <View style={styling.scheduleContainerG}>
                    {error ? (
                        <Text style={styling.errorTextG}>{error}</Text>
                    ) : gymSchedule ? (
                        <View style={styling.scheduleItemG}>
                            <Text style={styling.statusTextG}>{gymSchedule.status ? gymSchedule.status : 'No status available'}</Text>
                            <View style={styling.timingG}>
                                <Heading title='From' styles={styling.featureheadingtiming} />

                                <View>

                                    <MyButton title={gymSchedule.startTime ? gymSchedule.startTime : '-'} onPress={() => router} style1={styling.butonG} style2={styling.btntextG} />
                                </View>
                                <Heading title='to' styles={styling.featureheadingtiming} />

                                <View>

                                    <MyButton title={gymSchedule.endTime ? gymSchedule.endTime : '-'} onPress={() => router} style1={styling.butonG} style2={styling.btntextG} />
                                </View>
                            </View>

                        </View>
                    ) : (
                        <Text>Loading today's gym schedule...</Text>
                    )}
                </View>

                <View style={styling.GymtimingbuttonContainerG}>
                    <Paragraph paragraph='Want to know about Workout and Diet plan?' />
                    {/* <Text>Want to know about Diet and Workout Plan?</Text> */}
                    <MyButton title={'Diet Plan'} onPress={handleDietPress} style1={styling.FullwidthWhitebtn} style2={styling.FreeTrialText} />
                    <MyButton title={'Workout Plan'} onPress={handleWorkoutPress} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
                </View>
            </View>
        );
    };


    export default GymScheduleScreen;



