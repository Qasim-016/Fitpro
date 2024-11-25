// import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
// import React, { useState } from 'react';
// import { Link, useRouter } from 'expo-router';
// import MyButton from '@/components/Buttons/MyButton';
// import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
// import styling from '@/assets/Styles/styling';
// import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';
// import Heading from '@/components/Text/Heading';
// import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
// import Paragraph from '@/components/Text/Paragraph';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
// import { useEffect } from 'react';
// import { auth } from './firebaseConfig';
// import axios from 'axios';
// // const bcrypt = require('bcrypt')
// const Login = () => {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [errors, setErrors] = useState({ email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isTyping, setIsTyping] = useState(false); // Track if the user is typing

//   // Regex patterns
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
//   const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

//   // const handleInputChange = (field: keyof typeof form, value: string) => {
//   //   setForm((prevForm) => ({
//   //     ...prevForm,
//   //     [field]: value, // Update input without altering the case immediately
//   //   }));
//   //   setErrors((prevErrors) => ({
//   //     ...prevErrors,
//   //     [field]: '', // Clear error for the updated field
//   //   }));
//   // };
  
//   // const handleBlur = (field: keyof typeof form) => {
//   //   if (field === 'email') {
//   //     // Ensure email is stored in lowercase after user finishes typing
//   //     setForm((prevForm) => ({
//   //       ...prevForm,
//   //       email: prevForm.email.trim().toLowerCase(),
//   //     }));
//   //   }
//   // };

//   const handleInputChange = (field: keyof typeof form, value: string) => {
//     if (field === 'email') {
//       setIsTyping(true); // User is typing
//     }
//     setForm((prevForm) => ({
//       ...prevForm,
//       [field]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: '', // Clear error for the updated field
//     }));
//   };

//   // Automatically convert email to lowercase after user stops typing or when blurred
//   useEffect(() => {
//     if (!isTyping && form.email !== form.email.toLowerCase()) {
//       setForm((prevForm) => ({
//         ...prevForm,
//         email: prevForm.email.toLowerCase(), // Convert email to lowercase
//       }));
//     }
//   }, [isTyping, form.email]);

//   // Handle blur to stop tracking typing
//   const handleBlur = () => {
//     setIsTyping(false); // User has finished typing
//   };
  

//   const validateForm = (): boolean => {
//     const formErrors = { email: '', password: '' };
//     let isValid = true;

//     if (!form.email.trim().match(emailRegex)) {
//       formErrors.email = 'Please enter a valid email address (e.g., example@gmail.com)';
//       isValid = false;
//     }

//     if (!form.password.trim().match(passwordRegex)) {
//       formErrors.password = 'Password must be at least 8 characters, start with a capital letter, and include a number';
//       isValid = false;
//     }

//     setErrors(formErrors);
//     return isValid;
//   };

//   const loginUser = async (): Promise<void> => {
//     if (validateForm()) {
//       try {
//         // Send login request to the backend
//         const response = await axios.post('http://192.168.0.111:5000/api/auth/login', {
//           email: form.email.trim(),
//           password: form.password.trim(),
//         });
  
//         // Handle successful login
//         if (response.status === 200) {
          
//           Alert.alert('Success', 'Login successful!');
//           router.push('/(User)/FreeTrial'); // Navigate to the next screen
//         }
//       } catch (error: any) {
//         // Handle different error scenarios based on the backend response
//         if (error.response?.status === 404) {
//           Alert.alert('Error', 'User does not exist.');
//         } else if (error.response?.status === 401) {
//           Alert.alert('Error', 'Incorrect password.');
//         } else {
//           Alert.alert('Error', 'Login failed. Please try again later.');
//         }
//       }
//     } else {
//       Alert.alert('Error', 'Please correct the highlighted errors.');
//     }
//   };
  
  
//   return (
//     <SafeAreaView style={styling.container}>
//       <View style={styling.Backbtn}>
//         <MyButton
//           title={<LogoImgForScreen path={require('@/assets/images/weui_back-filled.png')} styles={styling.NextBackbtnimage} />}
//           onPress={() => router.back()}
//           style1={styling.button}
//           style2={styling.NextBackbtntext}
//         />
//         <Heading title="Login" styles={styling.HeaderText} />
//       </View>

//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={50}>
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
//           bounces={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styling.subcontainer}>
//             <LogoImgForScreen path={require('@/assets/images/icon.png')} styles={styling.loginimg} />
//             <Heading title="Login" styles={styling.Heading} />
//             <Paragraph paragraph="Enter your email address and password to access your account." styles={styling.Paragraph} />

//             <View style={styling.PlaceHolderView}>
//               <PlaceHolderHeading title="Email" />
//               <PlaceHolder
//                 placeholderText="abc123@gmail.com"
//                 value={form.email}
//                 onChangeText={(text) => handleInputChange('email', text)}
//                 onBlur={handleBlur}
//                 iconName="email"
//               />
//               {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}

