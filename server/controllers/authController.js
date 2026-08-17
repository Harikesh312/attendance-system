const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new student
// @route   POST /api/auth/student/signup
// @access  Public
const studentSignup = async (req, res, next) => {
  try {
    const { name, rollNo, email, password } = req.body;

    if (!name || !rollNo || !email || !password) {
      res.status(400);
      throw new Error('Please include all fields');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    // Check if student exists
    const studentExists = await Student.findOne({ $or: [{ email }, { rollNo }] });

    if (studentExists) {
      return res.status(409).json({ error: 'Email or roll number already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create student
    const student = await Student.create({
      name,
      rollNo,
      email,
      passwordHash
    });

    if (student) {
      res.status(201).json({ message: 'Signup successful' });
    } else {
      res.status(400);
      throw new Error('Invalid student data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login student
// @route   POST /api/auth/student/login
// @access  Public
const studentLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (student && (await bcrypt.compare(password, student.passwordHash))) {
      res.status(200).json({
        token: generateToken(student._id, 'student'),
        student: {
          id: student._id,
          name: student.name,
          rollNo: student.rollNo,
          email: student.email
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      res.status(200).json({
        token: generateToken(admin._id, 'admin'),
        admin: {
          id: admin._id,
          email: admin.email
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  studentSignup,
  studentLogin,
  adminLogin
};
