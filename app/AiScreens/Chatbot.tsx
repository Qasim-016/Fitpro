
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   TouchableOpacity,
//   Keyboard,
//   Animated,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import styling from '@/assets/Styles/styling';
// import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
// import MyButton from '@/components/Buttons/MyButton';
// import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';
// import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
// import Heading from '@/components/Text/Heading';

// // Helper to format date labels (e.g., "Today", "Yesterday", or date)
// const formatDateLabel = (date: Date) => {
//   const today = new Date();
//   const diffInDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

//   if (diffInDays === 0) return 'Today';
//   if (diffInDays === 1) return 'Yesterday';
//   return date.toLocaleDateString();
// };

// // Helper to format time (e.g., "09:30 AM")
// const formatTimeLabel = (date: Date) => {
//   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// };

// const Chatbot = () => {
//   const [userQuestion, setUserQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState<
//     { sender: string; message: string; timestamp?: string; date?: string }[]
//   >([]);
//   const [showIntroScreen, setShowIntroScreen] = useState(true);
//   const [keyboardVisible, setKeyboardVisible] = useState(false);
//   const [headerBackground, setHeaderBackground] = useState(false); // Track header background
//   const scrollViewRef = useRef<ScrollView>(null);

//   const FAQs = [
//     'What workouts suit me?, Tell me.',
//     'Track my diet?',
//     'Gym timings?',
//     'What is my workout plan?','What workouts suit me?, Tell me.',
//     'Track my diet?',
//     'Gym timings?',
//     'What is my workout plan?',
//   ];

//   const handleInputChange = (text: string) => setUserQuestion(text);

//   const handleSubmitQuestion = async () => {
//     if (userQuestion.trim()) {
//       const now = new Date();
//       const currentTime = formatTimeLabel(now);
//       const currentDate = now.toISOString().split('T')[0]; // Get date only (YYYY-MM-DD)

//       const newMessage = { sender: 'user', message: userQuestion, timestamp: currentTime, date: currentDate };

//       let updatedChatHistory = [...chatHistory, newMessage];

//       // Simulate chatbot response
//       const chatbotResponse = 'Hi, how can I help you today?';
//       updatedChatHistory = [
//         ...updatedChatHistory,
//         { sender: 'bot', message: chatbotResponse, timestamp: currentTime, date: currentDate },
//       ];

//       setChatHistory(updatedChatHistory);
//       setUserQuestion('');
//       setShowIntroScreen(false);

//       // Persist chat history
//       await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
//     }
//   };

//   const handleFAQSelect = (faq: string) => {
//     setUserQuestion(faq);
//     handleSubmitQuestion();
//     setShowIntroScreen(false);
//   };

//   useEffect(() => {
//     const initializeChat = async () => {
//       const savedChatHistory = await AsyncStorage.getItem('chatHistory');

//       if (savedChatHistory) {
//         setChatHistory(JSON.parse(savedChatHistory));
//       }
//     };

//     initializeChat();
//   }, []);

//   useEffect(() => {
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollToEnd({ animated: true });
//     }
//   }, [chatHistory]);

//   // Track keyboard visibility
//   useEffect(() => {
//     const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
//       setKeyboardVisible(true);
//     });
//     const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
//       setKeyboardVisible(false);
//     });

//     return () => {
//       showSubscription.remove();
//       hideSubscription.remove();
//     };
//   }, []);

//   const handleScroll = (event: any) => {
//     const scrollY = event.nativeEvent.contentOffset.y;
//     setHeaderBackground(scrollY > 10); // Show solid background if scrollY > 10
//   };

//   const renderChatHistory = () => {
//     let lastRenderedDate = '';

//     return chatHistory.map((chat, index) => {
//       const showDateLabel = chat.date && chat.date !== lastRenderedDate;
//       lastRenderedDate = chat.date || lastRenderedDate;

