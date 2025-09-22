import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';

import Heading from '@/components/Text/Heading';
import MyButton from '@/components/Buttons/MyButton';
import styling from '@/assets/Styles/styling';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';

// const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const currentDayIndex = new Date().getDay();
const currentDay = days[currentDayIndex === 0 ? 6 : currentDayIndex - 1];
type FoodItem = {
    id: number;
    name: string;
    Qt: string;
    cal: string;
    protein: string;
    image: any;
};

type MealPlan = {
    Breakfast?: FoodItem[];
    Lunch?: FoodItem[];
    Dinner?: FoodItem[];
};

const DietPlans: Record<string, MealPlan> = {
    Mon: {
        Breakfast: [
            { id: 51, name: 'Whole Eggs', Qt: '1Eggs', cal: '70', protein: '6', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 52, name: 'Oats\n(skim milk)', Qt: '40g + 250ml', cal: '220', protein: '13', image: require('@/assets/images/Chatbot/brownbread.jpg') },
        ],

        Lunch: [
            { id: 54, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 55, name: 'Grilled Chicken Breast	', Qt: '150g', cal: '250', protein: '45', image: require('@/assets/images/Chatbot/gc.jpg') }
            , { id: 56, name: 'Steamed Broccoli', Qt: '100g', cal: '35', protein: '3', image: require('@/assets/images/Diet/Breakfast/bro.jpg') }

        ],

        Dinner: [
            { id: 58, name: 'Cucumber &\nTomato Salad', Qt: '100g', cal: '25', protein: '1', image: require('@/assets/images/Diet/Breakfast/ct.jpg') },
        ]

    },
    Tue: {
        Breakfast: [
            { id: 61, name: 'Whole Wheat Toast', Qt: '1 slice', cal: '80', protein: '3', image: require('@/assets/images/Chatbot/brownbread.jpg') },

        ],

        Lunch: [
            { id: 74, name: 'Grilled Fish', Qt: '150g', cal: '200', protein: '45', image: require('@/assets/images/Diet/Breakfast/gf.jpg') },
            { id: 76, name: 'Steamed Spinach', Qt: '100g', cal: '25', protein: '3', image: require('@/assets/images/Diet/Breakfast/spin.jpg') }

        ],

        Dinner: [
            { id: 82, name: 'Chicken Stir Fry', Qt: '150g c +\n100g veg', cal: '300', protein: '50', image: require('@/assets/images/Diet/Breakfast/sfry.jpg') },
            { id: 83, name: 'Brown Rice', Qt: '50g(uncooked)', cal: '175', protein: '4', image: require('@/assets/images/Diet/Breakfast/ur.jpg') }

        ]

    },
    Wed: {
        Breakfast: [
            { id: 84, name: 'Omelet\n(eggs + spinach)', Qt: '3 + 50g', cal: '280', protein: '22', image: require('@/assets/images/Diet/Breakfast/eggspin.jpg') },

        ],

        Lunch: [
            { id: 170, name: 'Cucumber Salad', Qt: '100g', cal: '25', protein: '1', image: require('@/assets/images/Diet/Breakfast/cocum.jpg') },
            { id: 160, name: 'Grilled Chicken Breast	', Qt: '150g', cal: '250', protein: '45', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 171, name: 'Quinoa', Qt: '25g(uncooked)', cal: '95', protein: '3.5', image: require('@/assets/images/Diet/Breakfast/uq.jpg') }

        ],

        Dinner: [
            { id: 181, name: 'Salmon', Qt: '50g', cal: '100', protein: '13', image: require('@/assets/images/Diet/Breakfast/sal.jpg') },

        ],
    },
    Thu: {
        Breakfast: [
            { id: 252, name: 'whole Eggs\n(olive oil)', Qt: '3 eggs + 1 tsp', cal: '300', protein: '21', image: require('@/assets/images/Diet/Breakfast/eo.jpg') },
            { id: 254, name: 'Whole Wheat Toast', Qt: '1slice', cal: '80', protein: '3', image: require('@/assets/images/Chatbot/brownbread.jpg') },

        ],

        Lunch: [
            { id: 260, name: 'Grilled Chicken Breast	', Qt: '150g', cal: '250', protein: '45', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 261, name: 'Steamed Broccoli', Qt: '100g', cal: '35', protein: '2', image: require('@/assets/images/Diet/Breakfast/bro.jpg') }

        ],

        Dinner: [
            { id: 266, name: 'Stir-Fried Tofu\n& Veggies', Qt: '100g + 50g', cal: '140', protein: '18', image: require('@/assets/images/Diet/Breakfast/tfry.jpg') },

        ]

    },
    Fri: {
        Breakfast: [
            { id: 384, name: 'Omelet\n(eggs + spinach)', Qt: '3 + 50g', cal: '280', protein: '22', image: require('@/assets/images/Diet/Breakfast/eggspin.jpg') },
            { id: 352, name: 'Oats\n(skim milk)', Qt: '20g + 120ml', cal: '200', protein: '6', image: require('@/assets/images/Diet/Breakfast/omilk.jpg') },

        ],

        Lunch: [
            { id: 370, name: 'Cucumber Salad', Qt: '100g', cal: '25', protein: '1', image: require('@/assets/images/Diet/Breakfast/cocum.jpg') },
            { id: 360, name: 'Grilled Chicken Breast	', Qt: '75g', cal: '125', protein: '25', image: require('@/assets/images/Chatbot/gc.jpg') },

        ],

        Dinner: [
            { id: 45, name: 'Brown Rice', Qt: '50g(uncooked)', cal: '175', protein: '4', image: require('@/assets/images/Diet//Breakfast/br.jpg') },
        ],
    },
    Sat: {

        Breakfast: [
            { id: 451, name: 'Whole Eggs', Qt: '2Eggs ', cal: '140', protein: '12', image: require('@/assets/images/Diet/Breakfast/eo.jpg') },
        ],

        Lunch: [
            { id: 459, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 460, name: 'Grilled Chicken Breast	', Qt: '150g', cal: '250', protein: '45', image: require('@/assets/images/Chatbot/gc.jpg') }
            , { id: 461, name: 'Steamed Broccoli', Qt: '100g', cal: '35', protein: '3', image: require('@/assets/images/Diet/Breakfast/bro.jpg') }

        ],

        Dinner: [
            { id: 594, name: 'Grilled Salmon', Qt: '50', cal: '105', protein: '12', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 544, name: 'Cucumber &\nTomato Salad', Qt: '100g', cal: '25', protein: '1', image: require('@/assets/images/Diet/Breakfast/ct.jpg') },
        ]


    },
    Sun: {
        Breakfast: [
            { id: 551, name: 'Whole Eggs', Qt: '2', cal: '140', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },

        ],

        Lunch: [
            { id: 574, name: 'Grilled Fish', Qt: '150g', cal: '200', protein: '45', image: require('@/assets/images/Diet/Breakfast/gf.jpg') },
            { id: 576, name: 'Steamed Spinach', Qt: '200g', cal: '50', protein: '6', image: require('@/assets/images/Diet/Breakfast/spin.jpg') }

        ],

        Dinner: [
            { id: 582, name: 'Chicken Stir Fry', Qt: '100g c +\n100g veg', cal: '200', protein: '40', image: require('@/assets/images/Diet/Breakfast/sfry.jpg') },
            { id: 583, name: 'Brown Rice', Qt: '50g(uncooked)', cal: '175', protein: '4', image: require('@/assets/images/Diet/Breakfast/ur.jpg') }

        ]

    },
};

