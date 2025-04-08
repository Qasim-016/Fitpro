import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ImageBackground, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PushNotification from 'react-native-push-notification';
import BackgroundService from 'react-native-background-actions';
import { router } from 'expo-router';
import { LogBox } from 'react-native';
import MyButton from '@/components/Buttons/MyButton';
import styling from '@/assets/Styles/styling';
import AsyncStorage from '@react-native-async-storage/async-storage';

LogBox.ignoreLogs(['@firebase/auth: Auth']);

const Workoutplan = () => {
  const { height, width } = Dimensions.get('screen');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    startBackgroundTask();
    loadNotifications();
  }, []);

  // Function to store notifications with a unique key
  const storeNotification = async (title: string, message: string) => {
    try {
      const timestamp = new Date().toISOString();
      const newNotification = {
        id: `${timestamp}_${Math.random()}`,
        title,
        message,
        timestamp,
      };

      const storedNotifications = await AsyncStorage.getItem('workout_notifications');
      const notificationsArray = storedNotifications ? JSON.parse(storedNotifications) : [];
      notificationsArray.push(newNotification);
      await AsyncStorage.setItem('workout_notifications', JSON.stringify(notificationsArray));

      setNotifications(notificationsArray);  // Update the notifications state
    } catch (error) {
      console.error('❌ Error storing notification:', error);
    }
  };

  // Function to load stored notifications
  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('workout_notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
    }
  };

  // Background task to trigger notifications at specific times
  const startBackgroundTask = async () => {
    const backgroundTask = async () => {
      console.log('✅ Background task started...');
      while (true) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        if (hours === 9 && minutes === 29 && seconds === 0) {
          sendNotification();
        }

        await BackgroundService.updateNotification({
          taskDesc: `Checking time: ${hours}:${minutes}:${seconds}`,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    try {
      await BackgroundService.start(backgroundTask, {
        taskName: 'WorkoutReminder',
        taskTitle: 'Workout Reminder Running',
        taskDesc: 'Checking time every second',
        taskIcon: { name: 'ic_launcher', type: 'mipmap' },
        color: '#FF6347',
        parameters: { delay: 1000 },
      });
    } catch (error) {
      console.error('❌ Error starting background task:', error);
    }
  };

  // Function to send a notification and store it
  const sendNotification = () => {
    PushNotification.localNotification({
      channelId: 'fitpro_channel',
      title: 'Reminder',
      message: 'It\'s Time for your workout!',
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
    });

    console.log('🚀 Notification sent!');
    storeNotification('Workout Reminder', 'It\'s Time for your workout!');
  };

  return (
    <SafeAreaView style={styling.container}>
      <View style={{ flex: 1 }}>
        <ImageBackground source={require('@/assets/User/Workout.png')} style={{ width, height }} resizeMode="cover">
          <View style={[styling.Workoutcontainer, styling.Gap]}>
            <MyButton title="Predefined" onPress={() => router.push('/(User)/WorkoutNormal')} style1={styling.freetrialbtn} style2={styling.FreeTrialText} />
            <MyButton title="Customized" onPress={() => router.push('/CustomizedWorkout')} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Workoutplan;
