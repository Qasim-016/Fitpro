


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
    Mid_Morning: FoodItem[];
    Lunch?: FoodItem[];
    Evening_Snack: FoodItem[];
    Dinner?: FoodItem[];
};

const DietPlans: Record<string, MealPlan> = {
    Mon: {
        Breakfast: [
            { id: 1, name: 'Whole Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 2, name: 'Whole Wheat Bread', Qt: '2', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 3, name: 'Peanut Butter', Qt: '2 tbsp', cal: '180', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 4, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning:[
            { id: 6, name: 'Yogurt', Qt: '1 bowl', cal: '150', protein: '10', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            { id: 7, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 8, name: 'Cooked Lentils', Qt: '100g', cal: '180', protein: '12', image: require('@/assets/images/Diet/Breakfast/l.jpg') }
,            { id: 9, name: 'Mixed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/mv.jpg') }

        ],
        Evening_Snack:[
            { id: 10, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }

        ],
        Dinner: [
            { id: 12, name: 'Brown Rice', Qt: '2 cup', cal: '430', protein: '10', image: require('@/assets/images/Diet/Breakfast/br.jpg') },

            { id: 13, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') }
        ]
       
    },
    Tue: {
        Breakfast: [
            { id: 14, name: 'Oats', Qt: '100g', cal: '400', protein: '16', image: require('@/assets/images/Chatbot/om.jpg') },
            { id: 15, name: 'Banana', Qt: '2', cal: '210', protein: '2', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 16, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 17, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }

        ],
        Mid_Morning:[
            { id: 18, name: 'Boiled Eggs', Qt: '1', cal: '75', protein: '6', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 19, name: 'Whole Wheat Crackers', Qt: '50', cal: '120', protein: '4', image: require('@/assets/images/Diet/Breakfast/wr.jpg') }

        ],
        Lunch: [
            { id: 20, name: 'Grilled Chicken Breast', Qt: '50g', cal: '110', protein: '15', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 21, name: 'Whole Wheat Pasta', Qt: '200g', cal: '250', protein: '8', image: require('@/assets/images/Diet/Breakfast/wpas.jpg') },

        ],
        Evening_Snack:[
            { id: 23, name: 'Milk', Qt: '500ml', cal: '300', protein: '16', image: require('@/assets/images/Chatbot/gc.jpg') },


        ],
        Dinner: [
            { id: 25, name: 'Steamed Vegetables', Qt: '200g', cal: '200', protein: '10', image: require('@/assets/images/Diet/Breakfast/sv.jpg') },
            { id: 26, name: 'Mashed Potatoes', Qt: '200g', cal: '200', protein: '5', image: require('@/assets/images/Diet/Breakfast/mp.jpg') }

        ]
        
    },
    Wed: {
        Breakfast: [
            { id: 27, name: 'Cheese', Qt: '1 slice', cal: '80', protein: '5', image: require('@/assets/images/Diet/Breakfast/ch.jpg') },
            { id: 28, name: 'Whole Wheat Toast', Qt: '2 slice', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 29, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },

        ],
        Mid_Morning:[
            { id: 30, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 31, name: 'Banana', Qt: '4', cal: '420', protein: '4', image: require('@/assets/images/Diet/Breakfast/b.jpg') },

        ],
        Lunch: [
            { id:32, name: 'Brown Rice', Qt: '200g', cal: '215', protein: '5', image: require('@/assets/images/Diet//Breakfast/br.jpg') },
            { id: 33, name: 'Broccoli', Qt: '100g', cal: '50', protein: '5', image: require('@/assets/images/Diet/Breakfast/bro.jpg') },
        ],
        Evening_Snack:[
            { id: 35, name: 'Protein Bar', Qt: '1', cal: '250', protein: '20', image: require('@/assets/images/Diet/Breakfast/pbar.jpg') }
        ],
        Dinner: [
            { id:36, name: 'Paneer', Qt: '200g', cal: '500', protein: '40', image: require('@/assets/images/Diet/Breakfast/pan.jpg') },
            { id: 37, name: 'Cooked Quinoa', Qt: '185g', cal: '220', protein: '8', image: require('@/assets/images/Diet/Breakfast/cq.jpg') }

        ],
    },
    Thu: {
        Breakfast: [
            { id: 38, name: 'Whole Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 39, name: 'Whole Wheat Bread', Qt: '2', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 40, name: 'Peanut Butter', Qt: '2 tbsp', cal: '190', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 41, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning:[
            { id: 42, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 43, name: 'Yogurt', Qt: '2 bowl', cal: '300', protein: '20', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            { id: 44, name: 'Brown Rice', Qt: '2 cup', cal: '430', protein: '10', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 45, name: 'Cooked Lentils', Qt: '100g', cal: '180', protein: '12', image: require('@/assets/images/Diet/Breakfast/l.jpg') }
,            { id: 46, name: 'Mixed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/mv.jpg') }

        ],
        Evening_Snack:[
            { id: 47, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }

        ],
        Dinner: [
            { id: 49, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') }
        ]
       
    },
    Fri: {
        Breakfast: [
            { id: 50, name: 'Scrambled Eggs', Qt: '3', cal: '225', protein: '18', image: require('@/assets/images/Diet/Breakfast/ScEggs.jpg') },
            { id: 51, name: 'Cheese', Qt: '1 slice', cal: '80', protein: '5', image: require('@/assets/images/Diet/Breakfast/ch.jpg') },
            { id: 52, name: 'Whole Wheat Toast', Qt: '2 slice', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 53, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },

        ],
        Mid_Morning:[
            { id: 54, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 55, name: 'Banana', Qt: '3', cal: '330', protein: '4', image: require('@/assets/images/Diet/Breakfast/b.jpg') },

        ],
        Lunch: [
            { id: 56, name: 'Brown Rice', Qt: '200g', cal: '215', protein: '5', image: require('@/assets/images/Diet//Breakfast/br.jpg') },
            { id: 57, name: 'Broccoli', Qt: '100g', cal: '50', protein: '5', image: require('@/assets/images/Diet/Breakfast/bro.jpg') },
        ],
        Evening_Snack:[
            { id: 59, name: 'Protein Bar', Qt: '1', cal: '250', protein: '20', image: require('@/assets/images/Diet/Breakfast/pbar.jpg') }
        ],
        Dinner: [
            { id: 60, name: 'Paneer', Qt: '100g', cal: '250', protein: '20', image: require('@/assets/images/Diet/Breakfast/pan.jpg') },
            { id: 61, name: 'Cooked Quinoa', Qt: '185g', cal: '220', protein: '8', image: require('@/assets/images/Diet/Breakfast/cq.jpg') }

        ],
       
    },
    Sat: {
        Breakfast: [
            { id: 62, name: 'Oats', Qt: '150g', cal: '600', protein: '24', image: require('@/assets/images/Chatbot/om.jpg') },
            { id: 63, name: 'Banana', Qt: '2', cal: '210', protein: '2', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 64, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 65, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }

        ],
        Mid_Morning:[
            { id: 66, name: 'Boiled Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 67, name: 'Whole Wheat Crackers', Qt: '50', cal: '120', protein: '4', image: require('@/assets/images/Diet/Breakfast/wr.jpg') }

        ],
        Lunch: [
            { id: 68, name: 'Whole Wheat Pasta', Qt: '200g', cal: '250', protein: '8', image: require('@/assets/images/Diet/Breakfast/wpas.jpg') },
            { id: 69, name: 'Olive Oil', Qt: '1 tbsp', cal: '100', protein: '0', image: require('@/assets/images/Diet/Breakfast/oil.jpg') }

        ],
        Evening_Snack:[
            { id: 70, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Chatbot/gc.jpg') },


        ],
        Dinner: [
            { id: 73, name: 'Steamed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/sv.jpg') },
            { id: 74, name: 'Mashed Potatoes', Qt: '200g', cal: '200', protein: '5', image: require('@/assets/images/Diet/Breakfast/mp.jpg') }

        ]
        
    },
    Sun: {
        Breakfast: [
            { id: 75, name: 'Whole Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 76, name: 'Whole Wheat Bread', Qt: '2', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 77, name: 'Peanut Butter', Qt: '2 tbsp', cal: '190', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 78, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning:[
            { id: 79, name: 'Banana', Qt: '3', cal: '315', protein: '3', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 80, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 81, name: 'Yogurt', Qt: '1 bowl', cal: '150', protein: '10', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            { id: 82, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 83, name: 'Cooked Lentils', Qt: '100g', cal: '180', protein: '12', image: require('@/assets/images/Diet/Breakfast/l.jpg') }
,            { id: 84, name: 'Mixed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/mv.jpg') }

        ],
        Evening_Snack:[
            { id: 85, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }

        ],
        Dinner: [
            { id: 88, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') }
        ]
       
    },
    // Add more days as needed...
};

const C2100 = () => {
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
                <View style={{position:'absolute',right:5,top:30}}>
                        <MyButton
                              title={
                                <Dashboardscreenimage
                                  path={require('@/assets/images/Profile/edit.png')}
                                  styles={styling.dashboardbtnimages}
                                // tintColor='#2ecc71'
                                />
                              }
                              onPress={()=>router.navigate('/(User)/CustomizedDiet')}
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
                {['Breakfast','Mid_Morning' ,'Lunch','Evening_Snack', 'Dinner'].map(mealType => (
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

export default C2100;
