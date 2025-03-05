import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styling from '@/assets/Styles/styling';
import MyButton from '@/components/Buttons/MyButton';
import Heading from '@/components/Text/Heading';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const CustomizedWorkout = () => {
    const [level, setLevel] = useState('Begin');
    const [goal, setGoal] = useState('Weight Loss');
    const handleSubmit = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (!user) {
            Alert.alert('Error', 'You must be logged in to save your workout plan.');
            return;
        }
    
        try {
            const token = await user.getIdToken();
            console.log('User Token:', token);
    
            const response = await axios.post('http://192.168.0.116:5000/saveWorkoutPlan', 
                { level, goal },
                { headers: { Authorization: token } }
            );
    
            console.log('Server Response:', response.data);
            // Alert.alert('Success', response.data.message);
            if (level === 'Begin' && goal === 'Weight Gain') {
                router.push('/CustomizedWorkout/BeginnerGain'); // ✅ Navigate to BeginnerLoss page
                return;
            }else if(level === 'Begin' && goal ==='Weight Loss'){
                router.push('/CustomizedWorkout/BeginnerLoss'); // ✅ Navigate to BeginnerLoss page
                return;
            }else if(level === 'Intermediate' && goal ==='Weight Loss'){
                router.push('/CustomizedWorkout/InterLoss'); // ✅ Navigate to BeginnerLoss page
                return;
            }else if(level === 'Intermediate' && goal ==='Weight Gain'){
                router.push('/CustomizedWorkout/InterGain'); // ✅ Navigate to BeginnerLoss page
                return;
            }else if(level === 'Pro' && goal ==='Weight Loss'){
                router.push('/CustomizedWorkout/ProLoss'); // ✅ Navigate to BeginnerLoss page
                return;
            }else{
                router.push('/CustomizedWorkout/ProGain'); // ✅ Navigate to BeginnerLoss page
                return;
            }

        } catch (error: any) {  // ✅ Fix: Explicitly declare 'error' as 'any'
            console.error('Error saving workout plan:', error.response?.data || error.message || error);
            Alert.alert('Error', 'Failed to save workout plan.');
        }
    };

    const handlePredefined = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (!user) {
            Alert.alert('Error', 'You must be logged in to delete your workout plan.');
            return;
        }
    
        try {
            const token = await user.getIdToken();
            console.log('User Token:', token);
    
            const response = await axios.delete('http://192.168.0.116:5000/deleteWorkoutPlan', {
                headers: { Authorization: token },
            });
    
            console.log('Server Response:', response.data);
            // Alert.alert('Success', response.data.message);
    
            router.navigate('/(User)/WorkoutNormal'); // ✅ Navigate after successful deletion
    
        } catch (error: any) {
            console.error('Error deleting workout plan:', error.response?.data || error.message || error);
            Alert.alert('Error', 'Failed to delete workout plan.');
        }
    };
    
    
    
    return (
        <SafeAreaView>
            <View style={styling.Backbtn}>
                <MyButton title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.back()}
                    style1={styling.button}
                    style2={styling.NextBackbtntext} />
                <Heading title="Workout Plan" styles={styling.HeaderText} />
                
            </View>
             <View style={{marginTop:60,marginHorizontal:20,height:500,borderWidth:1,borderColor:'#2ecc71',justifyContent:'center',paddingHorizontal:20}}>
            <Heading title='Fitness Level' styles={styles.heading} />
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={level} onValueChange={(itemValue) => setLevel(itemValue)} style={styles.picker}>
                        <Picker.Item label="Begin" value="Begin" />
                        <Picker.Item label="Intermediate" value="Intermediate" />
                        <Picker.Item label="Pro" value="Pro" />
                    </Picker>
                </View>

                <Heading title='Goal' styles={styles.heading} />
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={goal} onValueChange={(itemValue) => setGoal(itemValue)} style={styles.picker}>
                        <Picker.Item label="Weight Loss" value="Weight Loss" />
                        <Picker.Item label="Weight Gain" value="Weight Gain" />
                    </Picker>
                </View>

                

                <View style={{ alignItems: 'center' }}>
                    <MyButton title="Submit" onPress={handleSubmit} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
                </View>
                <View style={{ alignItems: 'center' ,marginTop:10}}>
                    <MyButton title="Predefined" onPress={handlePredefined} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
                </View>
            </View>
        </SafeAreaView>
    );
};




const styles = StyleSheet.create({
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#2ecc71',
        borderRadius: 10,
        overflow: 'hidden',
        // marginTop: 5,
        marginBottom: 10,
        backgroundColor: '#fff',justifyContent:'center',
    },
    picker: {
        height: 30,
        width: '100%',
    },
});

export default CustomizedWorkout;





