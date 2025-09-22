const express = require('express');
const router = express.Router();

const asyncHandler = require('../middleware/asyncHandler');
const subscriptionController = require('../controllers/subscriptionController');

router.post('/payment-intent', asyncHandler(subscriptionController.createPaymentIntent));

router.post('/subscription', asyncHandler(subscriptionController.saveOrUpdateSubscription));

router.delete('/subscription/:userId', asyncHandler(subscriptionController.deleteSubscription));

router.get('/trial/:userId', asyncHandler(subscriptionController.getTrialInfo));

router.get('/subscription/:userId', asyncHandler(subscriptionController.getSubscription));
router.post('/save-subscription', asyncHandler(subscriptionController.saveSubscriptionAfterPayment));


module.exports = router;
