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
    const [gender, setGender] = useState('Male');
    const [height, setHeight] = useState('140'); // Default height
    const [level, setLevel] = useState('1-3 Times');
    const [duration, setDuration] = useState('0.5kg');
    const [goal, setGoal] = useState('none');
    const [currentWeight, setCurrentWeight] = useState('');
    const [targetWeight, setTargetWeight] = useState('');

    const handleSubmit = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            Alert.alert('Error', 'You must be logged in to save your diet plan.');
            return;
        }
        const heightNum = Number(height);
        const currentWeightNum = Number(currentWeight);
        const targetWeightNum = Number(targetWeight);

        if (isNaN(currentWeightNum) || isNaN(targetWeightNum)) {
            Alert.alert('Error', 'weight values must be valid numbers.');
            return;
        }
        try {
            const token = await user.getIdToken();

            const response = await axios.post(`http://${SERVER_IP}:5000/api/diet/saveDietPlan`,
                { gender, height, level, duration, goal, currentWeight, targetWeight },
                { headers: { Authorization: token } }
            );

            if (goal === 'none') {
                Alert.alert('select the goal');
                return;
            }
            if (currentWeightNum < 35 || currentWeightNum > 120) {
                Alert.alert("choose current weight between 35-120")
                return;
            }
            else {
                if (targetWeightNum < 35 || targetWeightNum > 120) {
                    Alert.alert("choose target weight between 35-120")
                    return;
                }
            }
            if (goal === 'Weight Gain') {

                if (gender === 'Male' || gender === 'Other') {

                    if (heightNum < 170 &&
                        currentWeightNum <= 40
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 40) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <= 45
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 45) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <= 50
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 50) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 55
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 55) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 65
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 65) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <= 70
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 70) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                    }

                    else if (heightNum < 170 &&
                        currentWeightNum <= 75
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 75) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 80
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                    }
                    else if (heightNum < 190 &&
                        currentWeightNum <= 80) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 85
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                    }
                    else if (heightNum < 190 &&
                        currentWeightNum <= 85) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <= 90
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 90) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 95
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 95) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 100
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 100) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }

                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                    }



                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                    }




                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C5000');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C5000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C5000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C5100');
                                return;
                            }
                        }
                    }

                }

                if (gender === 'Female') {

                    if (heightNum < 170 &&
                        currentWeightNum <= 40
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 40) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <= 45
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 45) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <= 50
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 50) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 55
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 55) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 65
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 65) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <= 70
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 70) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                    }

                    else if (heightNum < 170 &&
                        currentWeightNum <= 75
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 75) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 80
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                    }
                    else if (heightNum < 190 &&
                        currentWeightNum <= 80) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 85
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                    }
                    else if (heightNum < 190 &&
                        currentWeightNum <= 85) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <= 90
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 90) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 95
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 95) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 100
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 100) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }

                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                        }
                    }



                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                    }




                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C5000');
                                return;
                            }
                        }
                    }
                }
            }




            if (goal === 'Weight loss') {

                if (gender === 'Male' || gender === 'Other') {


                    if (heightNum < 170 &&
                        currentWeightNum <= 40
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 40) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <= 45
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 45) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <= 50
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 50) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 55
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 55) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 65
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 65) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <= 70
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 70) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                    }

                    else if (heightNum < 170 &&
                        currentWeightNum <= 75
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 75) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 80
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                    }
                    else if (heightNum < 190 &&
                        currentWeightNum <= 80) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 85
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                    }
                    else if (heightNum < 190 &&
                        currentWeightNum <= 85) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <= 90
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 90) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 95
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 95) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 100
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 100) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }

                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                    }



                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                    }




                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                        }
                    }

                }

                if (gender === 'Female') {

                    if (heightNum < 170 &&
                        currentWeightNum <= 40
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 40) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <= 45
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C900');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 45) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <= 50
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1100');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 50) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 55
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1300');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 55) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 60
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1500');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 60) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 65
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 65) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                    }





                    else if (heightNum < 170 &&
                        currentWeightNum <= 70
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C1900');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 70) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                    }

                    else if (heightNum < 170 &&
                        currentWeightNum <= 75
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2100');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 75) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 80
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2300');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                    }
                    else if (heightNum < 190 &&
                        currentWeightNum <= 80) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 85
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2500');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                    }
                    else if (heightNum < 190 &&
                        currentWeightNum <= 85) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                    }



                    else if (heightNum < 170 &&
                        currentWeightNum <= 90
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2700');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 90) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                    }




                    else if (heightNum < 170 &&
                        currentWeightNum <= 95
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C2900');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 95) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                    }


                    else if (heightNum < 170 &&
                        currentWeightNum <= 100
                    ) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3100');
                                return;
                            }
                        } else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            } else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 100) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3200');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3300');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }

                        }
                    }
                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 105) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3400');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                    }



                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3500');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 110) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3600');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                    }




                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3700');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 115) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3800');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 170 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C3900');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                    }

                    else if (
                        heightNum < 190 &&
                        currentWeightNum <= 120) {
                        if (level === '1-3 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4000');
                                return;
                            }
                        }
                        else if (level === '4-5 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4100');
                                return;
                            }
                        }
                        else if (level === '5-6 Times') {
                            if (duration === '0.5kg') {
                                router.push('/CustomizedDiet/C4400');
                                return;
                            }
                            else if (duration === '1kg') {
                                router.push('/CustomizedDiet/C4300');
                                return;
                            }
                            else if (duration === '1.5kg') {
                                router.push('/CustomizedDiet/C4200');
                                return;
                            }
                        }
                    }

                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Alert.alert('Error', error.response?.data?.message || 'Failed to save diet plan.');
            } else {
                Alert.alert('Error', 'An unknown error occurred.');
            }
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

            const response = await axios.delete(`http://${SERVER_IP}:5000/api/diet/deleteDietPlan`, {
                headers: { Authorization: token },
            });

            console.log('Server Response:', response.data);
            // Alert.alert('Success', response.data.message);

            router.navigate('/(User)/DietNormal'); // ✅ Navigate after successful deletion

        } catch (error: any) {
            console.error('Error deleting Diet plan:', error.response?.data || error.message || error);
            Alert.alert('Error', 'Failed to delete Diet plan.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styling.Backbtn, { zIndex: 10 }]}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.replace('/(User)/Dashboard')}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Diet Plan" styles={styling.HeaderText} />
            </View>

            <ScrollView contentContainerStyle={styling.scrollContainerCD} keyboardShouldPersistTaps="handled">
                <View style={styling.containerCD}>


                    <Heading title='Gender' styles={styling.headingCD} />
                    <View style={styling.pickerContainerCD}>
                        <Picker selectedValue={gender} onValueChange={setGender} style={styling.pickerCD}>
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>

                    <Heading title='Height (cm)' styles={styling.headingCD} />
                    <View style={styling.pickerContainerCD}>
                        <Picker selectedValue={height} onValueChange={setHeight} style={styling.pickerCD}>
                            {Array.from({ length: 51 }, (_, i) => 140 + i).map((h) => (
                                <Picker.Item key={h} label={`${h} cm`} value={`${h}`} />
                            ))}
                        </Picker>
                    </View>

                    <Heading title='Workout' styles={styling.headingCD} />
                    <View style={styling.pickerContainerCD}>
                        <Picker selectedValue={level} onValueChange={setLevel} style={styling.pickerCD}>
                            <Picker.Item label="1-3 Times" value="1-3 Times" />
                            <Picker.Item label="4-5 Times" value="4-5 Times" />
                            <Picker.Item label="5-6 Times" value="5-6 Times" />
                        </Picker>
                    </View>

                    <Heading title='Per week' styles={styling.headingCD} />
                    <View style={styling.pickerContainerCD}>
                        <Picker selectedValue={duration} onValueChange={setDuration} style={styling.pickerCD}>
                            <Picker.Item label="0.5kg" value="0.5kg" />
                            <Picker.Item label="1kg" value="1kg" />
                            <Picker.Item label="1.5kg" value="1.5kg" />
                        </Picker>
                    </View>

                    <Heading title='Goal' styles={styling.headingCD} />
                    <View style={styling.pickerContainerCD}>
                        <Picker selectedValue={goal} onValueChange={setGoal} style={styling.pickerCD}>
                            <Picker.Item label="none" value="none" />
                            <Picker.Item label="Weight loss" value="Weight loss" />
                            <Picker.Item label="Weight Gain" value="Weight Gain" />
                        </Picker>
                    </View>

                    <Heading title='Current Weight (kg)' styles={styling.headingCD} />
                    <TextInput
                        style={styling.inputCD}
                        placeholder="Enter your current weight"
                        keyboardType='numeric'
                        value={currentWeight}
                        onChangeText={(text) => setCurrentWeight(text.replace(/[^0-9]/g, ''))}
                    />

                    <Heading title='Target Weight (kg)' styles={styling.headingCD} />
                    <TextInput
                        style={styling.inputCD}
                        placeholder="Enter your target weight"
                        keyboardType='numeric'
                        value={targetWeight}
                        onChangeText={(text) => setTargetWeight(text.replace(/[^0-9]/g, ''))}
                    />

                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <MyButton title="Submit" onPress={handleSubmit} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <MyButton title="Predefined" onPress={handlePredefined} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CustomizedDiet;
