const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getMe, scanQR, getHistory } = require('../controllers/studentController');

// All routes here require student role
router.use(verifyToken('student'));

router.get('/me', getMe);
router.post('/scan', scanQR);
router.get('/history', getHistory);

module.exports = router;
