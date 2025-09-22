import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';

import Heading from '@/components/Text/Heading';
import MyButton from '@/components/Buttons/MyButton';
import styling from '@/assets/Styles/styling';
import LogoImgForScreen from '@/components/ScreenImages/LogoImgForScreen';
import Dashboardscreenimage from '@/components/ScreenImages/Dashboardscreenimages';

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
            { id: 14, name: 'Boiled Eggs', Qt: '3whole,\n 3egg white', cal: '330', protein: '27', image: require('@/assets/images/Chatbot/be.jpg') },
            { id: 15, name: 'Bread Butter', Qt: '4pcs bread, \n 2tbsp', cal: '490', protein: '18', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 49, name: 'Dates', Qt: '7 dates', cal: '150', protein: '2.7', image: require('@/assets/images/Chatbot/d.jpg') },

        ],
        Lunch: [
            { id: 17, name: 'Black Chana', Qt: '100g', cal: '378', protein: '22.4', image: require('@/assets/images/Chatbot/bc.jpg') },
            { id: 18, name: 'Grilled Chicken', Qt: '100g', cal: '237', protein: '20', image: require('@/assets/images/Chatbot/gc.jpg') }
        ],
        Dinner: [
            { id: 19, name: 'Rice & Fish', Qt: '200g rice,\, 200g fish', cal: '642', protein: '49.4', image: require('@/assets/images/Chatbot/rf.jpg') },
            { id: 20, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') }
        ]
       
    },
    Tue: {
        Breakfast: [
            { id: 7, name: 'Oatmeal', Qt: '100g oats,300ml \nmilk,1banana', cal: '610', protein: '28', image: require('@/assets/images/Chatbot/om.jpg') },
            { id: 9, name: 'Banana Shake', Qt: '2Banana,300ml milk,\n 4Dates, 2tbs butter', cal: '638', protein: '21', image: require('@/assets/images/Chatbot/bs.jpg') }
        ],
        Lunch: [
            { id: 10, name: 'Mix Salad', Qt: '1 bowl', cal: '200', protein: '1', image: require('@/assets/images/Chatbot/ms.jpg') },
            { id: 11, name: 'Beef Qeema', Qt: '150g', cal: '414', protein: '39', image: require('@/assets/images/Chatbot/bk.jpg') }
        ],
        Dinner: [
            { id: 12, name: 'Rice & Chicken', Qt: '100g rice,\n 200g chicken boil', cal: '420', protein: '42.5', image: require('@/assets/images/Chatbot/rc.jpg') },
            { id: 13, name: 'Boiled Eggs', Qt: '3whole', cal: '225', protein: '18', image: require('@/assets/images/Chatbot/be.jpg') }
        ]
    },
    Wed: {
        Breakfast: [
            { id: 1, name: 'Brown Bread', Qt: '4pcs', cal: '302', protein: '10', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 2, name: 'Peanut Butter', Qt: '2tbs', cal: '188', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 3, name: 'Banana Shake', Qt: '2Banana,300ml milk,\n 4Dates, 2tbs butter', cal: '638', protein: '21', image: require('@/assets/images/Chatbot/bs.jpg') }
        ],
        Lunch: [
            { id: 44, name: 'Mix Salad', Qt: '1 bowl', cal: '200', protein: '1', image: require('@/assets/images/Chatbot/ms.jpg') },
            { id: 45, name: 'Grilled Chicken', Qt: '200g', cal: '474', protein: '40', image: require('@/assets/images/Chatbot/gc.jpg') }
        ],
        Dinner: [
            { id: 47, name: 'Rice & Fish', Qt: '100g rice, 200g fish', cal: '542', protein: '46.7', image: require('@/assets/images/Chatbot/rf.jpg') },
            { id: 46, name: 'Boiled Eggs', Qt: '3whole,1 white', cal: '265', protein: '21', image: require('@/assets/images/Chatbot/be.jpg') }
        ]
    },
    Thu: {
        Breakfast: [
            { id: 421, name: 'Boiled Eggs', Qt: '3whole,\n 3egg white', cal: '330', protein: '27', image: require('@/assets/images/Chatbot/be.jpg') },
            { id: 422, name: 'Bread Butter', Qt: '4pcs bread, \n 2tbsp', cal: '490', protein: '18', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            
        ],
        Lunch: [
            { id: 123, name: 'Peanut', Qt: '30 g', cal: '170', protein: '8', image: require('@/assets/images/Chatbot/p.jpg') },
            { id: 124, name: 'Black Chana', Qt: '100g', cal: '378', protein: '22.4', image: require('@/assets/images/Chatbot/bc.jpg') },
            { id: 125, name: 'Grilled Chicken', Qt: '100g', cal: '237', protein: '20', image: require('@/assets/images/Chatbot/gc.jpg') }
        ],
        Dinner: [
            { id: 126, name: 'Rice & Fish', Qt: '200g rice,\n 200g fish', cal: '642', protein: '49.4', image: require('@/assets/images/Chatbot/rf.jpg') },
            { id: 127, name: 'Sweet Potato', Qt: '300g', cal: '258', protein: '4.8', image: require('@/assets/images/Chatbot/sp.jpg') }
        ]
    },
    Fri: {
        Breakfast: [
            { id: 128, name: 'Oatmeal', Qt: '100g oats,300ml \nmilk,1banana', cal: '610', protein: '28', image: require('@/assets/images/Chatbot/om.jpg') },
            { id: 129, name: 'Banana Shake', Qt: '2Banana,300ml milk,\n 4Dates, 2tbs butter', cal: '638', protein: '21', image: require('@/assets/images/Chatbot/bs.jpg') }
        ],
        Lunch: [
            { id: 130, name: 'Mix Salad', Qt: '1 bowl', cal: '200', protein: '1', image: require('@/assets/images/Chatbot/ms.jpg') },
            { id: 131, name: 'Beef Qeema', Qt: '150g', cal: '414', protein: '39', image: require('@/assets/images/Chatbot/bk.jpg') }
        ],
        Dinner: [
            { id: 132, name: 'Rice & Chicken', Qt: '100g rice,\n 200g chicken boil', cal: '420', protein: '42.5', image: require('@/assets/images/Chatbot/rc.jpg') },
            { id: 133, name: 'Boiled Eggs', Qt: '3whole', cal: '225', protein: '18', image: require('@/assets/images/Chatbot/be.jpg') }
        ]
       
    },
    Sat: {
        Breakfast: [
            { id: 135, name: 'Brown Bread', Qt: '4pcs', cal: '302', protein: '10', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 136, name: 'Peanut Butter', Qt: '2tbs', cal: '188', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 137, name: 'Banana Shake', Qt: '2Banana,300ml milk,\n 4Dates, 2tbs butter', cal: '638', protein: '21', image: require('@/assets/images/Chatbot/bs.jpg') }
        ],
        Lunch: [
            { id: 138, name: 'Mix Salad', Qt: '1 bowl', cal: '200', protein: '1', image: require('@/assets/images/Chatbot/ms.jpg') },
            { id: 139, name: 'Grilled Chicken', Qt: '200g', cal: '474', protein: '40', image: require('@/assets/images/Chatbot/gc.jpg') }
        ],
        Dinner: [
            { id: 140, name: 'Rice & Fish', Qt: '100g rice, 200g fish', cal: '542', protein: '46.7', image: require('@/assets/images/Chatbot/rf.jpg') },
            { id: 141, name: 'Boiled Eggs', Qt: '3whole,1 white', cal: '265', protein: '21', image: require('@/assets/images/Chatbot/be.jpg') }
        ]
        
    },
    Sun: {
        Breakfast: [
            { id: 142, name: 'Brown Bread', Qt: '4pcs', cal: '302', protein: '10', image: require('@/assets/images/Chatbot/brownbread.jpg') },
            { id: 143, name: 'Peanut Butter', Qt: '2tbs', cal: '188', protein: '8', image: require('@/assets/images/Chatbot/pb.jpg') },
            { id: 144, name: 'Banana Shake', Qt: '2Banana,300ml milk,\n 4Dates, 2tbs butter', cal: '638', protein: '21', image: require('@/assets/images/Chatbot/bs.jpg') }
        ],
        Lunch: [
            { id: 234, name: 'Peanut', Qt: '43g', cal: '244', protein: '11', image: require('@/assets/images/Chatbot/p.jpg') },

            { id: 145, name: 'Mix Salad', Qt: '1 bowl', cal: '200', protein: '1', image: require('@/assets/images/Chatbot/ms.jpg') },
            { id: 146, name: 'Grilled Chicken', Qt: '200g', cal: '474', protein: '40', image: require('@/assets/images/Chatbot/gc.jpg') }
        ],
        Dinner: [
            { id: 147, name: 'Rice & Fish', Qt: '100g rice, 200g fish', cal: '542', protein: '46.7', image: require('@/assets/images/Chatbot/rf.jpg') },
            { id: 148, name: 'Boiled Eggs', Qt: '2whole,1 white', cal: '190', protein: '15', image: require('@/assets/images/Chatbot/be.jpg') }
        ]
    },
};

const DietNormal = () => {
    const [selectedDay, setSelectedDay] = useState<keyof typeof DietPlans>(currentDay); // Default to Monday
    const currentDiet = DietPlans[selectedDay] || {};

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
                <View style={{position:'absolute',right:5,top:30}}>
                        <MyButton
                              title={
                                <Dashboardscreenimage
                                  path={require('@/assets/images/Profile/edit.png')}
                                  styles={styling.dashboardbtnimages}
                                // tintColor='#2ecc71'
                                />
                              }
                              onPress={()=>router.navigate('/(User)/Dietplan')}
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

export default DietNormal;
