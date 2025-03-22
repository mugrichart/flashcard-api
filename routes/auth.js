const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config()

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Mongoose validation error (e.g., duplicate key)
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
    res.json({ token, user: { userId: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to request for further use
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Protected route example
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = {
  authRoutes : router,
  verifyToken
};
