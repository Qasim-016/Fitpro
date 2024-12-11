// import React, { useEffect, useState } from 'react';
// import { View, ActivityIndicator, SafeAreaView } from 'react-native';
// import { useRouter } from 'expo-router';
// import Heading from '@/components/Text/Heading';
// import styling from '@/assets/Styles/styling';
// import LogoImg from '@/components/ScreenImages/LogoImgForScreen';
// import AutoLogout from './(AuthScreens)/AutoLogout';
// import { LogBox } from 'react-native';

// // Suppress Firebase Auth warning
// LogBox.ignoreLogs([
//   '@firebase/auth: Auth', // Matches the specific warning
// ]);
// const originalWarn = console.warn;
// console.warn = (message, ...args) => {
//   if (message.includes('@firebase/auth: Auth')) {
//     return; // Skip specific warning
//   }
//   originalWarn(message, ...args); // Call original warn for other messages
// };

// const Index = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   const welcome = () => {
//     router.push('/intro1'); // Navigate to intro screen
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//       welcome();
//     }, 1000); // Simulate loading for 1 second
//     return () => clearTimeout(timer); // Clean up timer on unmount
//   }, []);

//   return (
//     <SafeAreaView style={styling.container}>
//       <AutoLogout/>
//         <LogoImg path={require('@/assets/images/intro/splash.png')} styles={styling.Indeximg} />
//         <View style={styling.IndexView}>
//           {loading ? (
//             <>
//               <ActivityIndicator size={50} color="#2ecc71" />
//               <Heading title="Loading..." styles={styling.TextwithColor} />
//             </>
//           ) : null}
//         </View>
//     </SafeAreaView>
//   );

// };
// export default Index;



import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Heading from '@/components/Text/Heading';
import styling from '@/assets/Styles/styling';
import LogoImg from '@/components/ScreenImages/LogoImgForScreen';
import AutoLogout from './(AuthScreens)/AutoLogout';
import { LogBox } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';

// Suppress Firebase Auth warning
LogBox.ignoreLogs([
  '@firebase/auth: Auth', // Matches the specific warning
]);
const originalWarn = console.warn;
console.warn = (message, ...args) => {
  if (message.includes('@firebase/auth: Auth')) {
    return; // Skip specific warning
  }
  originalWarn(message, ...args); // Call original warn for other messages
};

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const welcome = () => {
    router.push('/intro1'); // Navigate to intro screen
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      welcome();
    }, 1000); // Simulate loading for 1 second
    return () => clearTimeout(timer); // Clean up timer on unmount
  }, []);

  return (
    <StripeProvider publishableKey="pk_test_51QQorvDwtEPD58vaMZbz1YntQIM2RmEGqgccF7CwB2iMSB8KceswRbcQdkwERI96ERRAXffCYRxgV4oouiX8zl1k002VZTVUUM">

    <SafeAreaView style={styling.container}>
      <AutoLogout/>
        <LogoImg path={require('@/assets/images/intro/splash.png')} styles={styling.Indeximg} />
        <View style={styling.IndexView}>
          {loading ? (
            <>
              <ActivityIndicator size={50} color="#2ecc71" />
              <Heading title="Loading..." styles={styling.TextwithColor} />
            </>
          ) : null}
        </View>
    </SafeAreaView>
          </StripeProvider>
  );

};
export default Index;
