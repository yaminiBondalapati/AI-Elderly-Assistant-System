// server/models/MedicalReport.js
const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportName: {
    type: String,
    required: true,
  },
  reportFile: {
    type: String,
    required: true, // base64 encoded file
  },
  fileType: {
    type: String,
    enum: ['image', 'pdf'],
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MedicalReport', medicalReportSchema);
