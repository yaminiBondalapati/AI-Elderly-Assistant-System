// server/models/Alert.js
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true,
  },
  medicationName: {
    type: String,
    required: true,
  },
  intakeTime: {
    type: String, // 'morning', 'afternoon', etc.
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'taken'],
    default: 'pending',
  },
  scheduledAt: {
    type: Date,
    default: Date.now,
  },
  takenAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Alert', alertSchema);