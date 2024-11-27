
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
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import styling from '@/assets/Styles/styling';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import MyButton from '@/components/Buttons/MyButton';
import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Heading from '@/components/Text/Heading';

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
  const [showIntroScreen, setShowIntroScreen] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false); // Track header background
  const scrollViewRef = useRef<ScrollView>(null);

  const FAQs = [
    'What workouts suit me?, Tell me.',
    'Track my diet?',
    'Gym timings?',
    'What is my workout plan?',
  ];

  const handleInputChange = (text: string) => setUserQuestion(text);

  const handleSubmitQuestion = async () => {
    if (userQuestion.trim()) {
      const now = new Date();
      const currentTime = formatTimeLabel(now);
      const currentDate = now.toISOString().split('T')[0]; // Get date only (YYYY-MM-DD)

      const newMessage = { sender: 'user', message: userQuestion, timestamp: currentTime, date: currentDate };

      let updatedChatHistory = [...chatHistory, newMessage];

      // Simulate chatbot response
      const chatbotResponse = 'Hi, how can I help you today?';
      updatedChatHistory = [
        ...updatedChatHistory,
        { sender: 'bot', message: chatbotResponse, timestamp: currentTime, date: currentDate },
      ];

      setChatHistory(updatedChatHistory);
      setUserQuestion('');
      setShowIntroScreen(false);

      // Persist chat history
      await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
    }
  };

  const handleFAQSelect = (faq: string) => {
    setUserQuestion(faq);
    handleSubmitQuestion();
    setShowIntroScreen(false);
  };

  useEffect(() => {
    const initializeChat = async () => {
      const savedChatHistory = await AsyncStorage.getItem('chatHistory');

      if (savedChatHistory) {
        setChatHistory(JSON.parse(savedChatHistory));
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  // Track keyboard visibility
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
          { backgroundColor: headerBackground ? '#2ecc71' : 'transparent' },
        ]}
      >
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
        <LogoImgForScreen path={require('@/assets/images/Chatbot/main.png')} styles={styling.ChatbotHeader} />
        <Heading title={'FitPro AI'} styles={styling.HeaderText} />
      </View>

      {showIntroScreen ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: keyboardVisible ? 'flex-start' : 'center',
            }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styling.introScreenContainer}>
              <Image source={require('@/assets/images/Chatbot/main.png')} style={styling.introImage} />
              <Heading title="Ask FitPro AI Anything" styles={styling.Heading} />
              <View style={styling.Faqcontainer}>
                {FAQs.map((faq, index) => (
                  <TouchableOpacity key={index} onPress={() => handleFAQSelect(faq)}>
                    <Text style={styling.faqText}>{faq}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styling.inputbuttonContainer}>
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styling.chatHistoryContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollViewRef}
          >
            {renderChatHistory()}
          </ScrollView>

          <View
            style={[
              styling.inputAndButtonContainer,
              { backgroundColor: headerBackground ? 'transparent' : 'transparent' },
            ]}
          >
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