//       return (
//         <React.Fragment key={index}>
//           {showDateLabel && chat.date && (
//             <Text style={styling.dateLabelText}>{formatDateLabel(new Date(chat.date))}</Text>
//           )}
//           <View
//             style={
//               chat.sender === 'user'
//                 ? styling.userMessage
//                 : chat.sender === 'bot'
//                 ? styling.botMessage
//                 : styling.systemMessage
//             }
//           >
//             <Text style={styling.chatMessageText}>{chat.message}</Text>
//             <View style={styling.timestampContainer}>
//               <Text style={styling.timestampText}>{chat.timestamp}</Text>
//             </View>
//           </View>
//         </React.Fragment>
//       );
//     });
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       {/* Header with dynamic background */}
//       <View
//         style={[
//           styling.ChatBotHeadercontainer,
         
//         ]}
//       >
//         <MyButton
//           title={
//             <LogoImgForScreen
//               path={require('@/assets/images/Chatbot/back.png')}
//               styles={styling.NextBackbtnimage}
//             />
//           }
//           onPress={() => router.navigate('/(User)/Dashboard')}
//           style1={styling.button}
//           style2={styling.NextBackbtntext}
//         />
//         <LogoImgForScreen path={require('@/assets/images/Chatbot/main.png')} styles={styling.ChatbotHeader} />
//         <Heading title={'FitPro AI'} styles={styling.HeaderText} />
//       </View>

//       {showIntroScreen ? (
//         // <KeyboardAvoidingView
//         //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         //   style={{ flex: 1 }}
//         // >
//         //   <ScrollView
//         //     contentContainerStyle={{
//         //       flexGrow: 1,
//         //       justifyContent: keyboardVisible ? 'flex-start' : 'center',
//         //     }}
//           //   onScroll={handleScroll}
//           //   scrollEventThrottle={16}
//           //   keyboardShouldPersistTaps="handled"
//           // >
//             <View style={styling.introScreenContainer}>
//               <Image source={require('@/assets/images/Chatbot/main.png')} style={styling.introImage} />
//               <Heading title="Ask FitPro AI Anything" styles={styling.Heading} />
//               <View style={styling.Faqcontainer}>
//                 {FAQs.map((faq, index) => (
//                   <TouchableOpacity key={index} onPress={() => handleFAQSelect(faq)}>
//                     <Text style={styling.faqText}>{faq}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               <View style={styling.inputbuttonContainer}>
//                 <PlaceHolder
//                   placeholderText="Ask me anything..."
//                   value={userQuestion}
//                   onChangeText={handleInputChange}
//                   style={{ flex: 1, marginRight: 10 }}
//                 />
//                 <MyButton
//                   title={
//                     <Dashboardscreenimage
//                       path={require('@/assets/images/Chatbot/Send-06.png')}
//                       styles={styling.chatsendmessageimage}
//                     />
//                   }
//                   onPress={handleSubmitQuestion}
//                   style1={[
//                     styling.submitButton,
//                     {
//                       backgroundColor: userQuestion.trim() ? '#2ecc71' : '#2ecc70',
//                     },
//                   ]}
//                   style2={styling.submitButtonText}
//                   disabled={!userQuestion.trim()}
//                 />
//               </View>
//             </View>
//         //   </ScrollView>
//         // </KeyboardAvoidingView>
//       ) : (
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={{ flex: 1 }}
//         >
//           <ScrollView
//             contentContainerStyle={styling.chatHistoryContainer}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//             ref={scrollViewRef}
//           >
//             {renderChatHistory()}
//           </ScrollView>

//           <View
//             style={[
//               styling.inputAndButtonContainer,
//               { backgroundColor: headerBackground ? 'transparent' : 'transparent' },
//             ]}
//           >
//             <PlaceHolder
//               placeholderText="Ask me anything..."
//               value={userQuestion}
//               onChangeText={handleInputChange}
//               style={{ flex: 1, marginRight: 10 }}
//             />
//             <MyButton
//               title={
//                 <Dashboardscreenimage
//                   path={require('@/assets/images/Chatbot/Send-06.png')}
//                   styles={styling.chatsendmessageimage}
//                 />
//               }
//               onPress={handleSubmitQuestion}
//               style1={[
//                 styling.submitButton,
//                 {
//                   backgroundColor: userQuestion.trim() ? '#2ecc71' : '#2ecc70',
//                 },
//               ]}
//               style2={styling.submitButtonText}
//               disabled={!userQuestion.trim()}
//             />
//           </View>
//         </KeyboardAvoidingView>
//       )}
//     </SafeAreaView>
//   );
// };
// export default Chatbot;


// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   TouchableOpacity,
//   Keyboard,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import styling from '@/assets/Styles/styling';
// import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
// import MyButton from '@/components/Buttons/MyButton';
// import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';
// import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
// import Heading from '@/components/Text/Heading';

// // Helper to format date labels (e.g., "Today", "Yesterday", or date)
// const formatDateLabel = (date: Date) => {
//   const today = new Date();
//   const diffInDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

//   if (diffInDays === 0) return 'Today';
//   if (diffInDays === 1) return 'Yesterday';
//   return date.toLocaleDateString();
// };

// // Helper to format time (e.g., "09:30 AM")
// const formatTimeLabel = (date: Date) => {
//   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// };

// const Chatbot = () => {
//   const [userQuestion, setUserQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState<
//     { sender: string; message: string; timestamp?: string; date?: string }[]
//   >([]);
//   const [showIntroScreen, setShowIntroScreen] = useState(true); // Track whether intro screen is visible
//   const [keyboardVisible, setKeyboardVisible] = useState(false);
//   const [headerBackground, setHeaderBackground] = useState(false); // Track header background
//   const [showFAQs, setShowFAQs] = useState(true); // Track if FAQs should be shown
//   const scrollViewRef = useRef<ScrollView>(null);

//   const FAQs = [
//     'What workouts suit me?, Tell me.',
//     'Track my diet?',
//     'Gym timings?',
//     'What is my workout plan?',
//     ' What workouts suit me?, Tell me in detail.',
//     'What is my workout plan?',
//     'Gym timings Are?... ',
//   ];
//   const fetchBotResponse = async (userMessage: string) => {
//     try {
//       const response = await fetch('http://localhost:5000/chatbot', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: userMessage }),
//       });
  
//       const data = await response.json();
//       return data.reply;  // Assuming your backend sends a 'reply' field
//     } catch (error) {
//       console.error("Error fetching bot response:", error);
//       return "Sorry, I couldn't understand that. Can you rephrase?";
//     }
//   };
  
// // Track keyboard visibility
// useEffect(() => {
//   const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
//     setKeyboardVisible(true);
//     setShowFAQs(false); // Hide FAQs when keyboard is shown
//   });
//   const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
//     setKeyboardVisible(false);
//     setShowFAQs(true); // Show FAQs when keyboard is hidden
//   });

//   return () => {
//     showSubscription.remove();
//     hideSubscription.remove();
//   };
// }, []);

//   const handleInputChange = (text: string) => {
//     setUserQuestion(text);
//     if (text.trim()) {
//       setShowFAQs(false); // Hide FAQs and intro image when typing
//     } else {
//       setShowFAQs(true); // Show FAQs again when input is cleared
//     }
//   };

//   const handleSubmitQuestion = async () => {
//     if (userQuestion.trim()) {
//       const now = new Date();
//       const currentTime = formatTimeLabel(now);
//       const currentDate = now.toISOString().split('T')[0]; // Get date only (YYYY-MM-DD)

//       const newMessage = { sender: 'user', message: userQuestion, timestamp: currentTime, date: currentDate };

//       let updatedChatHistory = [...chatHistory, newMessage];

//       // Simulate chatbot response
//       const chatbotResponse = 'Hi, how can I help you today?';
//       updatedChatHistory = [
//         ...updatedChatHistory,
//         { sender: 'bot', message: chatbotResponse, timestamp: currentTime, date: currentDate },
//       ];

//       setChatHistory(updatedChatHistory);
//       setShowIntroScreen(false);
//       setUserQuestion('');

//       // Persist chat history
//       await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
//     }
//   };

//   const handleFAQSelect = (faq: string) => {
//     setUserQuestion(faq);
//     handleSubmitQuestion();
//     setShowIntroScreen(false); // Hide intro screen and show chat screen
//   };

//   useEffect(() => {
//     const initializeChat = async () => {
//       const savedChatHistory = await AsyncStorage.getItem('chatHistory');

//       if (savedChatHistory) {
//         setChatHistory(JSON.parse(savedChatHistory));
//       }
//     };

//     initializeChat();
//   }, []);

//   useEffect(() => {
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollToEnd({ animated: true });
//     }
//   }, [chatHistory]);

