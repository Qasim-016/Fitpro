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
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from './firebaseConfig';

// const Login = () => {
//   const router = useRouter();
//   const [form, setForm] = useState({
//     email: '',
//     password: '',
//   });

//   const [errors, setErrors] = useState({
//     email: '',
//     password: '',
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   // Regex patterns
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

//   const handleInputChange = (field: keyof typeof form, value: string) => {
//     setForm((prevForm) => ({ ...prevForm, [field]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [field]: '' })); // Clear error on input
//   };

//   const validateForm = (): boolean => {
//     const formErrors = { email: '', password: '' };
//     let isValid = true;

//     // Validate email
//     if (!form.email.trim().match(emailRegex)) {
//       formErrors.email = 'Please enter a valid email address (e.g., example@gmail.com)';
//       isValid = false;
//     }

//     // Validate password
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
//         // Firebase login integration
//         const userCredential = await signInWithEmailAndPassword(auth, form.email.trim(), form.password.trim());
//         const user = userCredential.user;

//         if (!user.emailVerified) {
//           Alert.alert('Verification Required', 'Please verify your email before logging in.');
//           return;
//         }

//         Alert.alert('Success', 'Login successful!');
//         router.push('/(User)/FreeTrial'); // Navigate after successful login
//       } catch (error: any) {
//         console.error('Login error:', error.message);
//         Alert.alert('Error', error.message || 'Login failed. Please try again.');
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

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={50}
//       >
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
//           bounces={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styling.subcontainer}>
//             <LogoImgForScreen path={require('@/assets/images/icon.png')} styles={styling.loginimg} />
//             <Heading title="Login" styles={styling.Heading} />
//             <Paragraph
//               paragraph="Enter your email address and password to access your account."
//               styles={styling.Paragraph}
//             />

//             <View style={styling.PlaceHolderView}>
//               <PlaceHolderHeading title="Email" />
//               <PlaceHolder
//                 placeholderText="abc123@gmail.com"
//                 value={form.email}
//                 onChangeText={(text) => handleInputChange('email', text)}
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
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import MyButton from '@/components/Buttons/MyButton';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import styling from '@/assets/Styles/styling';
import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';
import Heading from '@/components/Text/Heading';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Paragraph from '@/components/Text/Paragraph';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword ,sendEmailVerification} from 'firebase/auth';
import { auth } from './firebaseConfig';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' })); // Clear error on input
  };

  const validateForm = (): boolean => {
    const formErrors = { email: '', password: '' };
    let isValid = true;

    // Validate email
    if (!form.email.trim().match(emailRegex)) {
      formErrors.email = 'Please enter a valid email address (e.g., example@gmail.com)';
      isValid = false;
    }

    // Validate password
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
        // Firebase login integration
        const userCredential = await signInWithEmailAndPassword(auth, form.email.trim(), form.password.trim());
        const user = userCredential.user;
  
        if (!user.emailVerified) {
          // Send verification email
          await sendEmailVerification(user);
  
          Alert.alert(
            'Verification Required',
            'Your email is not verified. A verification link has been sent to your email address. Please check your inbox and verify your email before logging in.'
          );
          return;
        }
  
        // Fetch user data from Firestore
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // console.log("User Data from Firestore:", userData);
        } else {
          // console.log("No user data found in Firestore for this user.");
        }
  
        Alert.alert('Success', 'Login successful!');
        router.push('/(User)/FreeTrial'); // Navigate after successful login
      } catch (error: any) {
        // console.error('Login error:', error.message);
        Alert.alert(' Login failed. Please try again.');
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={50}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styling.subcontainer}>
            <LogoImgForScreen path={require('@/assets/images/icon.png')} styles={styling.loginimg} />
            <Heading title="Login" styles={styling.Heading} />
            <Paragraph
              paragraph="Enter your email address and password to access your account."
              styles={styling.Paragraph}
            />

            <View style={styling.PlaceHolderView}>
              <PlaceHolderHeading title="Email" />
              <PlaceHolder
                placeholderText="abc123@gmail.com"
                value={form.email}
                onChangeText={(text) => handleInputChange('email', text)}
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
