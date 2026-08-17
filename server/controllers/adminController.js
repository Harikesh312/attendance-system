const Session = require('../models/Session');
const Attendance = require('../models/Attendance');
const crypto = require('crypto');
const qrcode = require('qrcode');

// @desc    Generate a new QR code session
// @route   POST /api/admin/generate-qr
// @access  Private (Admin)
const generateQR = async (req, res, next) => {
  try {
    const { title } = req.body;
    const sessionId = crypto.randomUUID();
    const expiryMinutes = parseInt(process.env.SESSION_EXPIRY_MINUTES) || 15;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60000);

    const session = await Session.create({
      sessionId,
      title: title || 'Class Session',
      expiresAt,
      createdBy: req.user.id
    });

    const qrPayload = JSON.stringify({ sessionId });
    const qrImage = await qrcode.toDataURL(qrPayload);

    res.status(201).json({
      sessionId: session.sessionId,
      qrImage,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records
// @route   GET /api/admin/records
// @access  Private (Admin)
const getRecords = async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    let query = {};

    if (sessionId) {
      const session = await Session.findOne({ sessionId });
      if (session) {
        query.session = session._id;
      } else {
        return res.status(404).json({ error: 'Session not found' });
      }
    }

    const records = await Attendance.find(query)
      .sort({ scannedAt: -1 })
      .populate('session', 'title sessionId');

    const formattedRecords = records.map(record => ({
      name: record.name,
      rollNo: record.rollNo,
      email: record.email,
      sessionTitle: record.session ? record.session.title : 'Unknown',
      scannedAt: record.scannedAt
    }));

    res.status(200).json({ records: formattedRecords });
  } catch (error) {
    next(error);
  }
};

// @desc    Download attendance records as CSV
// @route   GET /api/admin/records/download
// @access  Private (Admin)
const downloadRecordsCSV = async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    let query = {};

    if (sessionId) {
      const session = await Session.findOne({ sessionId });
      if (session) {
        query.session = session._id;
      } else {
        return res.status(404).json({ error: 'Session not found' });
      }
    }

    const records = await Attendance.find(query)
      .sort({ scannedAt: -1 })
      .populate('session', 'title');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=\"attendance.csv\"');

    // CSV Header
    res.write('Name,Roll No,Email,Session,Scanned At\n');

    // CSV Rows
    records.forEach(record => {
      const name = `"${record.name}"`;
      const rollNo = `"${record.rollNo}"`;
      const email = `"${record.email}"`;
      const sessionTitle = `"${record.session ? record.session.title : 'Unknown'}"`;
      const scannedAt = `"${new Date(record.scannedAt).toLocaleString()}"`;
      
      res.write(`${name},${rollNo},${email},${sessionTitle},${scannedAt}\n`);
    });

    res.end();
  } catch (error) {
    next(error);
  }
};

// @desc    Get all past sessions
// @route   GET /api/admin/sessions
// @access  Private (Admin)
const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

// @desc    Stop an active QR session
// @route   POST /api/admin/stop-session/:sessionId
// @access  Private (Admin)
const stopSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    session.expiresAt = new Date();
    await session.save();
    res.status(200).json({ message: 'Session stopped successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQR,
  getRecords,
  downloadRecordsCSV,
  getSessions,
  stopSession
};
