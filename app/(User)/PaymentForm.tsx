// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   FlatList,
// } from 'react-native';
// import MyButton from '@/components/Buttons/MyButton';
// import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';

// const PaymentForm = () => {
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [formData, setFormData] = useState({
//     Name: '',
//     phoneNumber: '',
//     accountNumber: '',
//     expiryDate: '',
//     cvv: '',
//     amount: '',
//   });

//   const [errors, setErrors] = useState({
//     Name: '',
//     phoneNumber: '',
//     accountNumber: '',
//     expiryDate: '',
//     cvv: '',
//     amount: '',
//   });

//   const [paymentMethodDropdownVisible, setPaymentMethodDropdownVisible] = useState(false);
//   const [planDropdownVisible, setPlanDropdownVisible] = useState(false);

//   const amounts = [
//     { label: '1 Month / 1500', value: '1500' },
//     { label: '3 Months / 4200', value: '4200' },
//     { label: '6 Months / 8300', value: '8300' },
//     { label: '1 Year / 16500', value: '16500' },
//   ];

//   const validateForm = () => {
//     let valid = true;
//     const newErrors = { ...errors };
  
//     // Name validation
//     if (!formData.Name.trim()) {
//       newErrors.Name = 'Name is required.';
//       valid = false;
//     } else {
//       newErrors.Name = ''; // Clear previous error
//     }
  
//     // Plan validation
//     if (!formData.amount) {
//       newErrors.amount = 'Please select a plan.';
//       valid = false;
//     } else {
//       newErrors.amount = ''; // Clear previous error
//     }
  
//     // Easypaisa Card-specific validation
//     if (paymentMethod === 'easypaisaCard') {
//       if (!formData.accountNumber.trim()) {
//         newErrors.accountNumber = 'Card number is required.';
//         valid = false;
//       } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.accountNumber.trim())) {
//         newErrors.accountNumber = 'Card number must be in the format XXXX XXXX XXXX XXXX.';
//         valid = false;
//       } else {
//         newErrors.accountNumber = ''; // Clear previous error
//       }
  
//       if (!formData.expiryDate.trim()) {
//         newErrors.expiryDate = 'Expiry date is required.';
//         valid = false;
//       } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate.trim())) {
//         newErrors.expiryDate = 'Expiry date must be in MM/YY format.';
//         valid = false;
//       } else {
//         newErrors.expiryDate = ''; // Clear previous error
//       }
  
//       if (!formData.cvv.trim()) {
//         newErrors.cvv = 'CVV is required.';
//         valid = false;
//       } else if (!/^\d{3}$/.test(formData.cvv.trim())) {
//         newErrors.cvv = 'CVV must be a 3-digit number.';
//         valid = false;
//       } else {
//         newErrors.cvv = ''; // Clear previous error
//       }
//     }
  
//     // Easypaisa Account-specific validation
//     if (paymentMethod === 'easypaisaAccount') {
//       if (!formData.phoneNumber.trim()) {
//         newErrors.phoneNumber = 'Phone number is required.';
//         valid = false;
//       } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
//         newErrors.phoneNumber = 'Phone number must be a valid 10-digit number.';
//         valid = false;
//       } else {
//         newErrors.phoneNumber = ''; // Clear previous error
//       }
//     }
  
//     setErrors(newErrors);
//     return valid;
//   };
  

//   const handleSubmit = () => {
//     if (validateForm()) {
//       console.log('Form Submitted Successfully:', formData);
//     }
//   };

//   return (
//     <View style={styles.container}>
      
//       {/* Payment Method Dropdown */}
//       <PlaceHolderHeading title="Payment Method" />
//       <TouchableOpacity
//         style={styles.dropdown}
//         onPress={() => setPaymentMethodDropdownVisible(true)}
//       >
//         <Text style={styles.dropdownText}>
//           {paymentMethod || 'Select Payment Method'}
//         </Text>
//       </TouchableOpacity>

//       <Modal
//         visible={paymentMethodDropdownVisible}
//         transparent
//         animationType="slide"
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity
//               style={styles.option}
//               onPress={() => {
//                 setPaymentMethod('easypaisaCard');
//                 setPaymentMethodDropdownVisible(false);
//               }}
//             >
//               <Text style={styles.optionText}>Easypaisa Card</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.option}
//               onPress={() => {
//                 setPaymentMethod('easypaisaAccount');
//                 setPaymentMethodDropdownVisible(false);
//               }}
//             >
//               <Text style={styles.optionText}>Easypaisa Mobile Account</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setPaymentMethodDropdownVisible(false)}
//             >
//               <Text style={styles.closeText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Show Fields Based on Payment Method */}
//       {paymentMethod === 'easypaisaCard' && (
//         <>
//           <PlaceHolderHeading title="Name" />
//           <TextInput
//             style={styles.input}
//             placeholder="Name"
//             value={formData.Name}
//             onChangeText={(text) => setFormData({ ...formData, Name: text })}
//           />
//           {errors.Name && <Text style={styles.errorText}>{errors.Name}</Text>}

//           <PlaceHolderHeading title="Card Number" />
//           <TextInput
//             style={styles.input}
//             placeholder="XXXX XXXX XXXX XXXX"
//             value={formData.accountNumber}
//             onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
//             keyboardType="numeric"
//           />
//           {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}

//           <PlaceHolderHeading title="Expiry Date (MM/YY)" />
//           <TextInput
//             style={styles.input}
//             placeholder="MM/YY"
//             value={formData.expiryDate}
//             onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
//             keyboardType="numeric"
//           />
//           {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}

//           <PlaceHolderHeading title="CVV" />
//           <TextInput
//             style={styles.input}
//             placeholder="CVV"
//             value={formData.cvv}
//             onChangeText={(text) => setFormData({ ...formData, cvv: text })}
//             secureTextEntry={true}
//             keyboardType="numeric"
//           />
//           {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
//         </>
//       )}

//       {paymentMethod === 'easypaisaAccount' && (
//         <>
//           <PlaceHolderHeading title="Name" />
//           <TextInput
//             style={styles.input}
//             placeholder="Name"
//             value={formData.Name}
//             onChangeText={(text) => setFormData({ ...formData, Name: text })}
//           />
//           {errors.Name && <Text style={styles.errorText}>{errors.Name}</Text>}

//           <PlaceHolderHeading title="Phone Number" />
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             value={formData.phoneNumber}
//             onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
//             keyboardType="numeric"
//           />
//           {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
//         </>
//       )}

//       {/* Plan Dropdown */}
//       <PlaceHolderHeading title="Select Plan" />
//       <TouchableOpacity
//         style={styles.dropdown}
//         onPress={() => setPlanDropdownVisible(true)}
//       >
//         <Text style={styles.dropdownText}>
//           {formData.amount
//             ? amounts.find((item) => item.value === formData.amount)?.label
//             : 'Select Plan'}
//         </Text>
//       </TouchableOpacity>

//       <Modal visible={planDropdownVisible} transparent animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <FlatList
//               data={amounts}
//               keyExtractor={(item) => item.value}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.option}
//                   onPress={() => {
//                     setFormData({ ...formData, amount: item.value });
//                     setPlanDropdownVisible(false);
//                   }}
//                 >
//                   <Text style={styles.optionText}>{item.label}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setPlanDropdownVisible(false)}
//             >
//               <Text style={styles.closeText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

//       {/* Submit Button */}
//       <MyButton
//         title={'Submit'}
//         style1={styles.submitButton}
//         style2={styles.submitButtonText}
//         onPress={handleSubmit}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,paddingTop:0,
//     padding: 20,
//     // backgroundColor: '#f4f4f4',
//   },input2container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
  
//   inputWrapper: {
//     width: '48%', // Adjusts the width to fit both inputs in one line
//   },
  
//   input: {
//     width:'auto',
//     borderWidth: 1,
//     borderColor: '#2ecc71',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     // marginBottom: 10,
//     // backgroundColor: '#fff',
//   },
//   input2: {
//     borderWidth: 1,
//     borderColor: '#2ecc71',
//     borderRadius: 5,
//     width:'auto',
//     paddingHorizontal: 10,
//     // marginBottom: 10,
//     // backgroundColor: '#2ecc71',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     // marginBottom: 10,
//   },
//   dropdown: {
//     borderWidth: 1,
//     borderColor: '#2ecc71',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical:5
//     // marginBottom: 10,
//     // backgroundColor: '#fff',
//   },
//   dropdownText: {
//     color: '#999',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//   },
//   option: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#2ecc71',
//   },
//   optionText: {
//     fontSize: 16,
//   },
//   closeButton: {
//     marginTop: 10,
//     alignSelf: 'center',
//   },
//   closeText: {
//     color: '#2ecc71',
//     fontSize: 16,
//   },
//   submitButton: {
//     marginTop: 5,
//     backgroundColor: '#2ecc71',
//     padding: 5,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default PaymentForm;





// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   FlatList,
//   Alert,
// } from 'react-native';
// import MyButton from '@/components/Buttons/MyButton';
// import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';

// interface FormData {
//   Name: string;
//   accountNumber: string;
//   expiryDate: string;
//   cvv: string;
//   amount: string;
// }

// const PaymentForm: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     Name: '',
//     accountNumber: '',
//     expiryDate: '',
//     cvv: '',
//     amount: '',
//   });

//   const [errors, setErrors] = useState<Partial<FormData>>({});
//   const [planDropdownVisible, setPlanDropdownVisible] = useState(false);

//   const amounts: { label: string; value: string }[] = [
//     { label: '1 Month / 1500', value: '1500' },
//     { label: '3 Months / 4200', value: '4200' },
//     { label: '6 Months / 8300', value: '8300' },
//     { label: '1 Year / 16500', value: '16500' },
//   ];

//   const handleInputChange = (field: keyof FormData, value: string): void => {
//     let formattedValue = value;

//     if (field === 'accountNumber') {
//       formattedValue = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
//       if (formattedValue.length > 19) return;
//     }

//     if (field === 'expiryDate') {
//       formattedValue = value.replace(/[^0-9/]/g, '');
//       if (formattedValue.length === 2 && !value.includes('/')) {
//         formattedValue = formattedValue + '/';
//       }
//       if (formattedValue.length > 5) return;
//     }

//     if (field === 'cvv') {
//       formattedValue = value.replace(/[^0-9]/g, '');
//       if (formattedValue.length > 3) return;
//     }

//     setFormData((prev) => ({ ...prev, [field]: formattedValue }));
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validateForm = (): boolean => {
//     let valid = true;
//     const newErrors: Partial<FormData> = {};

//     if (!formData.Name.trim()) {
//       newErrors.Name = 'Name is required.';
//       valid = false;
//     }

//     if (!formData.amount) {
//       newErrors.amount = 'Please select a plan.';
//       valid = false;
//     }

//     if (!formData.accountNumber.trim()) {
//       newErrors.accountNumber = 'Card number is required.';
//       valid = false;
//     } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.accountNumber.trim())) {
//       newErrors.accountNumber = 'Card number must be in the format XXXX XXXX XXXX XXXX.';
//       valid = false;
//     }

//     if (!formData.expiryDate.trim()) {
//       newErrors.expiryDate = 'Expiry date is required.';
//       valid = false;
//     } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate.trim())) {
//       newErrors.expiryDate = 'Expiry date must be in MM/YY format.';
//       valid = false;
//     }

//     if (!formData.cvv.trim()) {
//       newErrors.cvv = 'CVV is required.';
//       valid = false;
//     } else if (!/^\d{3}$/.test(formData.cvv.trim())) {
//       newErrors.cvv = 'CVV must be a 3-digit number.';
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       console.log('Form Submitted Successfully:', formData);
//       Alert.alert('Submitted successfully!');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <PlaceHolderHeading title="Name" />
//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         value={formData.Name}
//         onChangeText={(text) => handleInputChange('Name', text)}
//       />
//       {errors.Name && <Text style={styles.errorText}>{errors.Name}</Text>}

//       <PlaceHolderHeading title="Card Number" />
//       <TextInput
//         style={styles.input}
//         placeholder="XXXX XXXX XXXX XXXX"
//         value={formData.accountNumber}
//         onChangeText={(text) => handleInputChange('accountNumber', text)}
//         keyboardType="numeric"
//       />
//       {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}

//       <View style={styles.inputRow}>
//         <View style={styles.inputWrapper}>
//           <PlaceHolderHeading title="Expiry Date (MM/YY)" />
//           <TextInput
//             style={styles.input}
//             placeholder="MM/YY"
//             value={formData.expiryDate}
//             onChangeText={(text) => handleInputChange('expiryDate', text)}
//             keyboardType="numeric"
//           />
//           {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
//         </View>

//         <View style={styles.inputWrapper}>
//           <PlaceHolderHeading title="CVV" />
//           <TextInput
//             style={styles.input}
//             placeholder="CVV"
//             value={formData.cvv}
//             onChangeText={(text) => handleInputChange('cvv', text)}
//             secureTextEntry={true}
//             keyboardType="numeric"
//           />
//           {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
//         </View>
//       </View>

//       <PlaceHolderHeading title="Select Plan" />
//       <TouchableOpacity
//         style={styles.dropdown}
//         onPress={() => setPlanDropdownVisible(true)}
//       >
//         <Text style={styles.dropdownText}>
//           {formData.amount
//             ? amounts.find((item) => item.value === formData.amount)?.label
//             : 'Select Plan'}
//         </Text>
//       </TouchableOpacity>

//       <Modal visible={planDropdownVisible} transparent animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <FlatList
//               data={amounts}
//               keyExtractor={(item) => item.value}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.option}
//                   onPress={() => {
//                     handleInputChange('amount', item.value);
//                     setPlanDropdownVisible(false);
//                   }}
//                 >
//                   <Text style={styles.optionText}>{item.label}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setPlanDropdownVisible(false)}
//             >
//               <Text style={styles.closeText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

//       <MyButton
//         title="Submit"
//         style1={styles.submitButton}
//         style2={styles.submitButtonText}
//         onPress={handleSubmit}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#2ecc71',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   inputWrapper: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dropdown: {
//     borderWidth: 1,
//     borderColor: '#2ecc71',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   dropdownText: {
//     color: '#999',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//   },
//   option: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#2ecc71',
//   },
//   optionText: {
//     fontSize: 16,
//   },
//   closeButton: {
//     marginTop: 10,
//     alignSelf: 'center',
//   },
//   closeText: {
//     color: '#2ecc71',
//     fontSize: 16,
//   },
//   submitButton: {
//     marginTop: 5,
//     backgroundColor: '#2ecc71',
//     padding: 5,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//   },
// });

// export default PaymentForm;







// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   FlatList,
//   Alert,
//   KeyboardAvoidingView,
//   ScrollView,
//   Platform
// } from 'react-native';
// import MyButton from '@/components/Buttons/MyButton';
// import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';

// interface FormData {
//   Name: string;
//   accountNumber: string;
//   expiryDate: string;
//   cvv: string;
//   amount: string;
// }

// const PaymentForm: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     Name: '',
//     accountNumber: '',
//     expiryDate: '',
//     cvv: '',
//     amount: '',
//   });

//   const [errors, setErrors] = useState<Partial<FormData>>({});
//   const [planDropdownVisible, setPlanDropdownVisible] = useState(false);

//   const amounts: { label: string; value: string }[] = [
//     { label: '1 Month / 1500', value: '1500' },
//     { label: '3 Months / 4200', value: '4200' },
//     { label: '6 Months / 8300', value: '8300' },
//     { label: '1 Year / 16500', value: '16500' },
//   ];

//   const handleInputChange = (field: keyof FormData, value: string): void => {
//     let formattedValue = value;

//     if (field === 'accountNumber') {
//       formattedValue = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
//       if (formattedValue.length > 19) return;
//     }

//     if (field === 'expiryDate') {
//       formattedValue = value.replace(/[^0-9/]/g, '');
//       if (formattedValue.length === 2 && !value.includes('/')) {
//         formattedValue = formattedValue + '/';
//       }
//       if (formattedValue.length > 5) return;
//     }

//     if (field === 'cvv') {
//       formattedValue = value.replace(/[^0-9]/g, '');
//       if (formattedValue.length > 3) return;
//     }

//     setFormData((prev) => ({ ...prev, [field]: formattedValue }));
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validateForm = (): boolean => {
//     let valid = true;
//     const newErrors: Partial<FormData> = {};

//     if (!formData.Name.trim()) {
//       newErrors.Name = 'Name is required.';
//       valid = false;
//     }

//     if (!formData.amount) {
//       newErrors.amount = 'Please select a plan.';
//       valid = false;
//     }

//     if (!formData.accountNumber.trim()) {
//       newErrors.accountNumber = 'Card number is required.';
//       valid = false;
//     } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.accountNumber.trim())) {
//       newErrors.accountNumber = 'Card number must be in the format XXXX XXXX XXXX XXXX.';
//       valid = false;
//     }

//     if (!formData.expiryDate.trim()) {
//       newErrors.expiryDate = 'Expiry date is required.';
//       valid = false;
//     } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate.trim())) {
//       newErrors.expiryDate = 'Expiry date must be in MM/YY format.';
//       valid = false;
//     }

//     if (!formData.cvv.trim()) {
//       newErrors.cvv = 'CVV is required.';
//       valid = false;
//     } else if (!/^\d{3}$/.test(formData.cvv.trim())) {
//       newErrors.cvv = 'CVV must be a 3-digit number.';
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       console.log('Form Submitted Successfully:', formData);
//       Alert.alert('Submitted successfully!');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <PlaceHolderHeading title="Name" />
//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={formData.Name}
//           onChangeText={(text) => handleInputChange('Name', text)}
//         />
//         {errors.Name && <Text style={styles.errorText}>{errors.Name}</Text>}

//         <PlaceHolderHeading title="Card Number" />
//         <TextInput
//           style={styles.input}
//           placeholder="XXXX XXXX XXXX XXXX"
//           value={formData.accountNumber}
//           onChangeText={(text) => handleInputChange('accountNumber', text)}
//           keyboardType="numeric"
//         />
//         {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}

//         <View style={styles.inputRow}>
//           <View style={styles.inputWrapper}>
//             <PlaceHolderHeading title="Expiry Date (MM/YY)" />
//             <TextInput
//               style={styles.input}
//               placeholder="MM/YY"
//               value={formData.expiryDate}
//               onChangeText={(text) => handleInputChange('expiryDate', text)}
//               keyboardType="numeric"
//             />
//             {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
//           </View>

//           <View style={styles.inputWrapper}>
//             <PlaceHolderHeading title="CVV" />
//             <TextInput
//               style={styles.input}
//               placeholder="CVV"
//               value={formData.cvv}
//               onChangeText={(text) => handleInputChange('cvv', text)}
//               secureTextEntry={true}
//               keyboardType="numeric"
//             />
//             {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
//           </View>
//         </View>

//         <PlaceHolderHeading title="Select Plan" />
//         <TouchableOpacity
//           style={styles.dropdown}
//           onPress={() => setPlanDropdownVisible(true)}
//         >
//           <Text style={styles.dropdownText}>
//             {formData.amount
//               ? amounts.find((item) => item.value === formData.amount)?.label
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
//                       handleInputChange('amount', item.value);
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

//         <MyButton
//           title="Submit"
//           style1={styles.submitButton}
//           style2={styles.submitButtonText}
//           onPress={handleSubmit}
//         />
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingTop:0,
//     padding: 20,
//     flex: 1,
//   },
//   scrollViewContent: {
//     paddingBottom: 20,paddingTop:10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#2ecc71',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   inputWrapper: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dropdown: {
//     borderWidth: 1,
//     borderColor: '#2ecc71',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   dropdownText: {
//     color: '#999',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//   },
//   option: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#2ecc71',
//   },
//   optionText: {
//     fontSize: 16,
//   },
//   closeButton: {
//     marginTop: 10,
//     alignSelf: 'center',
//   },
//   closeText: {
//     color: '#2ecc71',
//     fontSize: 16,
//   },
//   submitButton: {
//     marginTop: 5,
//     backgroundColor: '#2ecc71',
//     padding: 5,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//   },
// });

// export default PaymentForm;





// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   FlatList,
//   Alert,
//   KeyboardAvoidingView,
//   ScrollView,
//   Platform
// } from 'react-native';
// import MyButton from '@/components/Buttons/MyButton';
// import { CardField, useStripe } from '@stripe/stripe-react-native'; 
// import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';
// import styling from '@/assets/Styles/styling';

// interface FormData {
//   Name: string;
//   accountNumber: string;
//   expiryDate: string;
//   cvv: string;
//   amount: string;
// }

// const PaymentForm: React.FC = () => {
//   const { confirmPayment } = useStripe();
//   const [formData, setFormData] = useState<FormData>({
//     Name: '',
//     accountNumber: '',
//     expiryDate: '',
//     cvv: '',
//     amount: '',
//   });

//   const [errors, setErrors] = useState<Partial<FormData>>({});
//   const [planDropdownVisible, setPlanDropdownVisible] = useState(false);
//   const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [cardDetails, setCardDetails] = useState<any>(null); // Store card details here


//   const amounts: { label: string; value: string }[] = [
//     { label: '1 Month / 1500', value: '1500' },
//     { label: '3 Months / 4200', value: '4200' },
//     { label: '6 Months / 8300', value: '8300' },
//     { label: '1 Year / 16500', value: '16500' },
//   ];

//   const handleInputChange = (field: keyof FormData, value: string): void => {
//     let formattedValue = value;

//     if (field === 'accountNumber') {
//       formattedValue = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
//       if (formattedValue.length > 19) return;
//     }

//     if (field === 'expiryDate') {
//       formattedValue = value.replace(/[^0-9/]/g, '');
//       if (formattedValue.length === 2 && !value.includes('/')) {
//         formattedValue = formattedValue + '/';
//       }
//       if (formattedValue.length > 5) return;
//     }

//     if (field === 'cvv') {
//       formattedValue = value.replace(/[^0-9]/g, '');
//       if (formattedValue.length > 3) return;
//     }

//     setFormData((prev) => ({ ...prev, [field]: formattedValue }));
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validateForm = (): boolean => {
//     let valid = true;
//     const newErrors: Partial<FormData> = {};

//     if (!formData.Name.trim()) {
//       newErrors.Name = 'Name is required.';
//       valid = false;
//     }

//     if (!formData.amount) {
//       newErrors.amount = 'Please select a plan.';
//       valid = false;
//     }

//     if (!formData.accountNumber.trim()) {
//       newErrors.accountNumber = 'Card number is required.';
//       valid = false;
//     } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.accountNumber.trim())) {
//       newErrors.accountNumber = 'Card number must be in the format XXXX XXXX XXXX XXXX.';
//       valid = false;
//     }

//     if (!formData.expiryDate.trim()) {
//       newErrors.expiryDate = 'Expiry date is required.';
//       valid = false;
//     } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate.trim())) {
//       newErrors.expiryDate = 'Expiry date must be in MM/YY format.';
//       valid = false;
//     }

//     if (!formData.cvv.trim()) {
//       newErrors.cvv = 'CVV is required.';
//       valid = false;
//     } else if (!/^\d{3}$/.test(formData.cvv.trim())) {
//       newErrors.cvv = 'CVV must be a 3-digit number.';
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };
//   const handleSubmit = async () => {
//     if (validateForm()) {
//       try {
//         const response = await fetch('http://192.168.0.109:5000/api/payment-intent', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ amount: formData.amount }), // Ensure `formData.amount` is defined
//         });
  
//         const data = await response.json();
//         if (!data.clientSecret) {
//           Alert.alert('Invalid Card', 'Please check your card details and try again.');
//           throw new Error('Failed to fetch client secret');
//         }
  
//         setClientSecret(data.clientSecret);
  
//         // Simulate validating card details with Stripe API
//         const validation = await confirmPayment(data.clientSecret, {
//           paymentMethodType: 'Card',
//           paymentMethodData: {
//             billingDetails: {
//               name: formData.Name,
//             },
//           },
//         });
  
//         if (validation.error) {
//           Alert.alert('Invalid Card', validation.error.message || 'Invalid card details. Please check and try again.');
//           return;
//         }
  
//         setIsConfirmationVisible(true); // Show popup if the card is valid
//       } catch (error) {
//         Alert.alert('Error', 'Failed to validate the card. Please try again.');
//       }
//     }
//   };
  
//   const handlePayment = async () => {
//     if (!clientSecret) {
//       Alert.alert('Error', 'Client secret not available');
//       return;
//     }
  
//     try {
//       const { error, paymentIntent } = await confirmPayment(clientSecret, {
//         paymentMethodType: 'Card',
//         paymentMethodData: {
//           billingDetails: {
//             name: formData.Name,
//           },
//         },
//       });
  
//       if (error) {
//         Alert.alert('Payment Error', error.message || 'An error occurred during payment.');
//       } else if (paymentIntent && paymentIntent.status === 'Succeeded') {
//         Alert.alert('Payment Successful', 'Your payment was processed successfully.');
//         setIsConfirmationVisible(false);
//       } else {
//         Alert.alert('Payment Failed', 'The payment did not complete successfully.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Payment failed. Please try again.');
//     }
//   };
  
  
  
  
//   const handleChange = () => {
//     setIsConfirmationVisible(false);
//   };

//   const handleTransfer = () => {
//     Alert.alert('Payment Successful');
//     setIsConfirmationVisible(false);
//   };

//   const handleCancel = () => {
//     setIsConfirmationVisible(false);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <PlaceHolderHeading title="Name" />
//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={formData.Name}
//           onChangeText={(text) => handleInputChange('Name', text)}
//         />
//         {errors.Name && <Text style={styles.errorText}>{errors.Name}</Text>}

//         <PlaceHolderHeading title="Card Number" />
//         <TextInput
//           style={styles.input}
//           placeholder="XXXX XXXX XXXX XXXX"
//           value={formData.accountNumber}
//           onChangeText={(text) => handleInputChange('accountNumber', text)}
//           keyboardType="numeric"
//         />
//         {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}

//         <View style={styles.inputRow}>
//           <View style={styles.inputWrapper}>
//             <PlaceHolderHeading title="Expiry Date (MM/YY)" />
//             <TextInput
//               style={styles.input}
//               placeholder="MM/YY"
//               value={formData.expiryDate}
//               onChangeText={(text) => handleInputChange('expiryDate', text)}
//               keyboardType="numeric"
//             />
//             {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
//           </View>

//           <View style={styles.inputWrapper}>
//             <PlaceHolderHeading title="CVV" />
//             <TextInput
//               style={styles.input}
//               placeholder="CVV"
//               value={formData.cvv}
//               onChangeText={(text) => handleInputChange('cvv', text)}
//               secureTextEntry={true}
//               keyboardType="numeric"
//             />
//             {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
//           </View>
//         </View>

//         <PlaceHolderHeading title="Select Plan" />
//         <TouchableOpacity
//           style={styles.dropdown}
//           onPress={() => setPlanDropdownVisible(true)}
//         >
//           <Text style={styles.dropdownText}>
//             {formData.amount
//               ? amounts.find((item) => item.value === formData.amount)?.label
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
//                       handleInputChange('amount', item.value);
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

//         <MyButton
//           title="Submit"
//           style1={styles.submitButton}
//           style2={styles.submitButtonText}
//           onPress={handleSubmit}
//         />
//       </ScrollView>

//       {/* Confirmation Modal */}
//       <Modal visible={isConfirmationVisible} transparent animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Confirm Payment</Text>
//             <Text>Name: {formData.Name}</Text>
//             <Text>Card Number: {formData.accountNumber}</Text>
//             <Text>Expiry Date: {formData.expiryDate}</Text>
//             <Text>CVV: {formData.cvv}</Text>
//             <Text>Amount: {amounts.find((item) => item.value === formData.amount)?.label}</Text>

//             <View style={styles.buttonRow}>
              
//               <MyButton title={'Change'} onPress={handleChange} style1={styles.modalButton} style2={styles.modalButtonText}/>
//               <MyButton title={'Transfer'} onPress={handlePayment} style1={styles.modalButton} style2={styles.modalButtonText}/>
//               <MyButton title={'Cancel'} onPress={handleCancel} style1={styles.modalButton} style2={styles.modalButtonText}/>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 0,
//     padding: 20,
//     flex: 1,
//   },
//   scrollViewContent: {
//     paddingBottom: 20,
//     paddingTop: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#2ecc71',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   inputWrapper: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dropdown: {
//     borderWidth: 1,
//     borderColor: '#2ecc71',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   dropdownText: {
//     color: '#999',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,gap:10
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   modalButton: {
//     backgroundColor: '#2ecc71',
//     // padding: 10,
//     borderRadius: 5,
//     marginTop: 10,paddingVertical:10,
//     flex: 1,
//     marginRight: 10,
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   closeButton: {
//     marginTop: 10,
//     alignSelf: 'center',
//   },
//   closeText: {
//     color: '#2ecc71',
//     fontSize: 16,
//   },
//   submitButton: {
//     marginTop: 5,
//     backgroundColor: '#2ecc71',
//     padding: 5,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//   },option: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//   },
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

const PaymentForm: React.FC = () => {
  const { confirmPayment } = useStripe();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({ name: '', amount: '' });
  const [planDropdownVisible, setPlanDropdownVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<any>(null);

  const amounts = [
    { label: '1 Month / 1500', value: '1500' },
    { label: '3 Months / 4200', value: '4200' },
    { label: '6 Months / 8300', value: '8300' },
    { label: '1 Year / 16500', value: '16500' },
  ];

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
        const response = await fetch('http://192.168.0.109:5000/api/payment-intent', {
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
        router.navigate('/(User)/Dashboard')
      } else {
        Alert.alert('Payment Failed', 'The payment did not complete successfully.');
      }
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
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

        <MyButton
          title="Submit"
          style1={styles.submitButton}
          style2={styles.submitButtonText}
          onPress={handleSubmit}
        />
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
  },
});

export default PaymentForm;





