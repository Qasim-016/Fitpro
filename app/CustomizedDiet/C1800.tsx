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
            { id: 51, name: 'Whole Eggs\n(Olive oil)', Qt: '5Eggs 1tbsp oil', cal: '400', protein: '33', image: require('@/assets/images/Diet/Breakfast/eo.jpg') },
            { id: 52, name: 'Oats\n(skim milk)', Qt: '80g + 250ml', cal: '320', protein: '18', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 53, name: 'Almonds', Qt: '10', cal: '70', protein: '2.5', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
        ],

        Lunch: [
            { id: 59, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 60, name: 'Grilled Chicken Breast	', Qt: '200g', cal: '330', protein: '53', image: require('@/assets/images/Chatbot/gc.jpg') }
            , { id: 61, name: 'Steamed Broccoli', Qt: '100g', cal: '35', protein: '3', image: require('@/assets/images/Diet/Breakfast/bro.jpg') }

        ],

        Dinner: [
            { id: 69, name: 'Grilled Salmon', Qt: '150', cal: '310', protein: '37', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 54, name: 'Cucumber &\nTomato Salad', Qt: '100g', cal: '25', protein: '1', image: require('@/assets/images/Diet/Breakfast/ct.jpg') },
            { id: 66, name: 'Quinoa	', Qt: '50g(uncooked)', cal: '185', protein: '6.5', image: require('@/assets/images/Diet/Breakfast/uq.jpg') }
        ]

    },
    Tue: {
        Breakfast: [
            { id: 151, name: 'Whole Eggs', Qt: '4', cal: '280', protein: '24', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 186, name: 'Whole Wheat Toast', Qt: '3 slice', cal: '240', protein: '9', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 153, name: 'Peanut Butter', Qt: '3 tbsp', cal: '270', protein: '12', image: require('@/assets/images/Chatbot/pb.jpg') },

        ],

        Lunch: [
            { id: 174, name: 'Grilled Fish', Qt: '200g', cal: '270', protein: '60', image: require('@/assets/images/Diet/Breakfast/gf.jpg') },
            { id: 175, name: 'Sweet Potato', Qt: '300g', cal: '270', protein: '6', image: require('@/assets/images/Chatbot/sp.jpg') },
            { id: 176, name: 'Steamed Spinach', Qt: '100g', cal: '25', protein: '3', image: require('@/assets/images/Diet/Breakfast/spin.jpg') }

        ],

        Dinner: [
            { id: 182, name: 'Chicken Stir Fry', Qt: '150g c +\n100g veg', cal: '300', protein: '50', image: require('@/assets/images/Diet/Breakfast/sfry.jpg') },
            { id: 183, name: 'Brown Rice', Qt: '50g(uncooked)', cal: '175', protein: '4', image: require('@/assets/images/Diet/Breakfast/ur.jpg') }

        ]

    },
    Wed: {
        Breakfast: [
            { id: 284, name: 'Omelet\n(eggs + spinach)', Qt: '4 + 50g', cal: '350', protein: '28', image: require('@/assets/images/Diet/Breakfast/eggspin.jpg') },
            { id: 252, name: 'Oats\n(skim milk)', Qt: '30g + 250ml', cal: '320', protein: '18', image: require('@/assets/images/Diet/Breakfast/omilk.jpg') },
            { id: 287, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },

        ],

        Lunch: [
            { id: 271, name: 'Cucumber Salad', Qt: '100g', cal: '25', protein: '1', image: require('@/assets/images/Diet/Breakfast/cocum.jpg') },
            { id: 260, name: 'Grilled Chicken Breast	', Qt: '200g', cal: '330', protein: '53', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 741, name: 'Quinoa', Qt: '50g(uncooked)', cal: '185', protein: '6.5', image: require('@/assets/images/Diet/Breakfast/uq.jpg') }

        ],

        Dinner: [
            { id: 25, name: 'Brown Rice', Qt: '50g(uncooked)', cal: '175', protein: '4', image: require('@/assets/images/Diet//Breakfast/br.jpg') },
            { id: 281, name: 'Salmon', Qt: '150g', cal: '310', protein: '37', image: require('@/assets/images/Diet/Breakfast/sal.jpg') },

        ],
    },
    Thu: {
        Breakfast: [
            { id: 352, name: 'whole Eggs\n(olive oil)', Qt: '5 eggs + 1 tsp', cal: '450', protein: '33', image: require('@/assets/images/Diet/Breakfast/eo.jpg') },
            { id: 354, name: 'Whole Wheat Toast', Qt: '3 slice', cal: '240', protein: '9', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 359, name: 'Almonds', Qt: '20', cal: '150', protein: '5', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },

        ],

        Lunch: [
            { id: 360, name: 'Grilled Chicken Breast	', Qt: '200g', cal: '330', protein: '53', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 366, name: 'Sweet Potato', Qt: '100g', cal: '90', protein: '2', image: require('@/assets/images/Chatbot/sp.jpg') }
            , { id: 361, name: 'Steamed Broccoli', Qt: '100g', cal: '35', protein: '2', image: require('@/assets/images/Diet/Breakfast/bro.jpg') }

        ],

        Dinner: [
            { id: 606, name: 'Stir-Fried Tofu\n& Veggies', Qt: '180g + 130g', cal: '370', protein: '40', image: require('@/assets/images/Diet/Breakfast/tfry.jpg') },
            { id: 35, name: 'Brown Rice', Qt: '50g', cal: '175', protein: '4', image: require('@/assets/images/Diet//Breakfast/br.jpg') },

        ]

    },
    Fri: {
        Breakfast: [
            { id: 484, name: 'Omelet\n(eggs + spinach)', Qt: '3 + 100g', cal: '350', protein: '26', image: require('@/assets/images/Diet/Breakfast/eggspin.jpg') },
            { id: 452, name: 'Oats\n(skim milk)', Qt: '40g + 250ml', cal: '220', protein: '13', image: require('@/assets/images/Diet/Breakfast/omilk.jpg') },
            { id: 487, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },

        ],

        Lunch: [
            { id: 471, name: 'Cucumber Salad', Qt: '100g', cal: '25', protein: '1', image: require('@/assets/images/Diet/Breakfast/cocum.jpg') },
            { id: 460, name: 'Grilled Chicken Breast	', Qt: '250g', cal: '400', protein: '65', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 791, name: 'Quinoa', Qt: '50g(uncooked)', cal: '185', protein: '6.5', image: require('@/assets/images/Diet/Breakfast/uq.jpg') }

        ],

        Dinner: [
            { id: 45, name: 'Brown Rice', Qt: '50g(uncooked)', cal: '175', protein: '4', image: require('@/assets/images/Diet//Breakfast/br.jpg') },
            { id: 481, name: 'Salmon', Qt: '150g', cal: '310', protein: '37', image: require('@/assets/images/Diet/Breakfast/sal.jpg') },

        ],
    },
    Sat: {

        Breakfast: [
            { id: 551, name: 'Whole Eggs\n(Olive oil)', Qt: '5Eggs 1tbsp oil', cal: '400', protein: '33', image: require('@/assets/images/Diet/Breakfast/eo.jpg') },
            { id: 552, name: 'Oats\n(skim milk)', Qt: '80g + 250ml', cal: '300', protein: '18', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 553, name: 'Almonds', Qt: '10', cal: '70', protein: '2.5', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
        ],

        Lunch: [
            { id: 559, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 560, name: 'Grilled Chicken Breast	', Qt: '180g', cal: '300', protein: '55', image: require('@/assets/images/Chatbot/gc.jpg') }
            , { id: 561, name: 'Steamed Broccoli', Qt: '100g', cal: '35', protein: '3', image: require('@/assets/images/Diet/Breakfast/bro.jpg') }

        ],

        Dinner: [
            { id: 559, name: 'Grilled Salmon', Qt: '150', cal: '310', protein: '37', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 554, name: 'Cucumber &\nTomato Salad', Qt: '100g', cal: '25', protein: '1', image: require('@/assets/images/Diet/Breakfast/ct.jpg') },
            { id: 566, name: 'Quinoa	', Qt: '50g(uncooked)', cal: '185', protein: '6.5', image: require('@/assets/images/Diet/Breakfast/uq.jpg') }
        ]


    },
    Sun: {
        Breakfast: [
            { id: 651, name: 'Whole Eggs', Qt: '5', cal: '350', protein: '30', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 686, name: 'Whole Wheat Toast', Qt: '4 slice', cal: '320', protein: '12', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 653, name: 'Peanut Butter', Qt: '2 tbsp', cal: '180', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },

        ],

        Lunch: [
            { id: 674, name: 'Grilled Fish', Qt: '150g', cal: '200', protein: '45', image: require('@/assets/images/Diet/Breakfast/gf.jpg') },
            { id: 675, name: 'Sweet Potato', Qt: '300g', cal: '270', protein: '6', image: require('@/assets/images/Chatbot/sp.jpg') },
            { id: 676, name: 'Steamed Spinach', Qt: '100g', cal: '25', protein: '3', image: require('@/assets/images/Diet/Breakfast/spin.jpg') }

        ],

        Dinner: [
            { id: 682, name: 'Chicken Stir Fry', Qt: '180g c +\n100g veg', cal: '340', protein: '53', image: require('@/assets/images/Diet/Breakfast/sfry.jpg') },
            { id: 683, name: 'Brown Rice', Qt: '50g(uncooked)', cal: '175', protein: '4', image: require('@/assets/images/Diet/Breakfast/ur.jpg') }

        ]

    },
};

const C1800 = () => {
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
                    onPress={() => router.back()}
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

export default C1800;
