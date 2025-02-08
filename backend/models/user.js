const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: {
    type: String,
    required: true, // Ensure that firebaseId is always provided
},
  email: { type: String, required: true, unique: true ,lowercase:true},
  username: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
}, { collection: 'fitpro' }); // Ensure it's saved in the 'fitpro' collection

const User = mongoose.model('User', userSchema);

module.exports = User;

  



