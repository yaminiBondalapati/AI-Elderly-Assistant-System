// server/models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  age: Number,
  gender: String,
  guardianName: String,
  guardianPhone: String,
  allergies: [String],
  medicalHistory: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Profile', profileSchema);
