import React, { useEffect, useState } from 'react';
import { View, Dimensions, ImageBackground, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PushNotification from 'react-native-push-notification';
import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import styling from '@/assets/Styles/styling';
import MyButton from '@/components/Buttons/MyButton';

type DietNotification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
};

const Dietplan = () => {
  const { height, width } = Dimensions.get('screen');
  const [notifications, setNotifications] = useState<DietNotification[]>([]);

  useEffect(() => {
    startBackgroundTask();
    loadNotifications();
  }, []);

  const storeNotification = async (title: string, message: string) => {
    try {
      const timestamp = new Date().toISOString();
      const newNotification: DietNotification = { id: `${timestamp}_${Math.random()}`, title, message, timestamp };

      const storedNotifications = await AsyncStorage.getItem('diet_notifications');
      const notificationsArray: DietNotification[] = storedNotifications ? JSON.parse(storedNotifications) : [];
      notificationsArray.push(newNotification);
      await AsyncStorage.setItem('diet_notifications', JSON.stringify(notificationsArray));

      setNotifications(notificationsArray);
    } catch (error) {
      console.error('❌ Error storing notification:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('diet_notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
    }
  };

  const startBackgroundTask = async () => {
    const backgroundTask = async () => {
      console.log('✅ Diet Plan Background Task Started...');
      while (true) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        if (hours === 10 && minutes === 43 && seconds === 0) {
          sendNotification('Breakfast Time 🍳', 'Start your day with a healthy breakfast!');
        } else if (hours === 12 && minutes === 0 && seconds === 0) {
          sendNotification('Mid-Morning Snack 🍪', 'Time for a healthy snack to keep you going!');
        } else if (hours === 13 && minutes === 0 && seconds === 0) {
          sendNotification('Lunch Time 🍛', 'Fuel up with a nutritious lunch!');
        } else if (hours === 17 && minutes === 0 && seconds === 0) {
          sendNotification('Evening Snack 🥤', 'Time for a light snack before dinner!');
        } else if (hours === 20 && minutes === 0 && seconds === 0) {
          sendNotification('Dinner Time 🍽️', 'End your day with a balanced dinner!');
        }
        

        await BackgroundService.updateNotification({
          taskDesc: `Checking time: ${hours}:${minutes}:${seconds}`,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    try {
      await BackgroundService.start(backgroundTask, {
        taskName: 'DietReminder',
        taskTitle: 'Diet Reminder Running',
        taskDesc: 'Checking meal times',
        taskIcon: { name: 'ic_launcher', type: 'mipmap' },
        color: '#FF6347',
        parameters: { delay: 1000 },
      });
    } catch (error) {
      console.error('❌ Error starting diet background task:', error);
    }
  };

  const sendNotification = (title: string, message: string) => {
    PushNotification.localNotification({
      channelId: 'fitpro_channel',
      title,
      message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
    });

    console.log(`🚀 Notification Sent: ${title}`);
    storeNotification(title, message);
  };

  return (
    <SafeAreaView style={styling.container}>
      <ImageBackground source={require('@/assets/User/diet.png')} style={{ width, height }} resizeMode="cover">
        <View style={[styling.container, styling.Gap]}>
          <MyButton title="Predefined" onPress={() => router.push('/DietNormal')} style1={styling.freetrialbtn} style2={styling.FreeTrialText} />
          <MyButton title="Customized" onPress={() => router.push('/(User)/CustomizedDiet')} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
          
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Dietplan;
