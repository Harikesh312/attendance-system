const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  email: { type: String, required: true },
  scannedAt: { type: Date, default: Date.now }
});

// Compound unique index so a student can't be recorded twice for the same session
attendanceSchema.index({ student: 1, session: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
