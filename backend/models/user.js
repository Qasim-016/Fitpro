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
  profileImage: { type: String, default: '' }, // Store Base64 string


  
}, { collection: 'fitpro' }); // Ensure it's saved in the 'fitpro' collectionssss

const User = mongoose.model('user', userSchema);

module.exports = User;

  



