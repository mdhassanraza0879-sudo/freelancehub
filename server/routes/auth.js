const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// ── Helper: Generate JWT ──────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'freelancehub_secret_2026', { expiresIn: '7d' });

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .optional()
      .isIn(['freelancer', 'client'])
      .withMessage('Role must be freelancer or client'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0]?.msg || 'Validation failed',
        errors: errors.array()
      });
    }

    let { name, email, password, role = 'freelancer', username } = req.body;
    email = email.trim().toLowerCase();

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: 'Email already registered. Please login.' });
      }

      // Generate a unique fallback username if not provided or empty
      let finalUsername = username ? username.trim().toLowerCase() : '';
      if (!finalUsername) {
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        finalUsername = `${cleanName || 'user'}_${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100)}`;
      }

      // Ensure username uniqueness
      const existingUsername = await User.findOne({ username: finalUsername });
      if (existingUsername) {
        finalUsername = `${finalUsername}_${Math.floor(Math.random() * 1000)}`;
      }

      const user = await User.create({
        name: name.trim(),
        email,
        password,
        role: role || 'freelancer',
        username: finalUsername,
        isVerified: true,
      });

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to FreelanceHub.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          username: user.username,
        },
      });
    } catch (err) {
      console.error('Registration Error:', err);
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to create account. Please try again.'
      });
    }
  }
);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0]?.msg || 'Validation failed',
        errors: errors.array()
      });
    }

    const email = req.body.email.trim().toLowerCase();
    const { password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          username: user.username,
          isPremium: user.isPremium,
        },
      });
    } catch (err) {
      console.error('Login Error:', err);
      res.status(500).json({ success: false, message: 'Server error during login' });
    }
  }
);

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
const { protect } = require('../middleware/auth');

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
