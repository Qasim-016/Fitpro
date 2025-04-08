import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import MyButton from '@/components/Buttons/MyButton';
import styling from '@/assets/Styles/styling';
import { router } from 'expo-router';
import axios from 'axios'; // Import axios to make the API request
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Heading from '@/components/Text/Heading';
import { getAuth } from 'firebase/auth';
import { Alert } from 'react-native';
// import Paragraph from '@/components/Text/Paragraph';
import { SERVER_IP } from '../config';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWebSocket } from '../WebSocketContext';
const Paragraph = ({ paragraph }: { paragraph: string }) => {

    const parts = paragraph.split(' '); // Split the paragraph into parts by spaces



    return (
        <View style={styles.paragraphContainer}>
            {parts.map((word, index) => {
                // Apply green color to "Diet" and "Workout"
                if (word === 'Diet' || word === 'Workout' || word === 'plan?') {
                    return (
                        <Text key={index} style={styles.greenText}>
                            {word}{' '}
                        </Text>
                    );
                }
                // Apply black color to all other words
                return (
                    <Text key={index} style={styles.blackText}>
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
                } else {
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






    const [prevGymStatus, setPrevGymStatus] = useState<string | null>(null);

    const fetchGymSchedule = async () => {
        try {
            const response = await axios.get(`http://${SERVER_IP}:5000/api/gym-schedule`);
            const today = moment().format('dddd'); // Get current day (e.g., 'Monday')
            const todaySchedule = response.data.find((schedule: GymScheduleItem) => schedule.day === today);

            if (todaySchedule) {
                setGymSchedule(todaySchedule);

                setPrevGymStatus((prevStatus) => {
                    // console.log('Previous Status:', prevStatus);
                    // console.log('New Status:', todaySchedule.status);

                    // 🔹 Send notification **only if the status changes**
                    if (prevStatus !== todaySchedule.status) {
                        if (prevStatus === 'The gym is Closed' && todaySchedule.status === 'The gym is Opened') {
                            sendGymNotification('Gym is Open!', 'The gym is now open. Come and start your workout!');
                        } else if (prevStatus === 'The gym is Opened' && todaySchedule.status === 'The gym is Closed') {
                            sendGymNotification('Gym is Closed', 'The gym is now closed. See you next time!');
                        }
                    }

                    return todaySchedule.status; // ✅ Update prevGymStatus correctly
                });
            } else {
                setGymSchedule(null);
                setError('No schedule found for today');
            }
        } catch (error) {
            console.error('Error fetching gym schedule:', error);
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

    // 🔄 Auto-Check Gym Status Every 1 Minute
    useEffect(() => {
        fetchGymSchedule(); // Fetch on mount
        const interval = setInterval(fetchGymSchedule, 600); // Fetch every 1 min
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // 🔄 Auto-Check Gym Status Every 1 Minute




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
                }
            }
            else {
                router.push('/(User)/Dietplan'); // If no plan exists, navigate to WorkoutPlan
            }
        } catch (error) {
            Alert.alert('no data')
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
    }, []); // Empty dependency array means this will run once after the component mounts
    // const { socket } = useWebSocket();

    // useEffect(() => {
    //     if (socket) {
    //         socket.on('message', (data) => {
    //             console.log('📩 Message received in GymSchedule:', data);
    //         });
    //     }
    // }, [socket]);
    return (
        <View style={styles.container}>
            <Text style={styling.featureheadingtiming}>{currentDate}</Text>

            {/* Display gym schedule for today */}
            <View style={styles.scheduleContainer}>
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : gymSchedule ? (
                    <View style={styles.scheduleItem}>
                        {/* <Text>{gymSchedule.startTime} - {gymSchedule.endTime}</Text> */}
                        <Text style={styles.statusText}>{gymSchedule.status ? gymSchedule.status : 'No status available'}</Text>
                        <View style={styles.timing}>
                            <Heading title='From' styles={styling.featureheadingtiming} />

                            <View>

                                <MyButton title={gymSchedule.startTime ? gymSchedule.startTime : '-'} onPress={() => router} style1={styles.buton} style2={styles.btntext} />
                            </View>
                            <Heading title='to' styles={styling.featureheadingtiming} />

                            <View>

                                <MyButton title={gymSchedule.endTime ? gymSchedule.endTime : '-'} onPress={() => router} style1={styles.buton} style2={styles.btntext} />
                            </View>
                        </View>

                    </View>
                ) : (
                    <Text>Loading today's gym schedule...</Text>
                )}
            </View>

            <View style={styles.GymtimingbuttonContainer}>
                <Paragraph paragraph='Want to know about Workout and Diet plan?' />
                {/* <Text>Want to know about Diet and Workout Plan?</Text> */}
                <MyButton title={'Diet Plan'} onPress={handleDietPress} style1={styling.FullwidthWhitebtn} style2={styling.FreeTrialText} />
                <MyButton title={'Workout Plan'} onPress={handleWorkoutPress} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    dateText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    }, textview: {
        // flex:1,
        width: 150, height: 50, borderWidth: 2, borderColor: '#2ecc71', textAlign: 'center', color: '#333'
    },
    statusText: {
        fontSize: 18,
        color: '#2ecc71',
        marginBottom: 20,
    },
    scheduleContainer: {
        flex: 1, justifyContent: 'center', borderWidth: 2, borderColor: '#2ecc71', marginBottom: 10, paddingHorizontal: 10,
        // marginBottom: 20,

    }, buton: {
        width: 80, borderWidth: 2, borderColor: '#2ecc71', alignItems: 'center', height: 50, justifyContent: 'center'
    }, btntext: {
        color: 'black', fontWeight: 'bold', fontSize: 16
    },
    scheduleItem: {
        marginBottom: 10,
        fontSize: 16,
        color: '#333'
    }, timing: {
        flexDirection: 'row', gap: 10
    },
    GymtimingbuttonContainer: {
        marginBottom: 150,
        flex: 1,
        flexDirection: 'column',
        // justifyContent: 'center',
        alignItems: 'center',
        rowGap: 10,
        width: '100%',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    }, greenText: {
        color: '#2ecc71', fontWeight: 'bold', fontSize: 16,
    },
    blackText: {
        color: 'black', fontSize: 16,
    }, paragraphContainer: {
        flexDirection: 'row', // Set to 'row' for horizontal text display
        flexWrap: 'wrap', // Allows wrapping in case text overflows
        alignItems: 'center',
        // marginBottom: 20,
    },
});

export default GymScheduleScreen;



