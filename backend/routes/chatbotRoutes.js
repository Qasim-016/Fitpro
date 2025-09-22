// const express = require('express');
// const router = express.Router();
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const genAI = new GoogleGenerativeAI('AIzaSyDIhnkfUhmQY2CrMKkg4ayAGZ9XIU18VqM');

// // Keywords for gym + injuries
// const gymKeywords = [
//   "gym", "workout", "workouts", "Diet", "diet", "exercise", "fitness", "training",
//   "diet plan", "nutrition", "muscle", "cardio", "strength", "weight", "fat", "bodybuilding",
//   "supplements", "trainer", "schedule", "plan", "routine", "equipment",
//   "protein", "calories", "gaining", "losing", "biceps", "abs", "pushups",
//   "squats", "deadlift", "bench press", "warm-up", "cool down", "gym timing",
//   "injury", "injuries", "pain", "strain", "sprain", "recovery", "soreness", "stretch", "stretching", "healing"
// ];

// // Greeting keywords
// const greetingKeywords = [
//   "hi", "hello", "hey", "what's up", "sup", "yo", "greetings", "good morning", "good evening"
// ];

// // Patterns to reject completely non-gym topics
// const nonGymPatterns = [
//   /who\s+won/i, /match/i, /game/i, /movie/i, /weather/i,
//   /news/i, /politics/i, /cricket/i, /football/i, /basketball/i, /score/i, /team/i
// ];

// function isGreeting(question) {
//   return greetingKeywords.some(greet => question.toLowerCase().includes(greet));
// }

// function isGymTiming(question) {
//   const q = question.toLowerCase();
//   return q.includes("gym timing") || q.includes("what time") || q.includes("open") || q.includes("closing");
// }

// function isDietPlanQuestion(question) {
//   const q = question.toLowerCase();
//   return q.includes("diet");
// }

// function isWorkoutPlanQuestion(question) {
//   const q = question.toLowerCase();
//   return q.includes("workout");
// }

// function isInjuryOrMuscleProblem(question) {
//   const q = question.toLowerCase();
//   return (
//     q.includes("injury") ||
//     q.includes("pain") ||
//     q.includes("sore") ||
//     q.includes("strain") ||
//     q.includes("sprain") ||
//     q.includes("hurt") ||
//     q.includes("recovery") ||
//     q.includes("stretch") ||
//     q.includes("healing")
//   );
// }

// function isGymRelated(question) {
//   const lowerCaseQuestion = question.toLowerCase();

//   // First reject unrelated topics
//   if (nonGymPatterns.some(pattern => pattern.test(lowerCaseQuestion))) {
//     return false;
//   }

//   // Accept if any gym/injury keyword matches
//   return gymKeywords.some(keyword =>
//     new RegExp(`\\b${keyword}\\b`, 'i').test(lowerCaseQuestion)
//   );
// }

// router.post('/chatbot', async (req, res, next) => {
//   const { question } = req.body;

//   try {
//     if (isGreeting(question)) {
//       return res.json({
//         answer: "Hey there! 👋 I'm your Gym Assistant. Ask me anything about workouts, diet, injuries, or gym-related issues 💪",
//       });
//     }

//     if (isGymTiming(question)) {
//       return res.json({
//         answer: "You can check the 'Gym Timing Schedule' in the dashboard 📅",
//       });
//     }

//     if (isDietPlanQuestion(question)) {
//       return res.json({
//         answer: "You can find personalized plans in the 'Diet Plan' section on your dashboard 🥗",
//       });
//     }

//     if (isWorkoutPlanQuestion(question)) {
//       return res.json({
//         answer: "Check out the 'Workout Plan' section in your dashboard for customized routines 🏋️‍♂️",
//       });
//     }

//     if (isInjuryOrMuscleProblem(question)) {
//       const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//       const result = await model.generateContent(`Gym injury related advice: ${question}`);
//       const response = await result.response;
//       return res.json({ answer: response.text() });
//     }

//     if (isGymRelated(question)) {
//       const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//       const result = await model.generateContent(question);
//       const response = await result.response;
//       return res.json({ answer: response.text() });
//     }

