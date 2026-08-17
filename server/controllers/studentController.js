const Session = require('../models/Session');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Get student profile
// @route   GET /api/student/me
// @access  Private (Student)
const getMe = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id).select('-passwordHash');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// @desc    Scan QR and mark attendance
// @route   POST /api/student/scan
// @access  Private (Student)
const scanQR = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Invalid QR code' });
    }

    if (new Date() > session.expiresAt) {
      return res.status(410).json({ error: 'This QR code has expired' });
    }

    // Check if attendance already recorded
    const existingAttendance = await Attendance.findOne({
      student: req.user.id,
      session: session._id
    });

    if (existingAttendance) {
      return res.status(409).json({ error: 'Attendance already recorded for this session' });
    }

    // Get student details for snapshot
    const student = await Student.findById(req.user.id);

    const record = await Attendance.create({
      student: student._id,
      session: session._id,
      name: student.name,
      rollNo: student.rollNo,
      email: student.email
    });

    res.status(201).json({ message: 'Attendance marked successfully', record });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Attendance already recorded for this session' });
    }
    next(error);
  }
};

// @desc    Get own attendance history
// @route   GET /api/student/history
// @access  Private (Student)
const getHistory = async (req, res, next) => {
  try {
    const records = await Attendance.find({ student: req.user.id })
      .sort({ scannedAt: -1 })
      .populate('session', 'title');

    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  scanQR,
  getHistory
};
