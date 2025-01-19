
// import React, { useState } from 'react';
// import { TextInput } from 'react-native';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   FlatList,
//   Alert,
//   KeyboardAvoidingView,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import { CardField, useStripe } from '@stripe/stripe-react-native';
// import MyButton from '@/components/Buttons/MyButton';
// import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';
// import styling from '@/assets/Styles/styling';
// import { router } from 'expo-router';
// import { useEffect } from 'react';

// const PaymentForm: React.FC = () => {
//   const { confirmPayment } = useStripe();
//   const [name, setName] = useState('');
//   const [amount, setAmount] = useState('');
//   const [errors, setErrors] = useState({ name: '', amount: '' });
//   const [planDropdownVisible, setPlanDropdownVisible] = useState(false);
//   const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [cardDetails, setCardDetails] = useState<any>(null);
// const [subscriptionEndTime, setSubscriptionEndTime] = useState<number | null>(null); // Timer state
// const [remainingTime, setRemainingTime] = useState<string>(''); 
// const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false); // For cancel confirmation popup
// // Display remaining time
// const amounts = [
//   { label: '1 Month / 1500', value: '1500', duration: 30 }, // duration in days
//   { label: '3 Months / 4200', value: '4200', duration: 90 },
//   { label: '6 Months / 8300', value: '8300', duration: 180 },
//   { label: '1 Year / 16500', value: '16500', duration: 365 },
// ];
//   useEffect(() => {
//     if (subscriptionEndTime) {
//       const interval = setInterval(() => {
//         const now = new Date().getTime();
//         const timeLeft = subscriptionEndTime - now;

//         if (timeLeft <= 0) {
//           clearInterval(interval);
//           setRemainingTime('Subscription has ended.');
//         } else {
//           const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
//           const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//           const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
//           const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

//           setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
//         }
//       }, 1000);

//       return () => clearInterval(interval); // Cleanup timer on unmount
//     }
//   }, [subscriptionEndTime]);
//   const validateForm = (): boolean => {
//     let valid = true;
//     const newErrors: any = {};

//     if (!name.trim()) {
//       newErrors.name = 'Name is required.';
//       valid = false;
//     }

//     if (!amount) {
//       newErrors.amount = 'Please select a plan.';
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const handleSubmit = async () => {
//     if (validateForm()) {
//       try {
//         const response = await fetch('http://192.168.0.115:5000/api/payment-intent', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ amount }),
//         });

//         const data = await response.json();
//         if (!data.clientSecret) {
//           throw new Error('Failed to fetch client secret.');
//         }

//         setClientSecret(data.clientSecret);
//         setIsConfirmationVisible(true);
//       } catch (error) {
//         Alert.alert('Error', 'Failed to initialize payment. Please try again.');
//       }
//     }
//   };

//   const handlePayment = async () => {
//     if (!clientSecret || !cardDetails?.complete) {
//       Alert.alert('Error', 'Please enter valid card details.');
//       return;
//     }

//     try {
//       const { error, paymentIntent } = await confirmPayment(clientSecret, {
//         paymentMethodType: 'Card',
//         paymentMethodData: {
//           billingDetails: { name },
//         },
//       });

//       if (error) {
//         Alert.alert('Payment Error', error.message || 'An error occurred during payment.');
//       } else if (paymentIntent?.status === 'Succeeded') {
//         Alert.alert('Payment Successful', 'Your payment was processed successfully.');
//         setIsConfirmationVisible(false);

//         // Calculate subscription end time
//         const selectedPlan = amounts.find((item) => item.value === amount);
//         if (selectedPlan) {
//           const now = new Date().getTime();
//           const endTime = now + selectedPlan.duration * 24 * 60 * 60 * 1000; // Add days to current time
//           setSubscriptionEndTime(endTime);
//         }

//         router.navigate('/(User)/Dashboard');
//       } else {
//         Alert.alert('Payment Failed', 'The payment did not complete successfully.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Payment failed. Please try again.');
//     }
//   };
//   const handleCancelSubscription = () => {
//     setIsCancelPopupVisible(true); // Show the confirmation popup
//   };

//   const confirmCancelSubscription = () => {
//     setSubscriptionEndTime(null);
//     setRemainingTime('');
//     setIsCancelPopupVisible(false); // Close the popup
//     Alert.alert('Subscription Canceled', 'Your subscription has been successfully canceled.');
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <PlaceHolderHeading title="Name" />
//         <TextInput
//           style={styles.cardField}
//           placeholder="Name"
//           value={name}
//           onChangeText={setName}
//         />
//         {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

//         <PlaceHolderHeading title="Card Details" />
//         <CardField
//           postalCodeEnabled={false}
//           placeholders={{ number: '4242 4242 4242 4242' }}
//           style={styles.cardField} // This is correct usage for styling
//           onCardChange={setCardDetails}
//         />

//         <PlaceHolderHeading title="Select Plan" />
//         <TouchableOpacity
//           style={styles.cardField}
//           onPress={() => setPlanDropdownVisible(true)}
//         >
//           <Text style={styles.dropdownText}>
//             {amount
//               ? amounts.find((item) => item.value === amount)?.label
//               : 'Select Plan'}
//           </Text>
//         </TouchableOpacity>

//         <Modal visible={planDropdownVisible} transparent animationType="slide">
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <FlatList
//                 data={amounts}
//                 keyExtractor={(item) => item.value}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.option}
//                     onPress={() => {
//                       setAmount(item.value);
//                       setPlanDropdownVisible(false);
//                     }}
//                   >
//                     <Text style={styles.optionText}>{item.label}</Text>
//                   </TouchableOpacity>
//                 )}
//               />
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => setPlanDropdownVisible(false)}
//               >
//                 <Text style={styles.closeText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

