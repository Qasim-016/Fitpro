// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51QQorvDwtEPD58vaGf1gfpz6XX0Ns7nSUbfZ97vLntYdtMftqiiPpfhHT48RmrpQg6og69nIkFmZWsY4tDHMbZaI00ulYSpyAe');
const Subscription = require('../models/subscription');
const Trial = require('../models/trialSchema');

// Create Stripe Payment Intent and save subscription
router.post('/payment-intent', async (req, res) => {
  try {
    const { amount, userId, username, email } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 100,
      currency: 'usd',
      metadata: { userId, username, email },
    });

    const startDate = new Date();
    const subscriptionEndTime = new Date(startDate);
    subscriptionEndTime.setMonth(startDate.getMonth() + 1);

    const newSubscription = new Subscription({
      userId,
      email,
      name: username,
      amount,
      startDate,
      subscriptionEndTime,
    });

    await newSubscription.save();
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

// Save or update subscription end time
router.post('/subscription', async (req, res) => {
  try {
    const { userId, subscriptionEndTime } = req.body;
    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      { subscriptionEndTime },
      { new: true, upsert: true }
    );

    res.json({ success: true, subscription });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save subscription data' });
  }
});

// Delete subscription
router.delete('/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await Subscription.findOneAndDelete({ userId });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Get trial info for a user
router.get('/trial/:userId', async (req, res) => {
  try {
    const trial = await Trial.findOne({ userId: req.params.userId });

    if (!trial || trial.trialStatus === 'inactive') {
      return res.status(404).json({ error: 'No free trial found' });
    }

    if (trial.trialStatus === 'active') {
      return res.status(200).json({ success: true, trialStatus: 'active' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subscription for a user
router.get('/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    res.json({ subscriptionEndTime: subscription.subscriptionEndTime });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve subscription data' });
  }
});

// Auto-expire trials every hour (adjust time as needed)
const updateExpiredTrials = async () => {
  try {
    const currentDate = new Date();
    const expiredTrials = await Trial.find({ endTime: { $lte: currentDate }, trialStatus: 'active' });

    for (const trial of expiredTrials) {
      trial.trialStatus = 'inactive';
      await trial.save();
    }
  } catch (error) {
    console.error('Error updating expired trials:', error);
  }
};

setInterval(updateExpiredTrials, 3600000); // Every hour

module.exports = router;
