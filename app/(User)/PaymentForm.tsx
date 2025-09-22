import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication
import MyButton from '@/components/Buttons/MyButton';
import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';
import { router } from 'expo-router';
import styling from '@/assets/Styles/styling';
import { SERVER_IP } from '../config';
import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import type { PaymentIntent } from '@stripe/stripe-js';

const PaymentForm: React.FC = () => {
  const { confirmPayment } = useStripe();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({ name: '', amount: '' });
  const [planDropdownVisible, setPlanDropdownVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [subscriptionEndTime, setSubscriptionEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>('');
  const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false);
  const [selectedPlanDuration, setSelectedPlanDuration] = useState(1); // Default 1 month
    const [userData, setUserData] = useState<{ username: string ,email:string} | null>(null);

  const auth = getAuth(); // Initialize Firebase Auth
  const currentUserId = auth.currentUser?.uid; // Get the logged-in user's Firebase ID

  const amounts = [
    { label: '1 Month / 1500', value: '1500', duration: 30 },
    { label: '3 Months / 4200', value: '4200', duration: 90 },
    { label: '6 Months / 8300', value: '8300', duration: 180 },
    { label: '1 Year / 16500', value: '16500', duration: 365 },
  ];

  useEffect(() => {
    const loadSubscriptionData = async () => {
      if (!currentUserId) return; // Ensure user is logged in

      try {
        const response = await fetch(`http://${SERVER_IP}:5000/api/subscription/${currentUserId}`);
        const data = await response.json();
        if (data && data.subscriptionEndTime) {
          setSubscriptionEndTime(data.subscriptionEndTime);
        }
      } catch (error) {
        console.error('Failed to fetch subscription data', error);
      }
    };

    loadSubscriptionData();
    fetchUserData()
  }, [currentUserId]);

  // Timer Logic
  useEffect(() => {
    if (subscriptionEndTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = subscriptionEndTime - now;

        if (timeLeft <= 0) {
          clearInterval(interval);
          setRemainingTime('Subscription has ended.');
        } else {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [subscriptionEndTime]);

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: any = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
      valid = false;
    }

    if (!amount) {
      newErrors.amount = 'Please select a plan.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


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

  const handleSubmit = async () => {
    if (!currentUserId) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }
  
    if (!name) {
      Alert.alert('Error', 'Failed to fetch username. Please try again.');
      return;
    }
  
    if (validateForm()) {
      try {
        const response = await fetch(`http://${SERVER_IP}:5000/api/payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            email: userData?.email,
            userId: currentUserId,
            username: userData?.username, // Send the fetched username
          }),
        });
  
        const data = await response.json();
        if (!data.clientSecret) {
          throw new Error('Failed to fetch client secret.');
        }
  
        setClientSecret(data.clientSecret);
        setIsConfirmationVisible(true);
      } catch (error) {
        Alert.alert('Error', 'Failed to initialize payment. Please try again.');
      }
    }
  };
  
  const handlePayment = async () => {
    if (!clientSecret || !cardDetails?.complete) {
      Alert.alert('Error', 'Please enter valid card details.');
      return;
    }
  
    try {
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: { name },
        },
      });
  
      if (error) {
        Alert.alert('Payment Error', error.message || 'An error occurred during payment.');
      } else if (paymentIntent?.status === 'Succeeded') { // <--- lowercase here
        Alert.alert('Payment Successful', 'Your payment was processed successfully.');
        setIsConfirmationVisible(false);
  
        const notificationData = {
          id: Date.now().toString(),
          title: 'Payment Successful',
          message: `Your payment of ${amount} has been processed successfully!`,
          timestamp: Date.now(),
        };
  
        // Push Local Notification
        PushNotification.localNotification({
          channelId: 'fitpro_channel',
          title: notificationData.title,
          message: notificationData.message,
          playSound: true,
          soundName: 'default',
          importance: 'high',
          priority: 'high',
          vibrate: true,
        });
  
        // Store Notification in AsyncStorage
        const storeNotification = async () => {
          try {
            const existingNotifications = await AsyncStorage.getItem(`notifications_${currentUserId}`);
            const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
            notifications.push(notificationData);
            await AsyncStorage.setItem(`notifications_${currentUserId}`, JSON.stringify(notifications));
          } catch (error) {
            console.error('Error storing notification:', error);
          }
        };
        await storeNotification();
  
        // Save Subscription Data to MongoDB AFTER payment success
        const selectedPlan = amounts.find((item) => item.value === amount);
        if (selectedPlan) {
          const response = await fetch(`http://${SERVER_IP}:5000/api/save-subscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUserId,
              username: userData?.username,
              email: userData?.email,
              amount,
              duration: selectedPlan.duration, // <-- Add this line
            }),            
          });
  
          const data = await response.json();
          if (data.success) {
            console.log('Subscription data saved successfully.');
            const now = Date.now();
            const endTime = now + selectedPlan.duration * 24 * 60 * 60 * 1000;
            setSubscriptionEndTime(endTime);
          } else {
            console.log('Failed to save subscription data.');
          }
        }
  
        router.navigate('/(User)/Dashboard');
      } else {
        Alert.alert('Payment Failed', 'The payment did not complete successfully.');
      }
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };
  

  const handleCancelSubscription = () => {
    setIsCancelPopupVisible(true); // Show the confirmation popup
  };

  const confirmCancelSubscription = async () => {
    setSubscriptionEndTime(null);
    setRemainingTime('');
    setIsCancelPopupVisible(false); // Close the popup
  
    const notificationData = {
      id: Date.now().toString(),
      title: 'Subscription Canceled',
      message: `Your subscription has been canceled successfully!`,
      timestamp: Date.now(), //Store as a number
    };
  
    //Push Local Notification
    PushNotification.localNotification({
      channelId: 'fitpro_channel',
      title: notificationData.title,
      message: notificationData.message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
    });
  
    //Store Notification in AsyncStorage
    const storeNotification = async () => {
      try {
        const existingNotifications = await AsyncStorage.getItem(`notifications_${currentUserId}`);
        const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
        notifications.push(notificationData);
        await AsyncStorage.setItem(`notifications_${currentUserId}`, JSON.stringify(notifications));
      } catch (error) {
        console.error('Error storing notification:', error);
      }
    };
    await storeNotification();
  
    //Remove Subscription from MongoDB
    if (currentUserId) {
      try {
        const response = await fetch(`http://${SERVER_IP}:5000/api/subscription/${currentUserId}`, {
          method: 'DELETE',
        });
  
        const data = await response.json();
        if (data.success) {
          Alert.alert('Subscription Canceled', 'Your subscription has been successfully canceled.');
        }
      } catch (error) {
        console.error('Failed to cancel subscription', error);
      }
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styling.Paymentmaincontainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styling.scrollViewContent}>
        <PlaceHolderHeading title="Name" />
        <TextInput
          style={styling.cardField}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styling.errorText}>{errors.name}</Text>}

        <PlaceHolderHeading title="Card Details" />
        <CardField
          postalCodeEnabled={false}
          placeholders={{ number: '4242 4242 4242 4242' }}
          style={styling.cardField} // This is correct usage for styling
          onCardChange={setCardDetails}
        />

        <PlaceHolderHeading title="Select Plan" />
        <TouchableOpacity
          style={styling.cardField}
          onPress={() => setPlanDropdownVisible(true)}
        >
          <Text style={styling.dropdownText}>
            {amount
              ? amounts.find((item) => item.value === amount)?.label
              : 'Select Plan'}
          </Text>
        </TouchableOpacity>

        <Modal visible={planDropdownVisible} transparent animationType="slide">
          <View style={styling.modalContainer}>
            <View style={styling.modalContent}>
              <FlatList
                data={amounts}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styling.option}
                    onPress={() => {
                      setAmount(item.value);
                      setPlanDropdownVisible(false);
                    }}
                  >
                    <Text style={styling.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styling.closeButtonpayment}
                onPress={() => setPlanDropdownVisible(false)}
              >
                <Text style={styling.closeTextpayment}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {errors.amount && <Text style={styling.errorText}>{errors.amount}</Text>}

        <MyButton
          title="Submit"
          style1={[
            styling.submitButtonpayment,
            subscriptionEndTime ? { backgroundColor: '#ccc' } : {}, // Add fallback to an empty object
          ]}
          style2={[
            styling.submitButtonTextpayment,
            subscriptionEndTime ? { color: '#999' } : {}, // Add fallback to an empty object
          ]}
          onPress={handleSubmit}
          disabled={!!subscriptionEndTime} // Disable the button when the timer is active
        />

        {subscriptionEndTime && (
          <View style={styling.timerContainer}>
            <Text style={styling.timerText}>Time Left: {remainingTime}</Text>
            <MyButton
              title="Cancel Subscription"
              style1={styling.cancelButton}
              style2={styling.cancelButtonText}
              onPress={handleCancelSubscription}
            />
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={isConfirmationVisible} transparent animationType="slide">
        <View style={styling.modalContainer}>
          <View style={styling.modalContent}>
            <Text style={styling.modalTitle}>Confirm Payment</Text>
            <Text style={styling.modalsubtitle}>Name: {name}</Text>
            <Text style={styling.modalsubtitle}>Plan: {amounts.find((item) => item.value === amount)?.label}</Text>

            <View style={styling.buttonRow}>
              <MyButton
                title="Change"
                onPress={() => setIsConfirmationVisible(false)}
                style1={styling.modalButton}
                style2={styling.modalButtonText}
              />
              <MyButton
                title="Pay Now"
                onPress={handlePayment}
                style1={styling.modalButton}
                style2={styling.modalButtonText}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel Subscription Confirmation Modal */}
      <Modal visible={isCancelPopupVisible} transparent animationType="fade">
        <View style={styling.modalContainer}>
          <View style={styling.modalContent}>
            <Text style={styling.modalTitle}>Cancel Subscription</Text>
            <Text style={styling.modalsubtitle}>
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </Text>

            <View style={styling.buttonRow}>
              <MyButton
                title="No, Keep It"
                onPress={() => setIsCancelPopupVisible(false)} // Close the popup
                style1={styling.modalButton}
                style2={styling.modalButtonText}
              />
              <MyButton
                title="Yes, Cancel"
                onPress={confirmCancelSubscription} // Confirm cancellation
                style1={styling.modalButton}
                style2={styling.modalButtonText}
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};
export default PaymentForm;