//         {/* <MyButton
//           title="Submit"
//           style1={styles.submitButton}
//           style2={styles.submitButtonText}
//           onPress={handleSubmit}
//         /> */}
//         <MyButton
//   title="Submit"
//   style1={[
//     styles.submitButton,
//     subscriptionEndTime ? { backgroundColor: '#ccc' } : {}, // Add fallback to an empty object
//   ]}
//   style2={[
//     styles.submitButtonText,
//     subscriptionEndTime ? { color: '#999' } : {}, // Add fallback to an empty object
//   ]}
//   onPress={handleSubmit}
//   disabled={!!subscriptionEndTime} // Disable the button when the timer is active
// />

//         {subscriptionEndTime && (
//           <View style={styles.timerContainer}>
//           <Text style={styles.timerText}>Time Left: {remainingTime}</Text>
//           <MyButton
//             title="Cancel Subscription"
//             style1={styles.cancelButton}
//             style2={styles.cancelButtonText}
//             onPress={handleCancelSubscription}
//           />
//         </View>
//       )}
//       </ScrollView>
      

//       {/* Confirmation Modal */}
//       <Modal visible={isConfirmationVisible} transparent animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Confirm Payment</Text>
//             <Text style={styles.modalsubtitle}>Name: {name}</Text>
//             <Text style={styles.modalsubtitle}>Plan: {amounts.find((item) => item.value === amount)?.label}</Text>

//             <View style={styles.buttonRow}>
//               <MyButton
//                 title="Change"
//                 onPress={() => setIsConfirmationVisible(false)}
//                 style1={styles.modalButton}
//                 style2={styles.modalButtonText}
//               />
//               <MyButton
//                 title="Pay Now"
//                 onPress={handlePayment}
//                 style1={styles.modalButton}
//                 style2={styles.modalButtonText}
//               />
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Cancel Subscription Confirmation Modal */}
//       <Modal visible={isCancelPopupVisible} transparent animationType="fade">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Cancel Subscription</Text>
//             <Text style={styles.modalsubtitle}>
//               Are you sure you want to cancel your subscription? This action cannot be undone.
//             </Text>