//   // Track keyboard visibility
//   useEffect(() => {
//     const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
//       setKeyboardVisible(true);
//     });
//     const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
//       setKeyboardVisible(false);
//     });

//     return () => {
//       showSubscription.remove();
//       hideSubscription.remove();
//     };
//   }, []);

//   const handleScroll = (event: any) => {
//     const scrollY = event.nativeEvent.contentOffset.y;
//     setHeaderBackground(scrollY > 10); // Show solid background if scrollY > 10
//   };

//   const renderChatHistory = () => {
//     let lastRenderedDate = '';

//     return chatHistory.map((chat, index) => {
//       const showDateLabel = chat.date && chat.date !== lastRenderedDate;
//       lastRenderedDate = chat.date || lastRenderedDate;

//       return (
//         <React.Fragment key={index}>
//           {showDateLabel && chat.date && (
//             <Text style={styling.dateLabelText}>{formatDateLabel(new Date(chat.date))}</Text>
//           )}
//           <View
//             style={
//               chat.sender === 'user'
//                 ? styling.userMessage
//                 : chat.sender === 'bot'
//                 ? styling.botMessage
//                 : styling.systemMessage
//             }
//           >
//             <Text style={styling.chatMessageText}>{chat.message}</Text>
//             <View style={styling.timestampContainer}>
//               <Text style={styling.timestampText}>{chat.timestamp}</Text>
//             </View>
//           </View>
//         </React.Fragment>
//       );
//     });
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       {/* Header with dynamic background */}
//       <View
//         style={[
//           styling.ChatBotHeadercontainer,
          
//         ]}
//       >
//         {showIntroScreen ? (
//           <MyButton
//             title={
//               <LogoImgForScreen
//                 path={require('@/assets/images/Chatbot/back.png')}
//                 styles={styling.NextBackbtnimage}
//               />
//             }
//             onPress={() => router.push('/(User)/Dashboard')} // Go to the dashboard when intro screen back button is clicked
//             style1={styling.button}
//             style2={styling.NextBackbtntext}
//           />
//         ) : (
//           <MyButton
//             title={
//               <LogoImgForScreen
//                 path={require('@/assets/images/Chatbot/back.png')}
//                 styles={styling.NextBackbtnimage}
//               />
//             }
//             onPress={() => setShowIntroScreen(true)} // Go back to the intro screen when chat screen back button is clicked
//             style1={styling.button}
//             style2={styling.NextBackbtntext}
//           />
//         )}
//         <LogoImgForScreen path={require('@/assets/images/Chatbot/main.png')} styles={styling.ChatbotHeader} />
//         <Heading title={'FitPro AI'} styles={styling.HeaderText} />
//       </View>

//       {showIntroScreen ? (
//         <View style={styling.introScreenContainer}>
//           <Image source={require('@/assets/images/Chatbot/main.png')} style={styling.introImage} />
//           <Heading title="Ask FitPro AI Anything" styles={styling.Heading} />
//           {showFAQs && (
//             <View style={styling.Faqcontainer}>
//               {FAQs.map((faq, index) => (
//                 <TouchableOpacity key={index} onPress={() => handleFAQSelect(faq)}>
//                   <Text style={styling.faqText}>{faq}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//           <View style={styling.inputbuttonContainer}>
//             <PlaceHolder
//               placeholderText="Ask me anything..."
//               value={userQuestion}
//               onChangeText={handleInputChange}
//               style={{ flex: 1, marginRight: 10 }}
//               onFocus={() => setShowIntroScreen(false)} // Hide intro screen when user clicks on placeholder
//             />
//             <MyButton
//               title={
//                 <Dashboardscreenimage
//                   path={require('@/assets/images/Chatbot/Send-06.png')}
//                   styles={styling.chatsendmessageimage}
//                 />
//               }
//               onPress={handleSubmitQuestion}
//               style1={[
//                 styling.submitButton,
//                 {
//                   backgroundColor: userQuestion.trim() ? '#2ecc71' : '#2ecc70',
//                 },
//               ]}
//               style2={styling.submitButtonText}
//               disabled={!userQuestion.trim()}
//             />
//           </View>
//         </View>
//       ) : (
//         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
//           <ScrollView
//             contentContainerStyle={styling.chatHistoryContainer}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//             ref={scrollViewRef}
//           >
//             {renderChatHistory()}
//           </ScrollView>

