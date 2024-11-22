const mongoose = require('mongoose');

const fitproUserSchema = new mongoose.Schema({
    firebaseId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FitproUser', fitproUserSchema);
