


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
            { id: 1, name: 'Whole Wheat Bread', Qt: '4', cal: '320', protein: '12', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 2, name: 'Peanut Butter', Qt: '2 tbsp', cal: '180', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 3, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning:[
            { id: 4, name: 'Banana', Qt: '2 large', cal: '270', protein: '2', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 5, name: 'Almonds', Qt: '20', cal: '120', protein: '5', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 6, name: 'Yogurt', Qt: '1 bowl', cal: '150', protein: '10', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            { id: 8, name: 'Chicken Breast', Qt: '50g', cal: '110', protein: '15', image: require('@/assets/images/Chatbot/bc.jpg') },
            { id: 9, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 10, name: 'Cooked Lentils', Qt: '100g', cal: '180', protein: '12', image: require('@/assets/images/Diet/Breakfast/l.jpg') }
,            { id: 11, name: 'Mixed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/mv.jpg') }

        ],
        Evening_Snack:[
            { id: 13, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }
,            { id: 14, name: 'Peanut Butter', Qt: '2 tbsp', cal: '180', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') }

        ],
        Dinner: [
            { id: 16, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') }
        ]
       
    },
    Tue: {
        Breakfast: [
            { id: 17, name: 'Oats', Qt: '150g', cal: '600', protein: '24', image: require('@/assets/images/Chatbot/om.jpg') },
            { id: 19, name: 'Banana', Qt: '1', cal: '105', protein: '1', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 20, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 21, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }

        ],
        Mid_Morning:[
            { id: 22, name: 'Boiled Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 23, name: 'Whole Wheat Crackers', Qt: '100', cal: '240', protein: '8', image: require('@/assets/images/Diet/Breakfast/wr.jpg') }

        ],
        Lunch: [
            { id: 25, name: 'Whole Wheat Pasta', Qt: '200g', cal: '250', protein: '8', image: require('@/assets/images/Diet/Breakfast/wpas.jpg') },
            { id: 26, name: 'Olive Oil', Qt: '1 tbsp', cal: '100', protein: '0', image: require('@/assets/images/Diet/Breakfast/oil.jpg') }

        ],
        Evening_Snack:[
            { id: 28, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 30, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') },


        ],
        Dinner: [
            { id: 31, name: 'Salmon', Qt: '50g', cal: '100', protein: '14', image: require('@/assets/images/Diet/Breakfast/sal.jpg') },
            { id: 32, name: 'Steamed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/sv.jpg') },
            { id: 33, name: 'Mashed Potatoes', Qt: '300g', cal: '300', protein: '7.5', image: require('@/assets/images/Diet/Breakfast/mp.jpg') }

        ]
        
    },
    Wed: {
        Breakfast: [
            { id: 35, name: 'Cheese', Qt: '1 slice', cal: '80', protein: '5', image: require('@/assets/images/Diet/Breakfast/ch.jpg') },
            { id: 36, name: 'Whole Wheat Toast', Qt: '2 slice', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 37, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },

        ],
        Mid_Morning:[
            { id: 38, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 39, name: 'Banana', Qt: '4', cal: '420', protein: '4', image: require('@/assets/images/Diet/Breakfast/b.jpg') },

        ],
        Lunch: [
            { id: 40, name: 'Brown Rice', Qt: '350g', cal: '400', protein: '10', image: require('@/assets/images/Diet//Breakfast/br.jpg') },
            { id: 41, name: 'Broccoli', Qt: '100g', cal: '50', protein: '5', image: require('@/assets/images/Diet/Breakfast/bro.jpg') },
        ],
        Evening_Snack:[
            { id: 42, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 43, name: 'Protein Bar', Qt: '1', cal: '250', protein: '20', image: require('@/assets/images/Diet/Breakfast/pbar.jpg') }
        ],
        Dinner: [
            { id: 44, name: 'Paneer', Qt: '200g', cal: '500', protein: '40', image: require('@/assets/images/Diet/Breakfast/pan.jpg') },
            { id: 45, name: 'Cooked Quinoa', Qt: '185g', cal: '220', protein: '8', image: require('@/assets/images/Diet/Breakfast/cq.jpg') }

        ],
    },
    Thu: {
        Breakfast: [
            { id: 46, name: 'Whole Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 47, name: 'Whole Wheat Bread', Qt: '2', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 48, name: 'Peanut Butter', Qt: '2 tbsp', cal: '190', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 49, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning:[
            { id: 50, name: 'Banana', Qt: '2', cal: '210', protein: '2', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 51, name: 'Almonds', Qt: '30', cal: '200', protein: '8', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 52, name: 'Yogurt', Qt: '1 bowl', cal: '150', protein: '10', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            { id: 53, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 54, name: 'Cooked Lentils', Qt: '100g', cal: '180', protein: '12', image: require('@/assets/images/Diet/Breakfast/l.jpg') }

        ],
        Evening_Snack:[
            { id: 55, name: 'Milk', Qt: '500ml', cal: '300', protein: '16', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }
,            { id: 56, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') }

        ],
        Dinner: [
            { id: 57, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') },
            { id: 58, name: 'Whole Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },

        ]
       
    },
    Fri: {
        Breakfast: [
            { id: 59, name: 'Scrambled Eggs', Qt: '3', cal: '225', protein: '18', image: require('@/assets/images/Diet/Breakfast/ScEggs.jpg') },
            { id: 60, name: 'Cheese', Qt: '1 slice', cal: '80', protein: '5', image: require('@/assets/images/Diet/Breakfast/ch.jpg') },
            { id: 61, name: 'Whole Wheat Toast', Qt: '2 slice', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            
        ],
        Mid_Morning:[
            { id: 62, name: 'Peanut Butter', Qt: '2 tbsp', cal: '180', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 63, name: 'Banana', Qt: '4', cal: '420', protein: '4', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            
        ],
        Lunch: [
            { id: 64, name: 'Beef Steak', Qt: '100g', cal: '220', protein: '25', image: require('@/assets/images/Diet/Breakfast/beefs.jpg') },
        ],
        Evening_Snack:[
            { id: 65, name: 'Brown Rice', Qt: '200g', cal: '215', protein: '5', image: require('@/assets/images/Diet//Breakfast/br.jpg') },
            { id: 66, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
        ],
        Dinner: [
            { id: 67, name: 'Paneer', Qt: '100g', cal: '250', protein: '20', image: require('@/assets/images/Diet/Breakfast/pan.jpg') },
            { id: 68, name: 'Cooked Quinoa', Qt: '185g', cal: '220', protein: '8', image: require('@/assets/images/Diet/Breakfast/cq.jpg') },
            { id: 69, name: 'Whole Wheat Pasta', Qt: '200g', cal: '250', protein: '8', image: require('@/assets/images/Diet/Breakfast/wpas.jpg') },

        ],
       
    },
    Sat: {
        Breakfast: [
            { id: 70, name: 'Oats', Qt: '150g', cal: '600', protein: '24', image: require('@/assets/images/Chatbot/om.jpg') },
            { id: 71, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 721, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }
        ],
        Mid_Morning:[
            { id: 72, name: 'Boiled Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 73, name: 'Whole Wheat Crackers', Qt: '50', cal: '120', protein: '4', image: require('@/assets/images/Diet/Breakfast/wr.jpg') }

        ],
        Lunch: [
            { id: 75, name: 'Whole Wheat Pasta', Qt: '200g', cal: '250', protein: '8', image: require('@/assets/images/Diet/Breakfast/wpas.jpg') },
            { id: 76, name: 'Olive Oil', Qt: '1 tbsp', cal: '100', protein: '0', image: require('@/assets/images/Diet/Breakfast/oil.jpg') }

        ],
        Evening_Snack:[
            { id: 78, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 80, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 81, name: 'Boiled Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },


        ],
        Dinner: [
            { id: 82, name: 'Steamed Vegetables', Qt: '300g', cal: '300', protein: '15', image: require('@/assets/images/Diet/Breakfast/sv.jpg') },
            { id: 83, name: 'Mashed Potatoes', Qt: '200g', cal: '200', protein: '5', image: require('@/assets/images/Diet/Breakfast/mp.jpg') }

        ]
        
    },
    Sun: {
        Breakfast: [
            { id: 84, name: 'Whole Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 85, name: 'Whole Wheat Bread', Qt: '2', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 86, name: 'Peanut Butter', Qt: '3 tbsp', cal: '270', protein: '12', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 87, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning:[
            { id: 88, name: 'Yogurt', Qt: '2 bowl', cal: '300', protein: '20', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            { id: 89, name: 'Brown Rice', Qt: '2 cup', cal: '430', protein: '10', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 90, name: 'Cooked Lentils', Qt: '200g', cal: '360', protein: '24', image: require('@/assets/images/Diet/Breakfast/l.jpg') }
,            { id: 91, name: 'Mixed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/mv.jpg') }

        ],
        Evening_Snack:[
            { id: 92, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }
,            { id: 93, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') }

        ],
        Dinner: [
            { id: 94, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') }
        ]
       
    },
};

const C2300 = () => {
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

export default C2300;