//           <View style={styling.inputAndButtonContainer}>
//             <PlaceHolder
//               placeholderText="Ask me anything..."
//               value={userQuestion}
//               onChangeText={handleInputChange}
//               style={{ flex: 1, marginRight: 10 }}
//             />
//             <MyButton
//               title={
//                 <Dashboardscreenimage
//                   path={require('@/assets/images/Chatbot/Send-06.png')}
//                   styles={styling.chatsendmessageimage}
//                 />
//               }
//               onPress={handleSubmitQuestion}
//               style1={[
//                 styling.submitButton,
//                 {
//                   backgroundColor: userQuestion.trim() ? '#2ecc71' : '#2ecc70',
//                 },
//               ]}
//               style2={styling.submitButtonText}
//               disabled={!userQuestion.trim()}
//             />
//           </View>
//         </KeyboardAvoidingView>
//       )}
//     </SafeAreaView>
//   );
// };

// export default Chatbot;



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
import styling from '@/assets/Styles/styling';
import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
import MyButton from '@/components/Buttons/MyButton';
import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Heading from '@/components/Text/Heading';

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

  const FAQs = [
    'What workouts suit me?, Tell me.',
    'Track my diet?',
    'Gym timings?',
    'What is my workout plan?',
    ' What workouts suit me?, Tell me in detail.',
    'What is my workout plan?',
    'Gym timings Are?... ',
  ];


  
    
  


  
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
    if (userQuestion.trim()) {
      const now = new Date();
      const currentTime = formatTimeLabel(now);
      const currentDate = now.toISOString().split('T')[0]; // Get date only (YYYY-MM-DD)
  
      const newMessage = { sender: 'user', message: userQuestion, timestamp: currentTime, date: currentDate };
      let updatedChatHistory = [...chatHistory, newMessage];
  
      // Fetch bot response from the API
      const botResponse = ('Hello')
  
      // Add the bot's reply to the chat history
      updatedChatHistory = [
        ...updatedChatHistory,
        { sender: 'bot', message: botResponse, timestamp: currentTime, date: currentDate },
      ];
  
      setChatHistory(updatedChatHistory);
      setShowIntroScreen(false);
      setUserQuestion('');
  
      // Persist chat history
      await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
    }
  };
  

  const handleFAQSelect = (faq: string) => {
    setUserQuestion(faq);
    handleSubmitQuestion();
    setShowIntroScreen(false); // Hide intro screen and show chat screen
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







// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   TouchableOpacity,
//   Keyboard,
//   Pressable,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import styling from '@/assets/Styles/styling';
// import PlaceHolder from '@/components/PlaceHolder/PlaceHolder';
// import MyButton from '@/components/Buttons/MyButton';
// import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';
// import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
// import Heading from '@/components/Text/Heading';

// // Helper to format date labels (e.g., "Today", "Yesterday", or date)
// const formatDateLabel = (date: Date) => {
//   const today = new Date();
//   const diffInDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
//   if (diffInDays === 0) return 'Today';
//   if (diffInDays === 1) return 'Yesterday';
//   return date.toLocaleDateString();
// };

// // Helper to format time (e.g., "09:30 AM")
// const formatTimeLabel = (date: Date) => {
//   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// };

// const Chatbot = () => {
//   const [userQuestion, setUserQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState<
//     { sender: string; message: string; timestamp?: string; date?: string, selected?: boolean }[]
//   >([]);
//   const [showIntroScreen, setShowIntroScreen] = useState(true);
//   const [keyboardVisible, setKeyboardVisible] = useState(false);
//   const [showFAQs, setShowFAQs] = useState(true);
//   const [headerBackground, setHeaderBackground] = useState(false);  // Added headerBackground state
//   const scrollViewRef = useRef<ScrollView>(null);

//   const FAQs = [
//     'What workouts suit me?, Tell me.',
//     'Track my diet?',
//     'Gym timings?',
//     'What is my workout plan?',
//     'What workouts suit me?, Tell me in detail.',
//     'What is my workout plan?',
//     'Gym timings Are?... ',
//   ];

//   useEffect(() => {
//     const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
//       setKeyboardVisible(true);
//       setShowFAQs(false); // Hide FAQs when keyboard is shown
//     });
//     const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
//       setKeyboardVisible(false);
//       setShowFAQs(true); // Show FAQs when keyboard is hidden
//     });

//     return () => {
//       showSubscription.remove();
//       hideSubscription.remove();
//     };
//   }, []);

//   const handleInputChange = (text: string) => {
//     setUserQuestion(text);
//     if (text.trim()) {
//       setShowFAQs(false); // Hide FAQs when typing
//     } else {
//       setShowFAQs(true); // Show FAQs again when input is cleared
//     }
//   };

//   const handleSubmitQuestion = async () => {
//     if (userQuestion.trim()) {
//       const now = new Date();
//       const currentTime = formatTimeLabel(now);
//       const currentDate = now.toISOString().split('T')[0]; // Get date only (YYYY-MM-DD)

//       const newMessage = { sender: 'user', message: userQuestion, timestamp: currentTime, date: currentDate };

//       let updatedChatHistory = [...chatHistory, newMessage];

//       // Simulate chatbot response
//       const chatbotResponse = 'Hi, how can I help you today?';
//       updatedChatHistory = [
//         ...updatedChatHistory,
//         { sender: 'bot', message: chatbotResponse, timestamp: currentTime, date: currentDate },
//       ];

//       setChatHistory(updatedChatHistory);
//       setShowIntroScreen(false);
//       setUserQuestion('');

//       // Persist chat history
//       await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
//     }
//   };

//   const handleFAQSelect = (faq: string) => {
//     setUserQuestion(faq);
//     handleSubmitQuestion();
//     setShowIntroScreen(false); // Hide intro screen and show chat screen
//   };

//   useEffect(() => {
//     const initializeChat = async () => {
//       const savedChatHistory = await AsyncStorage.getItem('chatHistory');

//       if (savedChatHistory) {
//         setChatHistory(JSON.parse(savedChatHistory));
//       }
//     };

//     initializeChat();
//   }, []);

//   useEffect(() => {
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollToEnd({ animated: true });
//     }
//   }, [chatHistory]);

//   const handleScroll = (event: any) => {
//     const scrollY = event.nativeEvent.contentOffset.y;
//     setHeaderBackground(scrollY > 10); // Show solid background if scrollY > 10
//   };

//   const renderChatHistory = () => {
//     let lastRenderedDate = '';
    
//     return chatHistory.map((chat, index) => {
//       const showDateLabel = chat.date && chat.date !== lastRenderedDate;
//       lastRenderedDate = chat.date || lastRenderedDate;

//       return (
//         <React.Fragment key={index}>
//           {showDateLabel && chat.date && (
//             <Text style={styling.dateLabelText}>{formatDateLabel(new Date(chat.date))}</Text>
//           )}
//           <Pressable
//             style={[
//               chat.sender === 'user' ? styling.userMessage : styling.botMessage,
//               chat.selected && { backgroundColor: 'green' }, // Highlight selected message
//             ]}
//             onLongPress={() => handleLongPress(index)} // Handle long press to select message
//             delayLongPress={2000} // 2 seconds to trigger selection
//           >
//             <Text style={styling.chatMessageText}>{chat.message}</Text>
//             <View style={styling.timestampContainer}>
//               <Text style={styling.timestampText}>{chat.timestamp}</Text>
//             </View>
//             {chat.selected && (
//               <TouchableOpacity onPress={() => handleDeleteMessage(index)} style={styling.deleteButton}>
//                 <Text style={styling.deleteButtonText}>Delete</Text>
//               </TouchableOpacity>
//             )}
//           </Pressable>
//         </React.Fragment>
//       );
//     });
//   };

//   const handleSelectMessage = (index: number) => {
//     const updatedChatHistory = [...chatHistory];
//     updatedChatHistory[index].selected = !updatedChatHistory[index].selected; // Toggle select
//     setChatHistory(updatedChatHistory);
//     AsyncStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory)); // Persist changes
//   };

//   const handleDeleteMessage = (index: number) => {
//     const updatedChatHistory = chatHistory.filter((_, i) => i !== index); // Remove selected message
//     setChatHistory(updatedChatHistory);
//     AsyncStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory)); // Persist changes
//   };

//   const handleLongPress = (index: number) => {
//     const updatedChatHistory = [...chatHistory];
//     updatedChatHistory[index].selected = true; // Select message after long press
//     setChatHistory(updatedChatHistory);
//     AsyncStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory)); // Persist changes
//   };
//    return (
//     <SafeAreaView style={{ flex: 1 }}>
//       {/* Header with dynamic background */}
//       <View
//         style={[
//           styling.ChatBotHeadercontainer,
          
//         ]}
//       >
//         {showIntroScreen ? (
//           <MyButton
//             title={
//               <LogoImgForScreen
//                 path={require('@/assets/images/Chatbot/back.png')}
//                 styles={styling.NextBackbtnimage}
//               />
//             }
//             onPress={() => router.push('/(User)/Dashboard')} // Go to the dashboard when intro screen back button is clicked
//             style1={styling.button}
//             style2={styling.NextBackbtntext}
//           />
//         ) : (
//           <MyButton
//             title={
//               <LogoImgForScreen
//                 path={require('@/assets/images/Chatbot/back.png')}
//                 styles={styling.NextBackbtnimage}
//               />
//             }
//             onPress={() => setShowIntroScreen(true)} // Go back to the intro screen when chat screen back button is clicked
//             style1={styling.button}
//             style2={styling.NextBackbtntext}
//           />
//         )}
//         <LogoImgForScreen path={require('@/assets/images/Chatbot/main.png')} styles={styling.ChatbotHeader} />
//         <Heading title={'FitPro AI'} styles={styling.HeaderText} />
//       </View>

//       {showIntroScreen ? (
//         <View style={styling.introScreenContainer}>
//           <Image source={require('@/assets/images/Chatbot/main.png')} style={styling.introImage} />
//           <Heading title="Ask FitPro AI Anything" styles={styling.Heading} />
//           {showFAQs && (
//             <View style={styling.Faqcontainer}>
//               {FAQs.map((faq, index) => (
//                 <TouchableOpacity key={index} onPress={() => handleFAQSelect(faq)}>
//                   <Text style={styling.faqText}>{faq}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//           <View style={styling.inputbuttonContainer}>
//             <PlaceHolder
//               placeholderText="Ask me anything..."
//               value={userQuestion}
//               onChangeText={handleInputChange}
//               style={{ flex: 1, marginRight: 10 }}
//               onFocus={() => setShowIntroScreen(false)} // Hide intro screen when user clicks on placeholder
//             />
//             <MyButton
//               title={
//                 <Dashboardscreenimage
//                   path={require('@/assets/images/Chatbot/Send-06.png')}
//                   styles={styling.chatsendmessageimage}
//                 />
//               }
//               onPress={handleSubmitQuestion}
//               style1={[
//                 styling.submitButton,
//                 {
//                   backgroundColor: userQuestion.trim() ? '#2ecc71' : '#2ecc70',
//                 },
//               ]}
//               style2={styling.submitButtonText}
//               disabled={!userQuestion.trim()}
//             />
//           </View>
//         </View>
//       ) : (
//         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
//           <ScrollView
//             contentContainerStyle={styling.chatHistoryContainer}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//             ref={scrollViewRef}
//           >
//             {renderChatHistory()}
//           </ScrollView>

//           <View style={styling.inputAndButtonContainer}>
//             <PlaceHolder
//               placeholderText="Ask me anything..."
//               value={userQuestion}
//               onChangeText={handleInputChange}
//               style={{ flex: 1, marginRight: 10 }}
//             />
//             <MyButton
//               title={
//                 <Dashboardscreenimage
//                   path={require('@/assets/images/Chatbot/Send-06.png')}
//                   styles={styling.chatsendmessageimage}
//                 />
//               }
//               onPress={handleSubmitQuestion}
//               style1={[
//                 styling.submitButton,
//                 {
//                   backgroundColor: userQuestion.trim() ? '#2ecc71' : '#2ecc70',
//                 },
//               ]}
//               style2={styling.submitButtonText}
//               disabled={!userQuestion.trim()}
//             />
//           </View>
//         </KeyboardAvoidingView>
//       )}
//     </SafeAreaView>
//   );
// };

// export default Chatbot;
