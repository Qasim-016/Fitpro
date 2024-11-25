// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth ,sendEmailVerification} from 'firebase/auth';

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVjzwlfUllCSXUxJqhfeSRJf8U0wCogbI",
  authDomain: "firpro-8f42f.firebaseapp.com",
  projectId: "firpro-8f42f",
  storageBucket: "firpro-8f42f.firebasestorage.app",
  messagingSenderId: "1066686129143",
  appId: "1:1066686129143:web:2cdbc215a1008ea874c4f2",
  measurementId: "G-9HEHL5PJRB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase authentication instance
export const auth = getAuth(app);
