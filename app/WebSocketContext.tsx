// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { AppState, Alert, Platform, View, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
// import PushNotification from 'react-native-push-notification';
// import { io, Socket } from 'socket.io-client';
// import BackgroundService from 'react-native-background-actions';
// import { SERVER_IP } from './config';
// import GymScheduleScreen from './(User)/GymScheduleScreen';
// import Heading from '@/components/Text/Heading';
// import styling from '@/assets/Styles/styling';
// import AutoLogout from './(AuthScreens)/AutoLogout';
// import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
// import Workoutplan from './(User)/Workoutplan';
// import Dashboard from './(User)/Dashboard';
// import Dietplan from './(User)/Dietplan';
// import Welcome from './(AuthScreens)/welcome';

// interface WebSocketContextType {
//   socket: Socket | null;
// }

// const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// export const useWebSocket = () => {
//   const context = useContext(WebSocketContext);
//   if (!context) {
//     throw new Error('useWebSocket must be used within a WebSocketProvider');
//   }
//   return context;
// };

// export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("🔗 Initializing WebSocket...");
//     const socketInstance = io(`ws://${SERVER_IP}:5000`, {
//       transports: ["websocket"],
//     });

//     socketInstance.on('connect', () => {
//       console.log('✅ Connected to WebSocket server');
//     });

//     socketInstance.on('message', (data) => {
//       console.log('📩 Received WebSocket Data:', data);
//       try {
//         const notification = typeof data === 'string' ? JSON.parse(data) : data;
//         if (notification?.title && notification?.body) {
//           handleNotification(notification.title, notification.body);
//         } else {
//           console.warn('⚠️ Invalid notification format:', notification);
//         }
//       } catch (error) {
//         console.error('❌ Error parsing WebSocket message:', error);
//       }
//     });

//     socketInstance.on('disconnect', () => {
//       console.log('❌ WebSocket Disconnected');
//     });

//     if (Platform.OS === 'android') {
//       startBackgroundTask(socketInstance);
//     }

//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 2000);

//     setSocket(socketInstance);

//     return () => {
//       console.log("🔌 Disconnecting WebSocket and stopping background service...");
//       socketInstance.disconnect();
//       BackgroundService.stop();
//       clearTimeout(timer);
//     };
//   }, []);

//   const handleNotification = (title: string, message: string) => {
//     console.log(`🔔 Handling Notification: ${title} - ${message}`);

//     PushNotification.localNotification({
//       channelId: 'fitpro_channel',
//       title,
//       message,
//       playSound: true,
//       soundName: 'default',
//       importance: 'high',
//       priority: 'high',
//       vibrate: true,
//     });
//   };

//   const startBackgroundTask = async (socketInstance: Socket) => {
//     const backgroundWebSocketTask = async () => {
//       console.log('✅ Background WebSocket Task Started');
//       socketInstance.on('message', (data) => {
//         console.log('📩 Background WebSocket Received Data:', data);
//         try {
//           const notification = JSON.parse(data);
//           if (notification?.title && notification?.body) {
//             handleNotification(notification.title, notification.body);
//           }
//         } catch (error) {
//           console.error('❌ Error in Background WebSocket:', error);
//         }
//       });

//       await new Promise(() => { }); 
//     };

//     try {
//       await BackgroundService.start(backgroundWebSocketTask, {
//         taskName: 'WebSocketTask',
//         taskTitle: 'WebSocket Running',
//         taskDesc: 'Listening for notifications in the background',
//         taskIcon: { name: 'ic_launcher', type: 'mipmap' },
//         color: '#ff0000',
//         linkingURI: 'myapp://home',
//         parameters: { delay: 1000 },
//       });

//       await BackgroundService.updateNotification({
//         taskDesc: 'WebSocket is actively running...',
//       });
//     } catch (error) {
//       console.error('❌ Error starting background task:', error);
//     }
//   };

