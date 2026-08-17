const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { generateQR, getRecords, downloadRecordsCSV, getSessions, stopSession } = require('../controllers/adminController');

// All routes here require admin role
router.use(verifyToken('admin'));

router.post('/generate-qr', generateQR);
router.get('/records', getRecords);
router.get('/records/download', downloadRecordsCSV);
router.get('/sessions', getSessions);
router.post('/stop-session/:sessionId', stopSession);

module.exports = router;
