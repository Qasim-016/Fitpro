const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
    email: { type: String, required: true, unique: true ,lowercase:true},
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  subscriptionEndTime: { type: Number, required: true } // Timestamp of subscription end time
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
