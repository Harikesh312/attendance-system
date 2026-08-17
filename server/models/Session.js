const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true }, // uuid
  title: { type: String, default: 'Class Session' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
});

module.exports = mongoose.model('Session', sessionSchema);