//             <View style={styles.buttonRow}>
//               <MyButton
//                 title="No, Keep It"
//                 onPress={() => setIsCancelPopupVisible(false)} // Close the popup
//                 style1={styles.modalButton}
//                 style2={styles.modalButtonText}
//               />
//               <MyButton
//                 title="Yes, Cancel"
//                 onPress={confirmCancelSubscription} // Confirm cancellation
//                 style1={styles.modalButton}
//                 style2={styles.modalButtonText}
//               />
//             </View>
//           </View>
//         </View>
//       </Modal>
     
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20, flex: 1 },
//   scrollViewContent: { paddingBottom: 20, paddingTop: 10 },
//   input: { borderWidth: 1, borderColor: '#2ecc71', borderRadius: 5, paddingHorizontal: 10,paddingVertical:5 },
//   cardField: {
//     // borderColor: '#2ecc71',
//     // borderRadius: 5,
//     // borderWidth: 1,
//     backgroundColor: '#fff',paddingHorizontal:5,
//     height: 40,justifyContent:'center',
//     // marginVertical: 10,
//   },
//   errorText: { color: 'red', fontSize: 12 },
//   dropdown: { borderWidth: 1, borderColor: '#2ecc71', borderRadius: 5, padding: 10 },
//   dropdownText: { color: '#999' },
//   modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
//   modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
//   buttonRow: { flexDirection: 'row', justifyContent:'center',columnGap:10 },
//   modalButton: { backgroundColor: '#2ecc71', padding: 10, borderRadius: 5 },
//   modalButtonText: { color: 'white', fontSize: 16 },
//   submitButton: { marginTop: 15, backgroundColor: '#2ecc71', padding: 5, borderRadius: 8, alignItems: 'center' },
//   submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
//   option: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
//   optionText: { fontSize: 16 },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   modalsubtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     // textAlign: 'center',
//   },
//   closeButton: {
//     marginTop: 10,
//     alignSelf: 'center',
//   },
//   closeText: {
//     color: '#2ecc71',
//     fontSize: 16,
//   }, timerContainer: {
//     padding: 10,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     alignSelf: 'center',
//     marginVertical: 10,
//   },
//   timerText: {
//     fontSize: 16,
//     color: 'red',
//   },
//     cancelButton: {borderWidth:2,borderColor:'#2ecc71', padding: 10, alignItems: 'center' },
//     cancelButtonText: { color: '#2ecc71' },
// });

// export default PaymentForm;



