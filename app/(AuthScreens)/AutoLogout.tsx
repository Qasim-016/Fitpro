
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


