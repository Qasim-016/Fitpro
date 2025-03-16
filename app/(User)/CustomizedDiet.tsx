import React, { useState } from 'react';
import { View, Alert, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styling from '@/assets/Styles/styling';
import MyButton from '@/components/Buttons/MyButton';
import Heading from '@/components/Text/Heading';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { SERVER_IP } from '../config';

const CustomizedDiet = () => {
    // const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [height, setHeight] = useState('140'); // Default height
    const [level, setLevel] = useState('1-3 Times');
    const [duration, setDuration] = useState('0.5kg');
    const [goal, setGoal] = useState('Weight Loss');
    const [currentWeight, setCurrentWeight] = useState('');
    const [targetWeight, setTargetWeight] = useState('');

    const handleSubmit = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            Alert.alert('Error', 'You must be logged in to save your diet plan.');
            return;
        }

        // const ageNum = Number(age);
        const heightNum = Number(height);
        const currentWeightNum = Number(currentWeight);
        const targetWeightNum = Number(targetWeight);

        if ( isNaN(currentWeightNum) || isNaN(targetWeightNum)) {
            Alert.alert('Error', 'Age and weight values must be valid numbers.');
            return;
        }

        const weightDifference = Math.abs(targetWeightNum - currentWeightNum);


        try {
            const token = await user.getIdToken();

            const response = await axios.post(`http://${SERVER_IP}:5000/saveDietPlan`, 
                {  gender, height, level, duration, goal, currentWeight, targetWeight },
                { headers: { Authorization: token } }
            );

            Alert.alert('Success', response.data.message);

            if (
                // ageNum >= 15 && ageNum <= 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain1');
                return;
            }else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain2');
                return;
            }else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain3');
                return;
            }else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain4');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain5');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain6');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain7');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain8');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain9');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain10');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain11');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain12');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain13');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain14');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain15');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain16');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain17');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain18');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/Gain4');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/Gain5');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/Gain6');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/Gain7');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/Gain8');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/Gain9');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/Gain19');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/Gain20');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/Gain21');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain11');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain12');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain13');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain14');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain15');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain16');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain17');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain18');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other'&&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/Gain22');
                return;
            }



            //female plans
            else if (
                // ageNum >= 15 && ageNum <= 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain1');
                return;
            }else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain2');
                return;
            }else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain3');
                return;
            }else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain4');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain5');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain6');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain7');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain8');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain9');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain10');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain11');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Male' || gender ==='Other' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain12');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain13');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain14');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain15');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain16');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain17');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain18');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/FGain4');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/FGain5');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/FGain6');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/FGain7');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/FGain8');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/FGain9');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '1-3 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/FGain19');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '4-5 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/FGain20');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 140 && heightNum <= 170 &&
                level === '5-6 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >60
            ) {
                router.push('/CustomizedDiet/FGain21');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain11');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain12');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '0.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain13');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain14');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain15');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '1kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain16');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '1-3 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain17');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female' &&
                heightNum >= 171 && heightNum <= 190 &&
                level === '4-5 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain18');
                return;
            }
            else if (
                // ageNum > 15 && ageNum < 30 &&
                gender === 'Female'&&
                heightNum >= 171 && heightNum <= 190 &&
                level === '5-6 Times' &&
                duration === '1.5kg' &&
                goal === 'Weight Gain' &&
                currentWeightNum >=40 && currentWeightNum <=60
            ) {
                router.push('/CustomizedDiet/FGain22');
                return;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Alert.alert('Error', error.response?.data?.message || 'Failed to save diet plan.');
            } else {
                Alert.alert('Error', 'An unknown error occurred.');
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styling.Backbtn}>
                <MyButton 
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />} 
                    onPress={() => router.back()} 
                    style1={styling.button} 
                    style2={styling.NextBackbtntext} 
                />
                <Heading title="Diet Plan" styles={styling.HeaderText} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    

                    <Heading title='Gender' styles={styles.heading} />
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>

                    <Heading title='Height (cm)' styles={styles.heading} />
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={height} onValueChange={setHeight} style={styles.picker}>
                            {Array.from({ length: 51 }, (_, i) => 140 + i).map((h) => (
                                <Picker.Item key={h} label={`${h} cm`} value={`${h}`} />
                            ))}
                        </Picker>
                    </View>

                    <Heading title='Workout' styles={styles.heading} />
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={level} onValueChange={setLevel} style={styles.picker}>
                            <Picker.Item label="1-3 Times" value="1-3 Times" />
                            <Picker.Item label="4-5 Times" value="4-5 Times" />
                            <Picker.Item label="5-6 Times" value="5-6 Times" />
                        </Picker>
                    </View>

                    <Heading title='Per week' styles={styles.heading} />
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={duration} onValueChange={setDuration} style={styles.picker}>
                            <Picker.Item label="0.5kg" value="0.5kg" />
                            <Picker.Item label="1kg" value="1kg" />
                            <Picker.Item label="1.5kg" value="1.5kg" />
                        </Picker>
                    </View>

                    <Heading title='Goal' styles={styles.heading} />
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={goal} onValueChange={setGoal} style={styles.picker}>
                            <Picker.Item label="Weight Loss" value="Weight Loss" />
                            <Picker.Item label="Weight Gain" value="Weight Gain" />
                        </Picker>
                    </View>

                    <Heading title='Current Weight (kg)' styles={styles.heading} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Enter your current weight"
                        keyboardType='numeric'
                        value={currentWeight}
                        onChangeText={(text) => setCurrentWeight(text.replace(/[^0-9]/g, ''))}
                    />

                    <Heading title='Target Weight (kg)' styles={styles.heading} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Enter your target weight"
                        keyboardType='numeric'
                        value={targetWeight}
                        onChangeText={(text) => setTargetWeight(text.replace(/[^0-9]/g, ''))}
                    />

                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <MyButton title="Submit" onPress={handleSubmit} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, paddingBottom: 20 },
    container: { marginTop: 60, marginHorizontal: 20, borderWidth: 1, borderColor: '#2ecc71', padding: 20 },
    heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    pickerContainer: { borderWidth: 1, borderRadius: 10, marginBottom: 10, backgroundColor: '#fff' },
    picker: { height: 50, width: '100%' },
    input: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
});

export default CustomizedDiet;
