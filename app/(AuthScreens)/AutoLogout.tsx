
import React, { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { useRouter } from 'expo-router';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AutoLogout = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [backgroundTime, setBackgroundTime] = useState<number | null>(null); // Track when the app went to the background
  const router = useRouter();
  const logoutTimeout = 600000; // Timeout duration in milliseconds

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      appStateListener.remove();
    };
  }, [backgroundTime]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log('AppState changed: ', nextAppState);

    if (nextAppState === 'active') {
      setAppState(nextAppState);
      handleAppResumed(); // Handle app coming to the foreground
    } else if (nextAppState === 'background') {
      setAppState(nextAppState);
      setBackgroundTime(Date.now()); // Record the time when the app goes to the background
    }
  };

  const handleAppResumed = () => {
    if (backgroundTime) {
      const elapsedTime = Date.now() - backgroundTime;
      console.log('Elapsed time in background:', elapsedTime);

      if (elapsedTime >= logoutTimeout) {
        performLogout(); // Logout if elapsed time exceeds the timeout
      }
    }
  };

  const performLogout = () => {
    console.log('Logging out user due to inactivity...');
    signOut(auth)
      .then(() => {
        console.log('User successfully logged out.');
        router.push('/(AuthScreens)/login'); // Redirect to login page
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  return null; // This component does not render anything
};

export default AutoLogout;


// import React, { useEffect, useState } from 'react';
// import { AppState, AppStateStatus, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { initializeApp } from 'firebase/app';
// import { firebaseConfig } from './firebaseConfig';
// import { useRouter } from 'expo-router';

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// const AutoLogout = ({ children }: { children: React.ReactNode }) => {
//   const [appState, setAppState] = useState(AppState.currentState);
//   const [backgroundTime, setBackgroundTime] = useState<number | null>(null); // Track when the app went to the background
//   const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null); // Track logout timeout
//   const router = useRouter();
//   const logoutTimeout = 60000; // Timeout duration in milliseconds (e.g., 1 minute)

//   useEffect(() => {
//     const appStateListener = AppState.addEventListener('change', handleAppStateChange);

//     // Start the inactivity timer when the app loads
//     startInactivityTimer();

//     return () => {
//       appStateListener.remove();
//       if (logoutTimer) clearTimeout(logoutTimer);
//     };
//   }, [backgroundTime]);

//   const handleAppStateChange = (nextAppState: AppStateStatus) => {
//     console.log('AppState changed: ', nextAppState);

//     if (nextAppState === 'active') {
//       setAppState(nextAppState);
//       handleAppResumed(); // Handle app coming to the foreground
//     } else if (nextAppState === 'background') {
//       setAppState(nextAppState);
//       setBackgroundTime(Date.now()); // Record the time when the app goes to the background
//     }
//   };

//   const handleAppResumed = () => {
//     if (backgroundTime) {
//       const elapsedTime = Date.now() - backgroundTime;
//       console.log('Elapsed time in background:', elapsedTime);

//       if (elapsedTime >= logoutTimeout) {
//         performLogout(); // Logout if elapsed time exceeds the timeout
//       } else {
//         resetInactivityTimer(); // Reset the inactivity timer on resume
//       }
//     }
//   };

//   const startInactivityTimer = () => {
//     console.log('Starting inactivity timer...');
//     const timer = setTimeout(() => {
//       console.log('Inactivity timeout reached. Logging out...');
//       performLogout(); // Logout after inactivity timeout
//     }, logoutTimeout);

//     setLogoutTimer(timer);
//   };

//   const resetInactivityTimer = () => {
//     console.log('Resetting inactivity timer...');
//     if (logoutTimer) {
//       clearTimeout(logoutTimer); // Clear the existing timeout
//     }
//     startInactivityTimer(); // Start a new timeout
//   };

//   const performLogout = () => {
//     console.log('Logging out user due to inactivity...');
//     signOut(auth)
//       .then(() => {
//         console.log('User successfully logged out.');
//         router.push('/(AuthScreens)/login'); // Redirect to login page
//       })
//       .catch((error) => {
//         console.error('Error during logout:', error);
//       });
//   };

//   const handleUserInteraction = () => {
//     console.log('User activity detected. Resetting timer...');
//     resetInactivityTimer(); // Reset timer on any user interaction
//   };

//   return (
//     <TouchableWithoutFeedback
//       onPress={handleUserInteraction}
//       onPressIn={handleUserInteraction} // Trigger on press interaction
//     >
//       <View style={{ flex: 1 }} onTouchStart={handleUserInteraction}>
//         {children} {/* Render app content */}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default AutoLogout;