import React, { useState } from 'react';
import { TextInput } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import MyButton from '@/components/Buttons/MyButton';
import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';
import styling from '@/assets/Styles/styling';
import { router } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const PaymentForm: React.FC = () => {
  const { confirmPayment } = useStripe();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({ name: '', amount: '' });
  const [planDropdownVisible, setPlanDropdownVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<any>(null);
const [subscriptionEndTime, setSubscriptionEndTime] = useState<number | null>(null); // Timer state
const [remainingTime, setRemainingTime] = useState<string>(''); 
const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false); // For cancel confirmation popup
// Display remaining time
const amounts = [
  { label: '1 Month / 1500', value: '1500', duration: 30 }, // duration in days
  { label: '3 Months / 4200', value: '4200', duration: 90 },
  { label: '6 Months / 8300', value: '8300', duration: 180 },
  { label: '1 Year / 16500', value: '16500', duration: 365 },
];
useEffect(() => {
  const loadSubscriptionData = async () => {
    const subscriptionData = await AsyncStorage.getItem('subscriptionData');
    if (subscriptionData) {
      const parsedData = JSON.parse(subscriptionData);
      setSubscriptionEndTime(parsedData.subscriptionEndTime);
    }
  };

  loadSubscriptionData();
}, []);
  useEffect(() => {
    if (subscriptionEndTime) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
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

      return () => clearInterval(interval); // Cleanup timer on unmount
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

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await fetch('http://192.168.0.115:5000/api/payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
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
    } else if (paymentIntent?.status === 'Succeeded') {
      Alert.alert('Payment Successful', 'Your payment was processed successfully.');
      setIsConfirmationVisible(false);

      // Calculate subscription end time
      const selectedPlan = amounts.find((item) => item.value === amount);
      if (selectedPlan) {
        const now = new Date().getTime();
        const endTime = now + selectedPlan.duration * 24 * 60 * 60 * 1000; // Add days to current time
        setSubscriptionEndTime(endTime);

        // Save subscription data to AsyncStorage
        await AsyncStorage.setItem(
          'subscriptionData',
          JSON.stringify({ subscriptionEndTime: endTime })
        );
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
  await AsyncStorage.removeItem('subscriptionData'); // Clear subscription data from AsyncStorage
  Alert.alert('Subscription Canceled', 'Your subscription has been successfully canceled.');
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <PlaceHolderHeading title="Name" />
        <TextInput
          style={styles.cardField}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <PlaceHolderHeading title="Card Details" />
        <CardField
          postalCodeEnabled={false}
          placeholders={{ number: '4242 4242 4242 4242' }}
          style={styles.cardField} // This is correct usage for styling
          onCardChange={setCardDetails}
        />

        <PlaceHolderHeading title="Select Plan" />
        <TouchableOpacity
          style={styles.cardField}
          onPress={() => setPlanDropdownVisible(true)}
        >
          <Text style={styles.dropdownText}>
            {amount
              ? amounts.find((item) => item.value === amount)?.label
              : 'Select Plan'}
          </Text>
        </TouchableOpacity>

        <Modal visible={planDropdownVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={amounts}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      setAmount(item.value);
                      setPlanDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPlanDropdownVisible(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

        {/* <MyButton
          title="Submit"
          style1={styles.submitButton}
          style2={styles.submitButtonText}
          onPress={handleSubmit}
        /> */}
        <MyButton
  title="Submit"
  style1={[
    styles.submitButton,
    subscriptionEndTime ? { backgroundColor: '#ccc' } : {}, // Add fallback to an empty object
  ]}
  style2={[
    styles.submitButtonText,
    subscriptionEndTime ? { color: '#999' } : {}, // Add fallback to an empty object
  ]}
  onPress={handleSubmit}
  disabled={!!subscriptionEndTime} // Disable the button when the timer is active
/>

        {subscriptionEndTime && (
          <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Time Left: {remainingTime}</Text>
          <MyButton
            title="Cancel Subscription"
            style1={styles.cancelButton}
            style2={styles.cancelButtonText}
            onPress={handleCancelSubscription}
          />
        </View>
      )}
      </ScrollView>
      

      {/* Confirmation Modal */}
      <Modal visible={isConfirmationVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Payment</Text>
            <Text style={styles.modalsubtitle}>Name: {name}</Text>
            <Text style={styles.modalsubtitle}>Plan: {amounts.find((item) => item.value === amount)?.label}</Text>

            <View style={styles.buttonRow}>
              <MyButton
                title="Change"
                onPress={() => setIsConfirmationVisible(false)}
                style1={styles.modalButton}
                style2={styles.modalButtonText}
              />
              <MyButton
                title="Pay Now"
                onPress={handlePayment}
                style1={styles.modalButton}
                style2={styles.modalButtonText}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel Subscription Confirmation Modal */}
      <Modal visible={isCancelPopupVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Subscription</Text>
            <Text style={styles.modalsubtitle}>
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </Text>

            <View style={styles.buttonRow}>
              <MyButton
                title="No, Keep It"
                onPress={() => setIsCancelPopupVisible(false)} // Close the popup
                style1={styles.modalButton}
                style2={styles.modalButtonText}
              />
              <MyButton
                title="Yes, Cancel"
                onPress={confirmCancelSubscription} // Confirm cancellation
                style1={styles.modalButton}
                style2={styles.modalButtonText}
              />
            </View>
          </View>
        </View>
      </Modal>
     
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  scrollViewContent: { paddingBottom: 20, paddingTop: 10 },
  input: { borderWidth: 1, borderColor: '#2ecc71', borderRadius: 5, paddingHorizontal: 10,paddingVertical:5 },
  cardField: {
    // borderColor: '#2ecc71',
    // borderRadius: 5,
    // borderWidth: 1,
    backgroundColor: '#fff',paddingHorizontal:5,
    height: 40,justifyContent:'center',
    // marginVertical: 10,
  },
  errorText: { color: 'red', fontSize: 12 },
  dropdown: { borderWidth: 1, borderColor: '#2ecc71', borderRadius: 5, padding: 10 },
  dropdownText: { color: '#999' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  buttonRow: { flexDirection: 'row', justifyContent:'center',columnGap:10 },
  modalButton: { backgroundColor: '#2ecc71', padding: 10, borderRadius: 5 },
  modalButtonText: { color: 'white', fontSize: 16 },
  submitButton: { marginTop: 15, backgroundColor: '#2ecc71', padding: 5, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  option: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  optionText: { fontSize: 16 },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalsubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    // textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  closeText: {
    color: '#2ecc71',
    fontSize: 16,
  }, timerContainer: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
  },
  timerText: {
    fontSize: 16,
    color: 'red',
  },
    cancelButton: {borderWidth:2,borderColor:'#2ecc71', padding: 10, alignItems: 'center' },
    cancelButtonText: { color: '#2ecc71' },
});

export default PaymentForm;





