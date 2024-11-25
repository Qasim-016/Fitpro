const mongoose = require('mongoose');

const TempUserSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true ,lowercase:true},
  username: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Automatically store the creation time
});

module.exports = mongoose.model('TempUser', TempUserSchema);
