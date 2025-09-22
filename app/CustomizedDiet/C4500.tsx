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
            { id: 51, name: 'Whole Eggs', Qt: '5', cal: '375', protein: '30', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 52, name: 'Whole Wheat Bread', Qt: '4', cal: '320', protein: '12', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 53, name: 'Peanut Butter', Qt: '4 tbsp', cal: '360', protein: '16', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 54, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning: [
            { id: 55, name: 'Banana', Qt: '7 large', cal: '700', protein: '7', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 56, name: 'Almonds', Qt: '20', cal: '120', protein: '5', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 57, name: 'Yogurt', Qt: '2 bowl', cal: '300', protein: '20', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            { id: 58, name: 'Chicken Breast', Qt: '220g', cal: '500', protein: '60', image: require('@/assets/images/Chatbot/bc.jpg') },
            { id: 59, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 60, name: 'Cooked Lentils', Qt: '200g', cal: '360', protein: '24', image: require('@/assets/images/Diet/Breakfast/l.jpg') }
            , { id: 61, name: 'Mixed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/mv.jpg') }

        ],
        Evening_Snack: [
            { id: 62, name: 'Whey Protein', Qt: '1 scope', cal: '120', protein: '25', image: require('@/assets/images/Diet/Breakfast/wp.jpg') },
            { id: 63, name: 'Milk', Qt: '750ml', cal: '450', protein: '24', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }
            , { id: 64, name: 'Peanut Butter', Qt: '3 tbsp', cal: '270', protein: '12', image: require('@/assets/images/Chatbot/pb.jpg') }

        ],
        Dinner: [
            { id: 66, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') }
        ]

    },
    Tue: {
        Breakfast: [
            { id: 67, name: 'Oats', Qt: '280g', cal: '1120', protein: '47', image: require('@/assets/images/Chatbot/om.jpg') },
            { id: 70, name: 'Almonds', Qt: '30', cal: '200', protein: '8', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 71, name: 'Milk', Qt: '400ml', cal: '250', protein: '12', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }

        ],
        Mid_Morning: [
            { id: 72, name: 'Boiled Eggs', Qt: '6', cal: '450', protein: '36', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 73, name: 'Whole Wheat Crackers', Qt: '100', cal: '240', protein: '8', image: require('@/assets/images/Diet/Breakfast/wr.jpg') }

        ],
        Lunch: [
            { id: 74, name: 'Grilled Chicken Breast', Qt: '250g', cal: '550', protein: '75', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 75, name: 'Whole Wheat Pasta', Qt: '200g', cal: '250', protein: '8', image: require('@/assets/images/Diet/Breakfast/wpas.jpg') },
            { id: 76, name: 'Olive Oil', Qt: '1 tbsp', cal: '100', protein: '0', image: require('@/assets/images/Diet/Breakfast/oil.jpg') }

        ],
        Evening_Snack: [
            { id: 78, name: 'Milk', Qt: '750ml', cal: '450', protein: '24', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 80, name: 'Peanut Butter', Qt: '6 tbsp', cal: '540', protein: '24', image: require('@/assets/images/Chatbot/pb.jpg') },


        ],
        Dinner: [
            { id: 82, name: 'Steamed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/sv.jpg') },
            { id: 83, name: 'Mashed Potatoes', Qt: '300g', cal: '300', protein: '7.5', image: require('@/assets/images/Diet/Breakfast/mp.jpg') }

        ]

    },
    Wed: {
        Breakfast: [
            { id: 84, name: 'Scrambled Eggs', Qt: '9', cal: '675', protein: '54', image: require('@/assets/images/Diet/Breakfast/ScEggs.jpg') },
            { id: 85, name: 'Cheese', Qt: '2 slice', cal: '180', protein: '10', image: require('@/assets/images/Diet/Breakfast/ch.jpg') },
            { id: 86, name: 'Whole Wheat Toast', Qt: '2 slice', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 87, name: 'Milk', Qt: '400ml', cal: '250', protein: '12', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },

        ],
        Mid_Morning: [
            { id: 88, name: 'Peanut Butter', Qt: '6 tbsp', cal: '540', protein: '24', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 89, name: 'Banana', Qt: '8', cal: '840', protein: '8', image: require('@/assets/images/Diet/Breakfast/b.jpg') },

        ],
        Lunch: [
            { id: 4, name: 'Beef Steak', Qt: '150g', cal: '350', protein: '45', image: require('@/assets/images/Diet/Breakfast/beefs.jpg') },
            { id: 15, name: 'Brown Rice', Qt: '350g', cal: '400', protein: '10', image: require('@/assets/images/Diet//Breakfast/br.jpg') },
            { id: 17, name: 'Broccoli', Qt: '100g', cal: '50', protein: '5', image: require('@/assets/images/Diet/Breakfast/bro.jpg') },
        ],
        Evening_Snack: [
            { id: 170, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 171, name: 'Protein Bar', Qt: '3', cal: '750', protein: '60', image: require('@/assets/images/Diet/Breakfast/pbar.jpg') }
        ],
        Dinner: [
            { id: 172, name: 'Cooked Quinoa', Qt: '185g', cal: '220', protein: '8', image: require('@/assets/images/Diet/Breakfast/cq.jpg') }

        ],
    },
    Thu: {
        Breakfast: [
            { id: 151, name: 'Whole Eggs', Qt: '6', cal: '450', protein: '36', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 152, name: 'Whole Wheat Bread', Qt: '4', cal: '320', protein: '12', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 153, name: 'Peanut Butter', Qt: '4 tbsp', cal: '360', protein: '16', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 154, name: 'Milk', Qt: '400ml', cal: '250', protein: '12', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning: [
            { id: 155, name: 'Banana', Qt: '6', cal: '620', protein: '6', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 156, name: 'Almonds', Qt: '30', cal: '200', protein: '8', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 157, name: 'Yogurt', Qt: '2 bowl', cal: '300', protein: '20', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            { id: 58, name: 'Chicken Breast', Qt: '200g', cal: '440', protein: '60', image: require('@/assets/images/Chatbot/bc.jpg') },
            { id: 159, name: 'Brown Rice', Qt: '1 cup', cal: '215', protein: '5', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 160, name: 'Cooked Lentils', Qt: '100g', cal: '180', protein: '12', image: require('@/assets/images/Diet/Breakfast/l.jpg') }
            // ,            { id: 61, name: 'Mixed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/mv.jpg') }

        ],
        Evening_Snack: [
            { id: 162, name: 'Whey Protein', Qt: '1 scope', cal: '120', protein: '25', image: require('@/assets/images/Diet/Breakfast/wp.jpg') },
            { id: 163, name: 'Milk', Qt: '500ml', cal: '300', protein: '16', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }
            , { id: 164, name: 'Peanut Butter', Qt: '3 tbsp', cal: '270', protein: '12', image: require('@/assets/images/Chatbot/pb.jpg') }

        ],
        Dinner: [
            { id: 166, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') },
            { id: 101, name: 'Whole Eggs', Qt: '4', cal: '300', protein: '24', image: require('@/assets/images/Diet/Breakfast/e.jpg') },

        ]

    },
    Fri: {
        Breakfast: [
            { id: 184, name: 'Scrambled Eggs', Qt: '6', cal: '500', protein: '36', image: require('@/assets/images/Diet/Breakfast/ScEggs.jpg') },
            { id: 185, name: 'Cheese', Qt: '4 slice', cal: '280', protein: '20', image: require('@/assets/images/Diet/Breakfast/ch.jpg') },
            { id: 186, name: 'Whole Wheat Toast', Qt: '2 slice', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },

        ],
        Mid_Morning: [
            { id: 188, name: 'Peanut Butter', Qt: '6 tbsp', cal: '540', protein: '24', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 189, name: 'Banana', Qt: '6', cal: '620', protein: '6', image: require('@/assets/images/Diet/Breakfast/b.jpg') },

        ],
        Lunch: [
            { id: 24, name: 'Beef Steak', Qt: '300g', cal: '660', protein: '75', image: require('@/assets/images/Diet/Breakfast/beefs.jpg') },
            // { id: 7, name: 'Broccoli', Qt: '100g', cal: '50', protein: '5', image: require('@/assets/images/Diet/Breakfast/bro.jpg') },
        ],
        Evening_Snack: [
            { id: 25, name: 'Brown Rice', Qt: '200g', cal: '215', protein: '5', image: require('@/assets/images/Diet//Breakfast/br.jpg') },
            { id: 270, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 71, name: 'Protein Bar', Qt: '3', cal: '750', protein: '60', image: require('@/assets/images/Diet/Breakfast/pbar.jpg') }
        ],
        Dinner: [
            { id: 87, name: 'Milk', Qt: '500ml', cal: '300', protein: '16', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
            { id: 371, name: 'Cooked Quinoa', Qt: '185g', cal: '220', protein: '8', image: require('@/assets/images/Diet/Breakfast/cq.jpg') },
            { id: 499, name: 'Whole Wheat Pasta', Qt: '200g', cal: '250', protein: '8', image: require('@/assets/images/Diet/Breakfast/wpas.jpg') },

        ],

    },
    Sat: {
        Breakfast: [
            { id: 267, name: 'Oats', Qt: '150g', cal: '600', protein: '24', image: require('@/assets/images/Chatbot/om.jpg') },
            // { id: 68, name: 'Whey Protein', Qt: '30g', cal: '120', protein: '25', image: require('@/assets/images/Diet/Breakfast/wp.jpg') },
            { id: 269, name: 'Banana', Qt: '4', cal: '420', protein: '4', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 370, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 571, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }

        ],
        Mid_Morning: [
            { id: 272, name: 'Boiled Eggs', Qt: '2', cal: '150', protein: '12', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 273, name: 'Whole Wheat Crackers', Qt: '50', cal: '120', protein: '4', image: require('@/assets/images/Diet/Breakfast/wr.jpg') }

        ],
        Lunch: [
            { id: 74, name: 'Grilled Chicken Breast', Qt: '200g', cal: '440', protein: '60', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 275, name: 'Whole Wheat Pasta', Qt: '400g', cal: '500', protein: '16', image: require('@/assets/images/Diet/Breakfast/wpas.jpg') },
            { id: 276, name: 'Olive Oil', Qt: '1 tbsp', cal: '100', protein: '0', image: require('@/assets/images/Diet/Breakfast/oil.jpg') }

        ],
        Evening_Snack: [
            { id: 278, name: 'Milk', Qt: '500ml', cal: '300', protein: '16', image: require('@/assets/images/Chatbot/gc.jpg') },
            { id: 279, name: 'Whey Protein', Qt: '30g', cal: '120', protein: '25', image: require('@/assets/images/Diet/Breakfast/wp.jpg') },
            { id: 280, name: 'Peanut Butter', Qt: '4 tbsp', cal: '360', protein: '16', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 290, name: 'Boiled Eggs', Qt: '6', cal: '450', protein: '36', image: require('@/assets/images/Diet/Breakfast/e.jpg') },


        ],
        Dinner: [
            { id: 282, name: 'Steamed Vegetables', Qt: '300g', cal: '300', protein: '15', image: require('@/assets/images/Diet/Breakfast/sv.jpg') },
            { id: 283, name: 'Mashed Potatoes', Qt: '400g', cal: '400', protein: '10', image: require('@/assets/images/Diet/Breakfast/mp.jpg') }

        ]

    },
    Sun: {
        Breakfast: [
            { id: 251, name: 'Whole Eggs', Qt: '4', cal: '300', protein: '24', image: require('@/assets/images/Diet/Breakfast/e.jpg') },
            { id: 252, name: 'Whole Wheat Bread', Qt: '2', cal: '160', protein: '6', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 253, name: 'Peanut Butter', Qt: '3 tbsp', cal: '270', protein: '12', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 254, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') },
        ],
        Mid_Morning: [
            { id: 990, name: 'Banana', Qt: '6', cal: '620', protein: '6', image: require('@/assets/images/Diet/Breakfast/b.jpg') },
            { id: 56, name: 'Almonds', Qt: '15', cal: '100', protein: '4', image: require('@/assets/images/Diet/Breakfast/alm.jpg') },
            { id: 255, name: 'Whole Eggs', Qt: '6', cal: '550', protein: '36', image: require('@/assets/images/Diet/Breakfast/e.jpg') },

            { id: 257, name: 'Yogurt', Qt: '2 bowl', cal: '300', protein: '20', image: require('@/assets/images/Diet/Breakfast/y.jpg') },
        ],
        Lunch: [
            { id: 58, name: 'Chicken Breast', Qt: '200g', cal: '440', protein: '60', image: require('@/assets/images/Chatbot/bc.jpg') },
            { id: 259, name: 'Brown Rice', Qt: '2 cup', cal: '430', protein: '10', image: require('@/assets/images/Diet/Breakfast/br.jpg') },
            { id: 260, name: 'Cooked Lentils', Qt: '200g', cal: '360', protein: '24', image: require('@/assets/images/Diet/Breakfast/l.jpg') }
            , { id: 261, name: 'Mixed Vegetables', Qt: '100g', cal: '100', protein: '5', image: require('@/assets/images/Diet/Breakfast/mv.jpg') }

        ],
        Evening_Snack: [
            { id: 62, name: 'Whey Protein', Qt: '1 scope', cal: '120', protein: '25', image: require('@/assets/images/Diet/Breakfast/wp.jpg') },
            { id: 263, name: 'Milk', Qt: '250ml', cal: '150', protein: '8', image: require('@/assets/images/Diet/Breakfast/milk.jpg') }
            , { id: 264, name: 'Peanut Butter', Qt: '3 tbsp', cal: '270', protein: '12', image: require('@/assets/images/Chatbot/pb.jpg') }

        ],
        Dinner: [
            { id: 266, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') }
        ]

    },
    // Add more days as needed...
};

const C4500 = () => {
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
                {['Breakfast', 'Mid_Morning', 'Lunch', 'Evening_Snack', 'Dinner'].map(mealType => (
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

export default C4500;
