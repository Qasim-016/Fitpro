// routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyDIhnkfUhmQY2CrMKkg4ayAGZ9XIU18VqM');

const gymKeywords = [
  "gym", "workout",'workouts','Diet','diet', "exercise", "fitness", "training", "diet plan", "nutrition",
  "muscle", "cardio", "strength", "weight", "fat", "bodybuilding", 
  "supplements", "trainer", "schedule", "plan", "routine", "equipment", 
  "protein", "calories", "gaining", "losing", "biceps", "abs", "pushups", 
  "squats", "deadlift", "bench press", "warm-up", "cool down", "gym timing"
];

const greetingKeywords = [
  "hi", "hello", "hey", "what's up", "sup", "yo", "greetings", "good morning", "good evening"
];

function isGreeting(question) {
  return greetingKeywords.some(greet => question.toLowerCase().includes(greet));
}

function isGymTiming(question) {
  const q = question.toLowerCase();
  return q.includes("gym timing") || q.includes("what time") || q.includes("open") || q.includes("closing");
}

function isDietPlanQuestion(question) {
  const q = question.toLowerCase();
  return q.includes("diet");
}

function isWorkoutPlanQuestion(question) {
  const q = question.toLowerCase();
  return q.includes("workout");
}

function isGymRelated(question) {
  return gymKeywords.some(keyword => question.toLowerCase().includes(keyword));
}

router.post('/chatbot', async (req, res) => {
  const { question } = req.body;

  try {
    if (isGreeting(question)) {
      return res.json({
        answer: "Hey there! I'm your Gym Assistant. Ask me anything about workouts, diet, or gym info 💪",
      });
    }

    if (isGymTiming(question)) {
      return res.json({
        answer: "In the dashboard, there is a 'Gym Timing Schedule' section — you can check it there.",
      });
    }

    if (isDietPlanQuestion(question)) {
      return res.json({
        answer: "You can find personalized plans in the 'Diet Plan' section on your dashboard 🥗",
      });
    }

    if (isWorkoutPlanQuestion(question)) {
      return res.json({
        answer: "Check out the 'Workout Plan' section in your dashboard for customized routines 🏋️‍♂️",
      });
    }

    if (isGymRelated(question)) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(question);
      const response = await result.response;
      return res.json({ answer: response.text() });
    }

    return res.json({
      answer: "I'm here only for gym-related questions. Try asking about workouts, fitness, or diet!",
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate response.' });
  }
});

module.exports = router;