//   // Detect when the app is reopened and ask for reconnection
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState: string) => {
//       if (nextAppState === 'active') {
//         console.log('🚀 App reopened. Checking WebSocket connection...');
//         if (!socket || !socket.connected) {
//           // showReconnectAlert();
//         }
//       }
//     };

//     const subscription = AppState.addEventListener('change', handleAppStateChange);

//     return () => {
//       subscription.remove();
//     };
//   }, [socket]);

 
//   return (
//     <WebSocketContext.Provider value={{ socket }}>
//       <SafeAreaView style={styling.container}>
//         <AutoLogout />
//         <LogoImgForScreen path={require('@/assets/images/intro/splash.png')} styles={styling.Indeximg} />
//         <View style={styling.IndexView}>
//           {loading ? (
//             <>
//               <ActivityIndicator size={50} color="#2ecc71" />
//               <Heading title="Loading..." styles={styling.TextwithColor} />
//             </>
//           ) : (
//             <ScrollView style={{ flex: 1 }}>
//               <GymScheduleScreen />
//               <Dietplan/>
//               <Workoutplan/>
//             </ScrollView>
//           )}
//         </View>
//       </SafeAreaView>
//     </WebSocketContext.Provider>
//   );
// };




import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Alert, Platform, View, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { io, Socket } from 'socket.io-client';
import BackgroundService from 'react-native-background-actions';
import { SERVER_IP } from './config';
import GymScheduleScreen from './(User)/GymScheduleScreen';
import Heading from '@/components/Text/Heading';
import styling from '@/assets/Styles/styling';
import AutoLogout from './(AuthScreens)/AutoLogout';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Workoutplan from './(User)/Workoutplan';
import Dietplan from './(User)/Dietplan';

interface WebSocketContextType {
  socket: Socket | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create notification channel (Android only)
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'fitpro_channel',
          channelName: 'FitPro Notifications',
          channelDescription: 'Notifications for FitPro app',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`📣 Notification channel '${created ? 'created' : 'exists'}'`)
      );
    }

    // Configure PushNotification
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('🔔 Notification received:', notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });

    // WebSocket Setup
    console.log("🔗 Initializing WebSocket...");
    const socketInstance = io(`ws://${SERVER_IP}:5000`, {
      transports: ["websocket"],
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
    });

    socketInstance.on('message', (data) => {
      console.log('📩 Received WebSocket Data:', data);
      try {
        const notification = typeof data === 'string' ? JSON.parse(data) : data;
        if (notification?.title && notification?.body) {
          handleNotification(notification.title, notification.body);
        } else {
          console.warn('⚠️ Invalid notification format:', notification);
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ WebSocket Disconnected');
    });

    if (Platform.OS === 'android') {
      startBackgroundTask(socketInstance);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    setSocket(socketInstance);

    return () => {
      console.log("🔌 Disconnecting WebSocket and stopping background service...");
      socketInstance.disconnect();
      BackgroundService.stop();
      clearTimeout(timer);
    };
  }, []);

  const handleNotification = (title: string, message: string) => {
    console.log(`🔔 Handling Notification: ${title} - ${message}`);

    PushNotification.localNotification({
      channelId: 'fitpro_channel',
      title,
      message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
    });
  };

  const startBackgroundTask = async (socketInstance: Socket) => {
    const backgroundWebSocketTask = async () => {
      console.log('✅ Background WebSocket Task Started');
      socketInstance.on('message', (data) => {
        console.log('📩 Background WebSocket Received Data:', data);
        try {
          const notification = typeof data === 'string' ? JSON.parse(data) : data;
          if (notification?.title && notification?.body) {
            handleNotification(notification.title, notification.body);
          }
        } catch (error) {
          console.error('❌ Error in Background WebSocket:', error);
        }
      });

      await new Promise(() => {});
    };

    try {
      await BackgroundService.start(backgroundWebSocketTask, {
        taskName: 'WebSocketTask',
        taskTitle: 'WebSocket Running',
        taskDesc: 'Listening for notifications in the background',
        taskIcon: { name: 'ic_launcher', type: 'mipmap' },
        color: '#ff0000',
        linkingURI: 'myapp://home',
        parameters: { delay: 1000 },
      });

      await BackgroundService.updateNotification({
        taskDesc: 'WebSocket is actively running...',
      });
    } catch (error) {
      console.error('❌ Error starting background task:', error);
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('🚀 App reopened. Checking WebSocket connection...');
        if (!socket || !socket.connected) {
          // You can implement reconnection logic here
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      <SafeAreaView style={styling.container}>
        <AutoLogout />
        <LogoImgForScreen path={require('@/assets/images/intro/splash.png')} styles={styling.Indeximg} />
        <View style={styling.IndexView}>
          {loading ? (
            <>
              <ActivityIndicator size={50} color="#2ecc71" />
              <Heading title="Loading..." styles={styling.TextwithColor} />
            </>
          ) : (
            <ScrollView style={{ flex: 1 }}>
              <GymScheduleScreen />
              <Dietplan />
              <Workoutplan />
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </WebSocketContext.Provider>
  );
};
