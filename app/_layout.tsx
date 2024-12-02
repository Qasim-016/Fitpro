import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(IntroScreens)/intro1"/>
                <Stack.Screen name="(IntroScreens)/intro2"/>
                <Stack.Screen name="(IntroScreens)/intro3"/>
                <Stack.Screen name="(AuthScreens)/welcome" />
                <Stack.Screen name="(AuthScreens)/login" />
                <Stack.Screen name="(AuthScreens)/signup" />
                <Stack.Screen name="(AuthScreens)/ForgotPass"/>
                <Stack.Screen name="(User)/FreeTrial" />
                <Stack.Screen name="(User)/Dashboard"/>
                <Stack.Screen name="(User)/Gotonotifications"/>
                <Stack.Screen name="(User)/Dietplan"/>
                <Stack.Screen name="(User)/Workoutplan"/>
                <Stack.Screen name="AiScreens/Chatbot"/>
                <Stack.Screen name="(User)/PaymentForm"/>
            </Stack>
            <StatusBar backgroundColor="black" />
        </>
    );
}