const C700 = () => {
    const [selectedDay, setSelectedDay] = useState<keyof typeof DietPlans>(currentDay); // Default to Monday
    const currentDiet = DietPlans[selectedDay] || {}; // Ensure it's not undefined

    // Calculate total calories and protein
    const totalCalories = Object.values(currentDiet)
        .flat()
        .reduce((sum, meal) => sum + (parseInt(meal.cal) || 0), 0);

    const totalProtein = Object.values(currentDiet)
        .flat()
        .reduce((sum, meal) => sum + (parseFloat(meal.protein) || 0), 0);

    return (
        <View style={styling.workoutnormalcontainer}>
            {/* Navbar with Back Button */}
            <View style={styling.navbar}>
                <MyButton
                    title={<LogoImgForScreen path={require('@/assets/images/Chatbot/back.png')} styles={styling.NextBackbtnimage} />}
                    onPress={() => router.replace('/(User)/Dashboard')}
                    style1={styling.button}
                    style2={styling.NextBackbtntext}
                />
                <Heading title="Diet Plan" styles={styling.HeaderText} />
                <View style={{ position: 'absolute', right: 5, top: 30 }}>
                    <MyButton
                        title={
                            <Dashboardscreenimage
                                path={require('@/assets/images/Profile/edit.png')}
                                styles={styling.dashboardbtnimages}
                            // tintColor='#2ecc71'
                            />
                        }
                        onPress={() => router.navigate('/(User)/CustomizedDiet')}
                        style1={styling.button}
                        style2={styling.NextBackbtntext}
                    />
                </View>
            </View>

            {/* Day Selector */}
            <View style={styling.daySelector}>
                {days.map(day => (
                    <TouchableOpacity
                        key={day}
                        onPress={() => setSelectedDay(day as keyof typeof DietPlans)}
                        style={[styling.dayButton, selectedDay === day && styling.selectedDay]}>
                        <Text style={styling.dayText}>{day}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView>
                {['Breakfast', 'Lunch', 'Dinner'].map(mealType => (
                    <View key={mealType}>
                        <Text style={styling.sectionTitle}>{mealType}</Text>
                        {currentDiet[mealType as keyof MealPlan]?.length ? (
                            currentDiet[mealType as keyof MealPlan]?.map((food) => (
                                <View key={food.id} style={styling.workoutItem}>
                                    <Image source={food.image} style={styling.workoutImage} />

                                    {/* Food Details & Calories in a Row */}
                                    <View style={styling.workoutRow}>
                                        <View style={styling.workoutDetails}>
                                            <Text style={styling.workoutName}>{food.name}</Text>
                                            <Text style={styling.workoutSubtitle}>{food.Qt}</Text>
                                        </View>

                                        {/* Show Calories and Protein */}
                                        <View>
                                            <Text style={styling.viewButton}>{food.cal} cal</Text>
                                            <Text style={styling.viewButton}>{food.protein}g protein</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styling.restDayMessage}>No {mealType} for today! 🥗</Text>
                        )}
                    </View>
                ))}

                {/* Display Total Calories & Protein */}
                <View style={styling.totalContainer}>
                    <Text style={styling.totalText}>Total Calories: {totalCalories} cal</Text>
                    <Text style={styling.totalText}>Total Protein: {totalProtein}g</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default C700;
