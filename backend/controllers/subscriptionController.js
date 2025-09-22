// controllers/subscriptionController.js
const stripe = require('stripe')('sk_test_51QQorvDwtEPD58vaGf1gfpz6XX0Ns7nSUbfZ97vLntYdtMftqiiPpfhHT48RmrpQg6og69nIkFmZWsY4tDHMbZaI00ulYSpyAe');
const Subscription = require('../models/subscription');
const Trial = require('../models/trialSchema');

// exports.createPaymentIntent = async (req, res) => {
//   const { amount, userId, username, email } = req.body;

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: parseInt(amount) * 100,
//     currency: 'usd',
//     metadata: { userId, username, email },
//   });

//   const startDate = new Date();
//   const subscriptionEndTime = new Date(startDate);
//   subscriptionEndTime.setMonth(startDate.getMonth() + 1);

//   const newSubscription = new Subscription({
//     userId,
//     email,
//     name: username,
//     amount,
//     startDate,
//     subscriptionEndTime,
//   });

//   await newSubscription.save();

//   res.json({ clientSecret: paymentIntent.client_secret });
// };



exports.createPaymentIntent = async (req, res) => {
  const { amount, userId, username, email } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100,
    currency: 'usd',
    metadata: { userId, username, email },
  });

  // Only send clientSecret, don't save subscription here
  res.json({ clientSecret: paymentIntent.client_secret });
};

exports.saveSubscriptionAfterPayment = async (req, res) => {
  const { userId, username, email, amount, duration } = req.body;

  if (!userId || !username || !email || !amount || !duration) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const startDate = new Date();
  const subscriptionEndTime = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000); // add days

  const newSubscription = new Subscription({
    userId,
    email,
    name: username,
    amount,
    startDate,
    subscriptionEndTime,
  });

  try {
    await newSubscription.save();
    res.json({ success: true, message: 'Subscription saved successfully.' });
  } catch (error) {
    console.error('Failed to save subscription:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


exports.saveOrUpdateSubscription = async (req, res) => {
  const { userId, subscriptionEndTime } = req.body;

  const subscription = await Subscription.findOneAndUpdate(
    { userId },
    { subscriptionEndTime },
    { new: true, upsert: true }
  );

  res.json({ success: true, subscription });
};

exports.deleteSubscription = async (req, res) => {
  const { userId } = req.params;

  await Subscription.findOneAndDelete({ userId });

  res.json({ success: true });
};

exports.getTrialInfo = async (req, res) => {
  const trial = await Trial.findOne({ userId: req.params.userId });

  if (!trial || trial.trialStatus === 'inactive') {
    return res.status(404).json({ error: 'No free trial found' });
  }

  if (trial.trialStatus === 'active') {
    return res.status(200).json({ success: true, trialStatus: 'active' });
  }
};

exports.getSubscription = async (req, res) => {
  const { userId } = req.params;

  const subscription = await Subscription.findOne({ userId });

  if (!subscription) {
    return res.status(404).json({ error: 'No subscription found' });
  }

  res.json({ subscriptionEndTime: subscription.subscriptionEndTime });
};

// Auto-expire trials every hour
exports.updateExpiredTrials = async () => {
  const currentDate = new Date();
  const expiredTrials = await Trial.find({ endTime: { $lte: currentDate }, trialStatus: 'active' });

  for (const trial of expiredTrials) {
    trial.trialStatus = 'inactive';
    await trial.save();
  }
};
