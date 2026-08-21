const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Certificate', 'Transcript', 'Other'], default: 'Certificate' },
  fileUrl: { type: String, required: true },
  publicId: { type: String },
  description: { type: String }
}, {
  timestamps: true
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
