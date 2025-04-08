import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import styling from '@/assets/Styles/styling'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { auth } from '../(AuthScreens)/firebaseConfig'
import { SERVER_IP } from '../config'
const AccountSettings = () => {
  const [userData, setUserData] = useState<{ username: string; email: string; phone: number; password: string } | null>(null);
  useEffect(() => {
    fetchUserData();
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
  return (
    <View style={{ marginTop: 20, width: '100%' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Personal Info</Text>
      <View style={styling.profileicons}>

        <Image source={require('@/assets/images/Profile/profilegreen.png')} style={{ width: 25, height: 25, marginRight: 5 }} />

        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }}>Name</Text>
      </View>
      <Text style={{ fontSize: 16 }}>{userData?.username}</Text>

      {/* <View style={styling.profileicons}>
        <Image source={require('@/assets/images/Profile/profileemail.png')} style={{ width: 25, height: 25, marginRight: 5 }} />

        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }}>Email</Text>
      </View> */}
      {/* <Text style={{ fontSize: 16 }}>{userData?.email}</Text> */}
      <View style={styling.profileicons}>
        <Image source={require('@/assets/images/Profile/profilecontact.png')} style={{ width: 25, height: 25, marginRight: 5 }} />

        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }}>Contact No.</Text>
      </View>
      <Text style={{ fontSize: 16 }}>{userData?.phone}</Text>
      <View style={styling.profileicons}>
        <Image source={require('@/assets/images/Profile/profilepass.png')} style={{ width: 25, height: 25, marginRight: 5 }} />

        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }}>Password.</Text>
      </View>
      <Text style={{ fontSize: 14 }}>{userData?.password}</Text>
    </View>
  )
}

export default AccountSettings