const mongoose = require('mongoose');

const cvSchema = mongoose.Schema({
  fileUrl: { type: String, required: true },
  publicId: { type: String },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const CV = mongoose.model('CV', cvSchema);
module.exports = CV;