//               <PlaceHolderHeading title="Password" />
//               <PlaceHolder
//                 placeholderText="**********"
//                 value={form.password}
//                 onChangeText={(text) => handleInputChange('password', text)}
//                 secureTextEntry={!showPassword}
//                 iconName=""
//                 showPassword={showPassword}
//                 onTogglePassword={() => setShowPassword(!showPassword)}
//               />
//               {errors.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>}
//             </View>

//             <MyButton
//               title="Login"
//               onPress={loginUser}
//               style1={styling.FullWidthbutton}
//               style2={styling.FullwidthbtnText}
//             />

//             <Link href="/(AuthScreens)/ForgotPass" style={styling.Link1}>
//               Forgot Password?
//             </Link>
//           </View>

//           <Link href="/(AuthScreens)/signup" style={styling.Link2}>
//             Don't have an account? <Text style={styling.Link3Text}>Create Account</Text>
//           </Link>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default Login;


import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import MyButton from '@/components/Buttons/MyButton';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import styling from '@/assets/Styles/styling';
import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';
import Heading from '@/components/Text/Heading';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Paragraph from '@/components/Text/Paragraph';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Track if the user is typing

  // Regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Handle input change with a check for email field
  const handleInputChange = (field: keyof typeof form, value: string) => {
    if (field === 'email') {
      setIsTyping(true); // User is typing
    }
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '', // Clear error for the updated field
    }));
  };

  // Automatically convert email to lowercase after user stops typing or when blurred
  useEffect(() => {
    if (!isTyping && form.email !== form.email.toLowerCase()) {
      setForm((prevForm) => ({
        ...prevForm,
        email: prevForm.email.toLowerCase(), // Convert email to lowercase
      }));
    }
  }, [isTyping, form.email]);

  // Handle blur to stop tracking typing
  const handleBlur = () => {
    setIsTyping(false); // User has finished typing
  };

  const validateForm = (): boolean => {
    const formErrors = { email: '', password: '' };
    let isValid = true;

    if (!form.email.trim().match(emailRegex)) {
      formErrors.email = 'Please enter a valid email address (e.g., example@gmail.com)';
      isValid = false;
    }

    if (!form.password.trim().match(passwordRegex)) {
      formErrors.password = 'Password must be at least 8 characters, start with a capital letter, and include a number';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const loginUser = async (): Promise<void> => {
    if (validateForm()) {
      try {
        // Convert email to lowercase before sending to backend
        const emailLowercase = form.email.trim().toLowerCase();
        
        // Send login request to the backend with the lowercase email
        const response = await axios.post('http://192.168.0.111:5000/api/auth/login', {
          email: emailLowercase, // Send lowercase email to backend
          password: form.password.trim(),
        });
  
        // Handle successful login
        if (response.status === 200) {
          // Alert.alert('Success', 'Login successful!');
          router.push('/(User)/FreeTrial'); // Navigate to the next screen
        }
      } catch (error: any) {
        // Handle different error scenarios based on the backend response
        if (error.response?.status === 404) {
          Alert.alert('Error', 'User does not exist.');
        } else if (error.response?.status === 401) {
          Alert.alert('Error', 'Incorrect password.');
        } else {
          Alert.alert('Error', 'Login failed. Please try again later.');
        }
      }
    } else {
      Alert.alert('Error', 'Please correct the highlighted errors.');
    }
  };

  return (
    <SafeAreaView style={styling.container}>
      <View style={styling.Backbtn}>
        <MyButton
          title={<LogoImgForScreen path={require('@/assets/images/weui_back-filled.png')} styles={styling.NextBackbtnimage} />}
          onPress={() => router.back()}
          style1={styling.button}
          style2={styling.NextBackbtntext}
        />
        <Heading title="Login" styles={styling.HeaderText} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={50}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styling.subcontainer}>
            <LogoImgForScreen path={require('@/assets/images/icon.png')} styles={styling.loginimg} />
            <Heading title="Login" styles={styling.Heading} />
            <Paragraph paragraph="Enter your email address and password to access your account." styles={styling.Paragraph} />

            <View style={styling.PlaceHolderView}>
              <PlaceHolderHeading title="Email" />
              <PlaceHolder
                placeholderText="abc123@gmail.com"
                value={form.email}
                onChangeText={(text) => handleInputChange('email', text)}
                onBlur={handleBlur}
                iconName="email"
              />
              {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}

              <PlaceHolderHeading title="Password" />
              <PlaceHolder
                placeholderText="**********"
                value={form.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry={!showPassword}
                iconName=""
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
              {errors.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>}
            </View>

            <MyButton
              title="Login"
              onPress={loginUser}
              style1={styling.FullWidthbutton}
              style2={styling.FullwidthbtnText}
            />

            <Link href="/(AuthScreens)/ForgotPass" style={styling.Link1}>
              Forgot Password?
            </Link>
          </View>

          <Link href="/(AuthScreens)/signup" style={styling.Link2}>
            Don't have an account? <Text style={styling.Link3Text}>Create Account</Text>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;