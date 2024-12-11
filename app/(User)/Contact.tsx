// import { View, Text } from 'react-native'
// import React from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import styling from '@/assets/Styles/styling'
// import MyButton from '@/components/Buttons/MyButton'
// import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen'
// import Heading from '@/components/Text/Heading'
// import PlaceHolder from '@/components/PlaceHolder/PlaceHolder'
// import { useState } from 'react'
// import { useRouter } from 'expo-router'
// const usernameRegex = /^[A-Za-z ]+$/; // Only letters and spaces allowed
// const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

// const Contact = () => {
//     const router = useRouter();
//     const [formData, setFormData] = useState({
//         username: '',
//         email: '',
       
//       });
//     const [errors, setErrors] = useState({
//         username: '',
//         email: '',
//       });
//     const handleChange = (name:string, value:string) => {
//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           [name]: value,
//         }));
//       };
//     const handleBlur = (name:string) => {
//         if (name === 'email') {
//           setFormData((prevFormData) => ({
//             ...prevFormData,
//             email: prevFormData.email.toLowerCase(),
//           }));
//         }
//       };
//     const validateForm = () => {
//         const { username, email} = formData;
//         let formErrors = { ...errors };
    
//         formErrors.username = username.match(usernameRegex) ? '' : 'Username can only contain letters and spaces';
//         formErrors.email = email.match(emailRegex) ? '' : 'Please enter a valid Gmail address (e.g., example@gmail.com)';
    
//         setErrors(formErrors);
    
//         return Object.values(formErrors).every((error) => error === '');
//       };
//   return (
//     <SafeAreaView style={styling.container}>
//       <View style={styling.Backbtn}>
//         <MyButton
//           title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
//           onPress={() => router.navigate('/(User)/Dashboard')}
//           style1={styling.button}
//           style2={styling.NextBackbtntext}
//         />
//         <Heading title="Contact" styles={styling.HeaderText} />
//       </View>
//             <View style={styling.subcontainercontact}>
//             <PlaceHolder
//                 placeholderText={'Ali Ahmed'}
//                 value={formData.username}
//                 onChangeText={(value) => handleChange('username', value)}
//                 onBlur={() => handleBlur('email')}
//                 iconName="person"
//                 />
//               {errors.username && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username}</Text>}
//               <PlaceHolder
//                 placeholderText={'abc123@gmail.com'}
//                 value={formData.email}
//                 onChangeText={(value) => handleChange('email', value)}
//                 onBlur={() => handleBlur('email')}
//                 iconName="email"
//                 />
//               {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}
//             </View>
//     </SafeAreaView>
//   )
// }

// export default Contact


import { View, Text, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styling from '@/assets/Styles/styling';
import MyButton from '@/components/Buttons/MyButton';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Heading from '@/components/Text/Heading';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
const usernameRegex = /^[A-Za-z ]+$/; // Only letters and spaces allowed
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

const Contact = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: '', // Added state for message
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    message: '', // Error state for message
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleBlur = (name: string) => {
    if (name === 'email') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: prevFormData.email.toLowerCase(),
      }));
    }
  };

  const validateForm = () => {
    const { username, email, message } = formData;
    let formErrors = { ...errors };

    formErrors.username = username.match(usernameRegex)
      ? ''
      : 'Username can only contain letters and spaces';
    formErrors.email = email.match(emailRegex)
      ? ''
      : 'Please enter a valid Gmail address (e.g., example@gmail.com)';
    formErrors.message = message.trim() !== '' ? '' : 'Message cannot be empty'; // Validation for message

    setErrors(formErrors);

    return Object.values(formErrors).every((error) => error === '');
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await fetch('http://192.168.0.109:5000/api/auth/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        const result = await response.json();
        if (response.ok) {
          Alert.alert('Success', result.message);
          setFormData({ username: '', email: '', message: '' }); // Reset form
        } else {
          Alert.alert('Error', result.error || 'Failed to submit the form');
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to connect to the server');
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={styling.container}>
      <View style={styling.Backbtn}>
        <MyButton
          title={
            <LogoImgForScreen
              path={require('@/assets/images/Chatbot/back.png')}
              styles={styling.NextBackbtnimage}
            />
          }
          onPress={() => router.navigate('/(User)/Dashboard')}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Contact" styles={styling.HeaderText} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={50}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >

      <View style={styling.subcontainercontact}>
      <LogoImgForScreen path={require('@/assets/images/icon.png')} styles={styling.loginimg} />

        {/* Username Input */}
        <PlaceHolder
          placeholderText={'Ali Ahmed'}
          value={formData.username}
          onChangeText={(value) => handleChange('username', value)}
          onBlur={() => handleBlur('username')}
          iconName="person"
          />
        {errors.username && (
          <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username}</Text>
        )}

        {/* Email Input */}
        <PlaceHolder
          placeholderText={'abc123@gmail.com'}
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          onBlur={() => handleBlur('email')}
          iconName="email"
          />
        {errors.email && (
            <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>
        )}

        {/* Message Input */}
        <PlaceHolder
          placeholderText={'Enter your message here'}
          value={formData.message}
          onChangeText={(value) => handleChange('message', value)}
          iconName="message" // Use a suitable icon name
          multiline={true} // Allows multi-line input
          numberOfLines={4}
          style={{
              height: 150, // Height set to 3 times (approximately) the height of other inputs
            }} // Optional: Suggests 4 lines in the input field
            />
        {errors.message && (
            <Text style={{ color: 'red', marginBottom: 10 }}>{errors.message}</Text>
        )}
        <MyButton title="Submit" onPress={handleSubmit} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText}/>
      </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Contact;
