import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Replace with your Firebase project configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCVjzwlfUllCSXUxJqhfeSRJf8U0wCogbI",
  authDomain: "firpro-8f42f.firebaseapp.com",
  projectId: "firpro-8f42f",
  storageBucket: "firpro-8f42f.firebasestorage.app",
messagingSenderId: "1066686129143",
  appId: "1:1066686129143:web:2cdbc215a1008ea874c4f2",
  measurementId: "G-9HEHL5PJRB"
};

// ✅ Ensure Firebase is initialized only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firebase authentication instance
export const auth = getAuth(app);
export { app };