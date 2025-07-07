const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true }); // includes createdAt

module.exports = mongoose.model('ActivityLog', activityLogSchema);
