import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import MyButton from "@/components/Buttons/MyButton";
import styling from "@/assets/Styles/styling";
import Heading from "@/components/Text/Heading";
import LogoImgForScreen from "@/components/ScreenImages/LogoImgForScreen";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const notificationsData = [
  { id: "1", title: "Welcome Shahwaiz", time: "2 weeks ago", type: "general" },
  { id: "2", title: "New Nutrition Plan Added", time: "2 months ago", type: "general" },
  { id: "3", title: "Pending Payment", time: "Yesterday", type: "important" },
  { id: "4", title: "New Fitness Program Added", time: "5 days ago", type: "general" },
  { id: "5", title: "Updated Privacy Policy", time: "2 days ago", type: "general" },
  { id: "6", title: "Payment Successful", time: "3 weeks ago", type: "general" },
];
const Gotonotifications = () => {
  const [filter, setFilter] = useState("all");

  const filterNotifications = () => {
    if (filter === "unread") return notificationsData.filter(n => n.type !== "read");
    if (filter === "important") return notificationsData.filter(n => n.type === "important");
    return notificationsData;
  };

  return (
    <SafeAreaView style={styling.profilecontainer}>
      {/* <View style={styling.Backbtn}>
        <MyButton
          title={<LogoImgForScreen path={require('@/assets/images/nextback/back.png')} styles={styling.NextBackbtnimage} />}
          onPress={() => router.back()}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Forgot Password" styles={styling.HeaderText} />
      </View>      */}
      <View style ={styles.header}>
        <MyButton title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage}/>}
        onPress={()=>router.back()}
        style1={styling.button}
        style2={styling.NextBackbtntext}/>
        <Heading title="Notifications" styles={styling.HeaderText}/>
      </View>
       <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => setFilter("all")}
        >
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "unread" && styles.activeFilter]}
          onPress={() => setFilter("unread")}
        >
          <Text>Unread</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "important" && styles.activeFilter]}
          onPress={() => setFilter("important")}
        >
          <Text>Important</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.notificationcontainer}>

      <FlatList
        data={filterNotifications()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.notificationCard, item.type === "important" && styles.importantNotification]}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
          </View>
        )}
        />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  header: { fontSize: 20, fontWeight: "bold",flexDirection:'row', paddingLeft:10,columnGap:10 },
  filterContainer: { flexDirection: "row",padding:20,columnGap:10 },
  notificationcontainer:{
    paddingHorizontal:20
  },
  filterButton: { paddingHorizontal:10, borderRadius: 5,borderWidth:1,borderColor:'#2ecc71' },
  activeFilter: { backgroundColor: "#2ecc71", color: "white" },
  notificationCard: { padding: 15,  borderRadius: 8, marginBottom: 10,borderWidth:1,borderColor:'#2ecc71',height:100 },
  importantNotification: { borderColor: "red", borderWidth: 2 },
  notificationHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  notificationTitle: { fontSize: 16, fontWeight: "bold" },
  notificationTime: { fontSize: 12, color: "gray" },
});

export default Gotonotifications