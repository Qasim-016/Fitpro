import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { getAuth } from 'firebase/auth'; // ✅ IMPORT this
import styling from '@/assets/Styles/styling';
import { SERVER_IP } from '../config';
import { app } from '../(AuthScreens)/firebaseConfig'; // ✅ import your firebase config (change path if needed)
import { router } from 'expo-router';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import MyButton from '@/components/Buttons/MyButton';
import Heading from '@/components/Text/Heading';

type FormData = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type Errors = {
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

const UpdatePassword = () => {
  const [formData, setFormData] = useState<FormData>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const auth = getAuth(app); // ✅ Initialize auth
        const user = auth.currentUser; // ✅ Get current logged in user
        if (user) {
          setUserId(user.uid); // ✅ Set user ID from Firebase UID
          console.log('User ID:', user.uid);
        } else {
          console.log('No user logged in');
        }
      } catch (error) {
        console.log('Error fetching user from Firebase:', error);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    const { oldPassword, newPassword, confirmNewPassword } = formData;

    if (!oldPassword) newErrors.oldPassword = 'Old password is required';
    if (!newPassword || newPassword.length < 8 || !/^[A-Z]/.test(newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters and start with a capital letter';
    }
    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validateForm()) return;

    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      const response = await axios.post(`http://${SERVER_IP}:5000/api/auth/updatePass`, {
        userId,
        oldPassword: formData.oldPassword,
        password: formData.newPassword,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Password updated successfully');
        router.replace('/(AuthScreens)/login')
        setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        Alert.alert('Error', response.data.error || 'Failed to update password');
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        Alert.alert('Error', error.response.data.error);
      } else {
        Alert.alert('Error', 'Server error while updating password');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={[styling.Backbtn, { zIndex: 10}]}>
<MyButton
          title={
            <LogoImgForScreen
              path={require('@/assets/images/Chatbot/back.png')}
              styles={styling.NextBackbtnimage}
            />
          }
          onPress={() => router.replace('/(User)/Dashboard')}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Update Password" styles={styling.HeaderText} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          secureTextEntry={!showOld}
          value={formData.oldPassword}
          onChangeText={(value) => handleInputChange('oldPassword', value)}
        />
        <Ionicons
          name={showOld ? 'eye-off' : 'eye'}
          size={22}
          style={styles.icon}
          onPress={() => setShowOld(!showOld)}
        />
      </View>
      {errors.oldPassword && <Text style={styles.error}>{errors.oldPassword}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!showNew}
          value={formData.newPassword}
          onChangeText={(value) => handleInputChange('newPassword', value)}
        />
        <Ionicons
          name={showNew ? 'eye-off' : 'eye'}
          size={22}
          style={styles.icon}
          onPress={() => setShowNew(!showNew)}
        />
      </View>
      {errors.newPassword && <Text style={styles.error}>{errors.newPassword}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry={!showConfirm}
          value={formData.confirmNewPassword}
          onChangeText={(value) => handleInputChange('confirmNewPassword', value)}
        />
        <Ionicons
          name={showConfirm ? 'eye-off' : 'eye'}
          size={22}
          style={styles.icon}
          onPress={() => setShowConfirm(!showConfirm)}
        />
      </View>
      {errors.confirmNewPassword && <Text style={styles.error}>{errors.confirmNewPassword}</Text>}

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword}>
        <Text style={styling.updateButtonText}>Update Password</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderRadius: 10,
    padding: 5,
    paddingRight: 40,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 8,
    color: '#888',
  },
  updateButton: {
    backgroundColor: '#2ecc71',
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});
