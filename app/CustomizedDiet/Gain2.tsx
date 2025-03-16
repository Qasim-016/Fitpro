


import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';

import Heading from '@/components/Text/Heading';
import MyButton from '@/components/Buttons/MyButton';
import styling from '@/assets/Styles/styling';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';

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
            // { id: 51, name: 'Whole Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 52, name: 'Whole Wheat Bread', Qt: '4', cal: '320', protein: '12', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 53, name: 'Peanut Butter', Qt: '2 tbsp', cal: '180', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 54, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning:[
            { id: 55, name: 'Banana', Qt: '2 large', cal: '270', protein: '2', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 56, name: 'Almonds', Qt: '20', cal: '120', protein: '5', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 57, name: 'Yogurt', Qt: '1 bowl', cal: '150', protein: '10', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            { id: 58, name: 'Chicken Breast', Qt: '150g', cal: '330', protein: '45', image: require('@/assets/images/Chatbot/bc.jpg') },
            { id: 59, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 60, name: 'Cooked Lentils', Qt: '100g', cal: '180', protein: '12', image: require('@/assets/images/Diet/Breakfast/l.jpg') }
,            { id: 61, name: 'Mixed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/mv.jpg') }

        ],
        Evening_Snack:[
            // { id: 62, name: 'Whey Protein', Qt: '1 scope', cal: '120', protein: '25', image: require('@/assets/images/Diet/Breakfast/wp.jpg') },
            { id: 63, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }
,            { id: 64, name: 'Peanut Butter', Qt: '2 tbsp', cal: '180', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') }

        ],
        Dinner: [
            // { id: 65, name: 'Grilled Fish', Qt: '150g fish', cal: '300', protein: '40', image: require('@/assets/images/Diet/Breakfast/gf.jpg') },
            { id: 66, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') }
        ]
       
    },
    Tue: {
        Breakfast: [
            { id: 67, name: 'Oats', Qt: '150g', cal: '600', protein: '24', image: require('@/assets/images/Chatbot/om.jpg') },
            { id: 69, name: 'Banana', Qt: '1', cal: '105', protein: '1', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 70, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 71, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }

        ],
        Mid_Morning:[
            { id: 72, name: 'Boiled Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 73, name: 'Whole Wheat Crackers', Qt: '100', cal: '240', protein: '8', image: require('@/assets/images/Diet/Breakfast/wr.jpg') }

        ],
        Lunch: [
            // { id: 74, name: 'Grilled Chicken Breast', Qt: '200g', cal: '440', protein: '60', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 75, name: 'Whole Wheat Pasta', Qt: '200g', cal: '250', protein: '8', image: require('@/assets/images/Diet/Breakfast/wpas.jpg') },
            { id: 76, name: 'Olive Oil', Qt: '1 tbsp', cal: '100', protein: '0', image: require('@/assets/images/Diet/Breakfast/oil.jpg') }

        ],
        Evening_Snack:[
            { id: 78, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 80, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') },


        ],
        Dinner: [
            { id: 81, name: 'Salmon', Qt: '150g', cal: '300', protein: '40', image: require('@/assets/images/Diet/Breakfast/sal.jpg') },
            { id: 82, name: 'Steamed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/sv.jpg') },
            { id: 83, name: 'Mashed Potatoes', Qt: '300g', cal: '300', protein: '7.5', image: require('@/assets/images/Diet/Breakfast/mp.jpg') }

        ]
        
    },
    Wed: {
        Breakfast: [
            { id: 84, name: 'Scrambled Eggs', Qt: '3', cal: '225', protein: '18', image: require('@/assets/images/Diet/Breakfast/ScEggs.jpg') },
            { id: 85, name: 'Cheese', Qt: '1 slice', cal: '80', protein: '5', image: require('@/assets/images/Diet/Breakfast/ch.jpg') },
            { id: 86, name: 'Whole Wheat Toast', Qt: '2 slice', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 87, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },

        ],
        Mid_Morning:[
            { id: 88, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 89, name: 'Banana', Qt: '4', cal: '420', protein: '4', image: require('@/assets/images/Diet/Breakfast/b.jpg') },

        ],
        Lunch: [
            // { id: 4, name: 'Beef Steak', Qt: '150g', cal: '350', protein: '45', image: require('@/assets/images/Diet/Breakfast/beefs.jpg') },
            { id: 5, name: 'Brown Rice', Qt: '350g', cal: '400', protein: '10', image: require('@/assets/images/Diet//Breakfast/br.jpg') },
            { id: 7, name: 'Broccoli', Qt: '100g', cal: '50', protein: '5', image: require('@/assets/images/Diet/Breakfast/bro.jpg') },
        ],
        Evening_Snack:[
            { id: 70, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 71, name: 'Protein Bar', Qt: '1', cal: '250', protein: '20', image: require('@/assets/images/Diet/Breakfast/pbar.jpg') }
        ],
        Dinner: [
            { id: 6, name: 'Paneer', Qt: '200g', cal: '500', protein: '40', image: require('@/assets/images/Diet/Breakfast/pan.jpg') },
            { id: 71, name: 'Cooked Quinoa', Qt: '185g', cal: '220', protein: '8', image: require('@/assets/images/Diet/Breakfast/cq.jpg') }

        ],
    },
    Thu: {
        Breakfast: [
            { id: 51, name: 'Whole Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 52, name: 'Whole Wheat Bread', Qt: '2', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 53, name: 'Peanut Butter', Qt: '2 tbsp', cal: '190', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 54, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning:[
            { id: 55, name: 'Banana', Qt: '3', cal: '315', protein: '3', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 56, name: 'Almonds', Qt: '30', cal: '200', protein: '8', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 57, name: 'Yogurt', Qt: '1 bowl', cal: '150', protein: '10', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            // { id: 58, name: 'Chicken Breast', Qt: '150g', cal: '330', protein: '45', image: require('@/assets/images/Chatbot/bc.jpg') },
            { id: 59, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 60, name: 'Cooked Lentils', Qt: '100g', cal: '180', protein: '12', image: require('@/assets/images/Diet/Breakfast/l.jpg') }
// ,            { id: 61, name: 'Mixed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/mv.jpg') }

        ],
        Evening_Snack:[
            { id: 62, name: 'Whey Protein', Qt: '1 scope', cal: '120', protein: '25', image: require('@/assets/images/Diet/Breakfast/wp.jpg') },
            { id: 63, name: 'Milk', Qt: '500ml', cal: '300', protein: '16', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }
,            { id: 64, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') }

        ],
        Dinner: [
            // { id: 65, name: 'Grilled Fish', Qt: '150g fish', cal: '300', protein: '40', image: require('@/assets/images/Diet/Breakfast/gf.jpg') },
            { id: 66, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') },
            { id: 51, name: 'Whole Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },

        ]
       
    },
    Fri: {
        Breakfast: [
            { id: 84, name: 'Scrambled Eggs', Qt: '3', cal: '225', protein: '18', image: require('@/assets/images/Diet/Breakfast/ScEggs.jpg') },
            { id: 85, name: 'Cheese', Qt: '1 slice', cal: '80', protein: '5', image: require('@/assets/images/Diet/Breakfast/ch.jpg') },
            { id: 86, name: 'Whole Wheat Toast', Qt: '2 slice', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            
        ],
        Mid_Morning:[
            { id: 88, name: 'Peanut Butter', Qt: '2 tbsp', cal: '180', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 89, name: 'Banana', Qt: '4', cal: '420', protein: '4', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            
        ],
        Lunch: [
            { id: 4, name: 'Beef Steak', Qt: '100g', cal: '220', protein: '25', image: require('@/assets/images/Diet/Breakfast/beefs.jpg') },
            // { id: 7, name: 'Broccoli', Qt: '100g', cal: '50', protein: '5', image: require('@/assets/images/Diet/Breakfast/bro.jpg') },
        ],
        Evening_Snack:[
            { id: 5, name: 'Brown Rice', Qt: '200g', cal: '215', protein: '5', image: require('@/assets/images/Diet//Breakfast/br.jpg') },
            { id: 70, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            // { id: 71, name: 'Protein Bar', Qt: '1', cal: '250', protein: '20', image: require('@/assets/images/Diet/Breakfast/pbar.jpg') }
        ],
        Dinner: [
            { id: 6, name: 'Paneer', Qt: '200g', cal: '500', protein: '40', image: require('@/assets/images/Diet/Breakfast/pan.jpg') },
            // { id: 87, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
            { id: 71, name: 'Cooked Quinoa', Qt: '185g', cal: '220', protein: '8', image: require('@/assets/images/Diet/Breakfast/cq.jpg') },
            { id: 99, name: 'Whole Wheat Pasta', Qt: '200g', cal: '250', protein: '8', image: require('@/assets/images/Diet/Breakfast/wpas.jpg') },

        ],
       
    },
    Sat: {
        Breakfast: [
            { id: 67, name: 'Oats', Qt: '150g', cal: '600', protein: '24', image: require('@/assets/images/Chatbot/om.jpg') },
            // { id: 68, name: 'Whey Protein', Qt: '30g', cal: '120', protein: '25', image: require('@/assets/images/Diet/Breakfast/wp.jpg') },
            { id: 69, name: 'Banana', Qt: '1', cal: '105', protein: '1', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 70, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 71, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }

        ],
        Mid_Morning:[
            { id: 72, name: 'Boiled Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 73, name: 'Whole Wheat Crackers', Qt: '50', cal: '120', protein: '4', image: require('@/assets/images/Diet/Breakfast/wr.jpg') }

        ],
        Lunch: [
            // { id: 74, name: 'Grilled Chicken Breast', Qt: '200g', cal: '440', protein: '60', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 75, name: 'Whole Wheat Pasta', Qt: '200g', cal: '250', protein: '8', image: require('@/assets/images/Diet/Breakfast/wpas.jpg') },
            { id: 76, name: 'Olive Oil', Qt: '1 tbsp', cal: '100', protein: '0', image: require('@/assets/images/Diet/Breakfast/oil.jpg') }

        ],
        Evening_Snack:[
            { id: 78, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 79, name: 'Whey Protein', Qt: '30g', cal: '120', protein: '25', image: require('@/assets/images/Diet/Breakfast/wp.jpg') },
            { id: 80, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 90, name: 'Boiled Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },


        ],
        Dinner: [
            // { id: 81, name: 'Salmon', Qt: '150g', cal: '300', protein: '40', image: require('@/assets/images/Diet/Breakfast/sal.jpg') },
            { id: 82, name: 'Steamed Vegetables', Qt: '300g', cal: '300', protein: '15', image: require('@/assets/images/Diet/Breakfast/sv.jpg') },
            { id: 83, name: 'Mashed Potatoes', Qt: '200g', cal: '200', protein: '5', image: require('@/assets/images/Diet/Breakfast/mp.jpg') }

        ]
        
    },
    Sun: {
        Breakfast: [
            { id: 51, name: 'Whole Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 52, name: 'Whole Wheat Bread', Qt: '2', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 53, name: 'Peanut Butter', Qt: '3 tbsp', cal: '270', protein: '12', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 54, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning:[
            // { id: 55, name: 'Banana', Qt: '2', cal: '210', protein: '2', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            // { id: 56, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 55, name: 'Whole Eggs', Qt: '3', cal: '225', protein: '18', image: require('@/assets/images/Diet/Breakfast/e.jpg') },

            { id: 57, name: 'Yogurt', Qt: '2 bowl', cal: '300', protein: '20', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            // { id: 58, name: 'Chicken Breast', Qt: '150g', cal: '330', protein: '45', image: require('@/assets/images/Chatbot/bc.jpg') },
            { id: 59, name: 'Brown Rice', Qt: '2 cup', cal: '430', protein: '10', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 60, name: 'Cooked Lentils', Qt: '200g', cal: '360', protein: '24', image: require('@/assets/images/Diet/Breakfast/l.jpg') }
,            { id: 61, name: 'Mixed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/mv.jpg') }

        ],
        Evening_Snack:[
            // { id: 62, name: 'Whey Protein', Qt: '1 scope', cal: '120', protein: '25', image: require('@/assets/images/Diet/Breakfast/wp.jpg') },
            { id: 63, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }
,            { id: 64, name: 'Peanut Butter', Qt: '1 tbsp', cal: '90', protein: '4', image: require('@/assets/images/Chatbot/pb.jpg') }

        ],
        Dinner: [
            // { id: 65, name: 'Grilled Fish', Qt: '150g fish', cal: '300', protein: '40', image: require('@/assets/images/Diet/Breakfast/gf.jpg') },
            { id: 66, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') }
        ]
       
    },
    // Add more days as needed...
};

const Gain2 = () => {
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

export default Gain2;
