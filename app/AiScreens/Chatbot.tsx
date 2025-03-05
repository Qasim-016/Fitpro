import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
// import auth from '@react-native-firebase/auth'; 
import { auth } from '../(AuthScreens)/firebaseConfig';// Import Firebase auth
import styling from '@/assets/Styles/styling';
// import { Auth } from 'firebase/auth';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import MyButton from '@/components/Buttons/MyButton';
import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Heading from '@/components/Text/Heading';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

// Helper to format date labels (e.g., "Today", "Yesterday", or date)
const formatDateLabel = (date: Date) => {
  const today = new Date();
  const diffInDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  return date.toLocaleDateString();
};

// Helper to format time (e.g., "09:30 AM")
const formatTimeLabel = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Chatbot = () => {
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { sender: string; message: string; timestamp?: string; date?: string }[]
  >([]);
  const [showIntroScreen, setShowIntroScreen] = useState(true); // Track whether intro screen is visible
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false); // Track header background
  const [showFAQs, setShowFAQs] = useState(true); // Track if FAQs should be shown
  const scrollViewRef = useRef<ScrollView>(null);
  const [userId, setUserId] = useState<string | null>(null); // Store the user ID


  const FAQs = [
    'What workouts suit me?, Tell me.',
    'Track my diet?',
    'Gym timings?',
    'What is my workout plan?',
    ' What workouts suit me?, Tell me in detail.',
    'What is my workout plan?',
    'Gym timings Are?... ',
  ];

  // Get the user ID from Firebase Authentication
  useEffect(() => {
    const fetchUserId = () => {
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        setUserId(currentUser.uid);
      }
    };

    fetchUserId();
  }, []);

  // Track keyboard visibility
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      setShowFAQs(false); // Hide FAQs when keyboard is shown
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setShowFAQs(true); // Show FAQs when keyboard is hidden
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleInputChange = (text: string) => {
    setUserQuestion(text);
    if (text.trim()) {
      setShowFAQs(false); // Hide FAQs and intro image when typing
    } else {
      setShowFAQs(true); // Show FAQs again when input is cleared
    }
  };

  const handleSubmitQuestion = async () => {
    if (userQuestion.trim() && userId) {
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const currentDate = now.toISOString().split('T')[0]; // Get date only (YYYY-MM-DD)

      const newMessage = { sender: 'user', message: userQuestion, timestamp: currentTime, date: currentDate };
      let updatedChatHistory = [...chatHistory, newMessage];

      // Fetch response from backend
      try {
        const response = await axios.post('http://192.168.0.116:5000/api/chatbot', { question: userQuestion });
        const botResponse = response.data.answer || "Sorry, I couldn't get an answer.";
        // insufficient balance: 4000 0000 0000 9995
        // payment successfull : 4242 4242 4242 4242
        // Add the bot's reply to the chat history
        updatedChatHistory = [
          ...updatedChatHistory,
          { sender: 'bot', message: botResponse, timestamp: currentTime, date: currentDate },
        ];

        setChatHistory(updatedChatHistory);
        setShowIntroScreen(false);
        setUserQuestion('');

        // Persist chat history for this user
        const key = `chatHistory_${userId}`;
        await AsyncStorage.setItem(key, JSON.stringify(updatedChatHistory));
      } catch (error) {
        console.error("Error fetching bot response:", error);
      }
    }
  };

  const handleFAQSelect = (faq: string) => {
    setUserQuestion(faq);
    handleSubmitQuestion();
    setShowIntroScreen(false); // Hide intro screen and show chat screen
  };

  useEffect(() => {
    const initializeChat = async () => {
      if (userId) {
        const key = `chatHistory_${userId}`;
        const savedChatHistory = await AsyncStorage.getItem(key);

        if (savedChatHistory) {
          setChatHistory(JSON.parse(savedChatHistory));
        }
      }
    };

    initializeChat();
  }, [userId]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setHeaderBackground(scrollY > 10); // Show solid background if scrollY > 10
  };

  const renderChatHistory = () => {
    let lastRenderedDate = '';

    return chatHistory.map((chat, index) => {
      const showDateLabel = chat.date && chat.date !== lastRenderedDate;
      lastRenderedDate = chat.date || lastRenderedDate;

      return (
        <React.Fragment key={index}>
          {showDateLabel && chat.date && (
            <Text style={styling.dateLabelText}>{formatDateLabel(new Date(chat.date))}</Text>
          )}
          <View
            style={
              chat.sender === 'user'
                ? styling.userMessage
                : chat.sender === 'bot'
                  ? styling.botMessage
                  : styling.systemMessage
            }
          >
            <Text style={styling.chatMessageText}>{chat.message}</Text>
            <View style={styling.timestampContainer}>
              <Text style={styling.timestampText}>{chat.timestamp}</Text>
            </View>
          </View>
        </React.Fragment>
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header with dynamic background */}
      <View
        style={[
          styling.ChatBotHeadercontainer,

        ]}
      >
        {showIntroScreen ? (
          <MyButton
            title={
              <LogoImgForScreen
                path={require('@/assets/images/Chatbot/back.png')}
                styles={styling.NextBackbtnimage}
              />
            }
            onPress={() => router.push('/(User)/Dashboard')} // Go to the dashboard when intro screen back button is clicked
            style1={styling.button}
            style2={styling.NextBackbtntext}
          />
        ) : (
          <MyButton
            title={
              <LogoImgForScreen
                path={require('@/assets/images/Chatbot/back.png')}
                styles={styling.NextBackbtnimage}
              />
            }
            onPress={() => setShowIntroScreen(true)} // Go back to the intro screen when chat screen back button is clicked
            style1={styling.button}
            style2={styling.NextBackbtntext}
          />
        )}
        <LogoImgForScreen path={require('@/assets/images/Chatbot/main.png')} styles={styling.ChatbotHeader} />
        <Heading title={'FitPro AI'} styles={styling.HeaderText} />
      </View>

      {showIntroScreen ? (
        <View style={styling.introScreenContainer}>
          <Image source={require('@/assets/images/Chatbot/main.png')} style={styling.introImage} />
          <Heading title="Ask FitPro AI Anything" styles={styling.Heading} />
          {showFAQs && (
            <View style={styling.Faqcontainer}>
              {FAQs.map((faq, index) => (
                <TouchableOpacity key={index} onPress={() => handleFAQSelect(faq)}>
                  <Text style={styling.faqText}>{faq}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={styling.inputbuttonContainer}>
            <PlaceHolder
              placeholderText="Ask me anything..."
              value={userQuestion}
              onChangeText={handleInputChange}
              style={{ flex: 1, marginRight: 10 }}
              onFocus={() => setShowIntroScreen(false)} // Hide intro screen when user clicks on placeholder
            />
            <MyButton
              title={
                <Dashboardscreenimage
                  path={require('@/assets/images/Chatbot/Send-06.png')}
                  styles={styling.chatsendmessageimage}
                />
              }
              onPress={handleSubmitQuestion}
              style1={[
                styling.submitButton,
                {
                  backgroundColor: userQuestion.trim() ? '#2ecc71' : '#2ecc70',
                },
              ]}
              style2={styling.submitButtonText}
              disabled={!userQuestion.trim()}
            />
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styling.chatHistoryContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollViewRef}
          >
            {renderChatHistory()}
          </ScrollView>

          <View style={styling.inputAndButtonContainer}>
            <PlaceHolder
              placeholderText="Ask me anything..."
              value={userQuestion}
              onChangeText={handleInputChange}
              style={{ flex: 1, marginRight: 10 }}
            />
            <MyButton
              title={
                <Dashboardscreenimage
                  path={require('@/assets/images/Chatbot/Send-06.png')}
                  styles={styling.chatsendmessageimage}
                />
              }
              onPress={handleSubmitQuestion}
              style1={[
                styling.submitButton,
                {
                  backgroundColor: userQuestion.trim() ? '#2ecc71' : '#2ecc70',
                },
              ]}
              style2={styling.submitButtonText}
              disabled={!userQuestion.trim()}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default Chatbot;




