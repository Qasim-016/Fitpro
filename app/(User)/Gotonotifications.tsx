import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth"; // Firebase Auth
import MyButton from "@/components/Buttons/MyButton";
import styling from "@/assets/Styles/styling";
import Heading from "@/components/Text/Heading";
import LogoImgForScreen from "@/components/ScreenImages/LogoImgForScreen";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ Define Notification Type
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  type: string; // Type of notification (e.g., gym, workout, diet)
}

const Gotonotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const auth = getAuth(); // Initialize Firebase Auth

  // 🔹 Fetch Notifications from AsyncStorage
  const fetchNotifications = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return; // Ensure user is logged in
  
      const userId = user.uid;
  
      const allNotifications: Notification[] = [];
  
      // Fetch login notifications and assign a unique ID
      const storedLoginNotification = await AsyncStorage.getItem(`notifications_${userId}`);
      if (storedLoginNotification) {
        const loginNotification: Notification[] = JSON.parse(storedLoginNotification);
        loginNotification.forEach((item, index) => {
          item.id = `login_${item.timestamp}_${index}`; // Unique ID based on timestamp and index
          item.type = 'login'; // Type for login notifications
          allNotifications.push(item);
        });
      }
  
      // Fetch other notifications (gym, workout, diet)
      const storedGymNotifications = await AsyncStorage.getItem('notifications_gym');
      const storedWorkoutNotifications = await AsyncStorage.getItem('workout_notifications');
      const storedDietNotifications = await AsyncStorage.getItem('diet_notifications');
  
      // Process gym notifications
      if (storedGymNotifications) {
        const gymNotifications: Notification[] = JSON.parse(storedGymNotifications);
        gymNotifications.forEach((item, index) => {
          item.id = `gym_${item.timestamp}_${index}`; // Unique ID for gym notifications
          item.type = 'gym';
          allNotifications.push(item);
        });
      }
  
      // Process workout notifications
      if (storedWorkoutNotifications) {
        const workoutNotifications: Notification[] = JSON.parse(storedWorkoutNotifications);
        workoutNotifications.forEach((item, index) => {
          item.id = `workout_${item.timestamp}_${index}`; // Unique ID for workout notifications
          item.type = 'workout';
          allNotifications.push(item);
        });
      }
  
      // Process diet notifications
      if (storedDietNotifications) {
        const dietNotifications: Notification[] = JSON.parse(storedDietNotifications);
        dietNotifications.forEach((item, index) => {
          item.id = `diet_${item.timestamp}_${index}`; // Unique ID for diet notifications
          item.type = 'diet';
          allNotifications.push(item);
        });
      }
  
      // ✅ Log the notifications before sorting
  
      // ✅ Convert ISO string timestamps to Date and sort notifications by timestamp (latest first)
      const sortedNotifications = [...allNotifications].sort((a, b) => {
        const timestampA = new Date(a.timestamp).getTime(); // Convert to milliseconds
        const timestampB = new Date(b.timestamp).getTime(); // Convert to milliseconds
        return timestampB - timestampA; // Sort descending (latest first)
      });
  
      // ✅ Log the notifications after sorting
  
      // Set sorted notifications in state
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <SafeAreaView style={styling.profilecontainer}>
      <View style={styles.header}>
        <MyButton
          title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
          onPress={() => router.back()}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Notifications" styles={styling.HeaderText} />
      </View>

      {/* ✅ Ensure proper scrolling by setting flex: 1 */}
      <View style={styles.notificationContainer}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id} // Ensure each notification has a unique ID
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>

              {/* ✅ Timestamp at bottom right */}
              <Text style={styles.notificationTime}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }} // ✅ Prevents last item from being cut off
          showsVerticalScrollIndicator={true} // ✅ Shows scrollbar
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  header: { flexDirection: 'row', paddingLeft: 10, columnGap: 10 },
  notificationContainer: { flex: 1, paddingHorizontal: 20 }, // ✅ Ensures scrolling works properly
  notificationCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2ecc71',
    position: 'relative' // ✅ Allows absolute positioning for timestamp
  },
  notificationTitle: { fontSize: 16, fontWeight: "bold" },
  notificationMessage: { marginTop: 5, fontSize: 14, color: "#333" },
  notificationTime: {
    fontSize: 12,
    color: "gray",
    position: "absolute", // ✅ Positions timestamp at the bottom right
    bottom: 5,
    right: 10,
  },
});

export default Gotonotifications;