//     // Fallback for totally unrelated queries
//     return res.json({
//       answer: "I'm here to assist with gym-related queries only 🏋️‍♂️🏃‍♂️",
//     });
//   } catch (error) {
//     console.error('Error calling Gemini API:', error);
//     next(error); // Pass error to error handler middleware
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyDIhnkfUhmQY2CrMKkg4ayAGZ9XIU18VqM');

// Keywords for gym + injuries
const gymKeywords = [
  "gym", "workout", "workouts", "diet", "exercise", "fitness", "training",
  "diet plan", "nutrition", "muscle", "cardio", "strength", "weight", "fat", "bodybuilding",
  "supplements", "trainer", "schedule", "plan", "routine", "equipment",
  "protein", "calories", "gaining", "losing", "biceps", "abs", "pushups",
  "squats", "deadlift", "bench press", "warm-up", "cool down", "gym timing",
  "injury", "injuries", "pain", "strain", "sprain", "recovery", "soreness", "stretch", "stretching", "healing", "rest"
];

// Keywords that are *too generic* alone
const vagueKeywords = [
  "plan", "routine", "schedule", "program", "timing", "exercise", "stretch"
];

// Greeting keywords
const greetingKeywords = [
  "hi", "hello", "hey", "what's up", "sup", "yo", "greetings", "good morning", "good evening"
];

// Patterns to reject non-gym topics
const nonGymPatterns = [
  /who\s+won/i, /match/i, /game/i, /movie/i, /weather/i,
  /news/i, /politics/i, /cricket/i, /football/i, /basketball/i, /score/i, /team/i
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

function isInjuryOrMuscleProblem(question) {
  const q = question.toLowerCase();
  return (
    q.includes("injury") ||
    q.includes("pain") ||
    q.includes("sore") ||
    q.includes("strain") ||
    q.includes("sprain") ||
    q.includes("hurt") ||
    q.includes("recovery") ||
    q.includes("stretch") ||
    q.includes("healing")
  );
}

function isGymRelated(question) {
  const lowerCaseQuestion = question.toLowerCase();

  if (nonGymPatterns.some(pattern => pattern.test(lowerCaseQuestion))) {
    return false;
  }

  return gymKeywords.some(keyword =>
    new RegExp(`\\b${keyword}\\b`, 'i').test(lowerCaseQuestion)
  );
}

// ✅ Updated vague check
function isVagueQuestion(question) {
  const trimmed = question.trim().toLowerCase();
  return vagueKeywords.includes(trimmed); // Only if the question itself is a single vague keyword
}

router.post('/chatbot', async (req, res, next) => {
  const { question } = req.body;

  try {
    if (isGreeting(question)) {
      return res.json({
        answer: "Hey there! 👋 I'm your Gym Assistant. Ask me anything about workouts, diet, injuries, or gym-related topics 💪",
      });
    }

    if (isGymTiming(question)) {
      return res.json({
        answer: "You can check the 'Gym Timing Schedule' in the dashboard 📅",
      });
    }

    if (isDietPlanQuestion(question)) {
      return res.json({
        answer: "You can find personalized diet plans in the 'Diet Plan' section on your dashboard 🥗",
      });
    }

    if (isWorkoutPlanQuestion(question)) {
      return res.json({
        answer: "Check out the 'Workout Plan' section in your dashboard for customized routines 🏋️‍♂️",
      });
    }

    if (isInjuryOrMuscleProblem(question)) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(`Give gym injury related advice: ${question}`);
      const response = await result.response;
      return res.json({ answer: response.text() });
    }

    if (isGymRelated(question)) {
      if (isVagueQuestion(question)) {
        return res.json({
          answer: "Could you please provide more complete information? 📄 For example, what type of plan or routine are you asking about? 💬",
        });
      } else {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(question);
        const response = await result.response;
        return res.json({ answer: response.text() });
      }
    }

    return res.json({
      answer: "I'm here to assist with gym-related queries only 🏋️‍♂️🏃‍♂️",
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    next(error);
  }
});

module.exports = router;
