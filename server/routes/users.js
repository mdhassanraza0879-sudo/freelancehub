const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ── GET /api/users/freelancers ─── Public: Browse all freelancers ─────────────
router.get('/freelancers', async (req, res) => {
  try {
    const { skill, search, page = 1, limit = 12 } = req.query;

    const query = { role: 'freelancer' };

    if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { title: new RegExp(search, 'i') },
      { skills: { $in: [new RegExp(search, 'i')] } },
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const freelancers = await User.find(query)
      .select('-password -email')
      .sort({ isPremium: -1, rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: freelancers,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/users/profile/:username ─── Public: Get freelancer public profile ─
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
      role: 'freelancer',
    }).select('-password -email');

    if (!user)
      return res.status(404).json({ success: false, message: 'Freelancer not found' });

    // Increment profile views
    await User.findByIdAndUpdate(user._id, { $inc: { profileViews: 1 } });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── PUT /api/users/profile ─── Protected: Update own profile ──────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const allowedFields = [
      'name', 'username', 'title', 'bio', 'skills', 'hourlyRate',
      'location', 'profilePicture', 'portfolioItems', 'socialLinks',
      'companyName', 'companyWebsite',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Ensure username uniqueness
    if (updates.username) {
      updates.username = updates.username.toLowerCase();
      const existing = await User.findOne({
        username: updates.username,
        _id: { $ne: req.user._id },
      });
      if (existing)
        return res
          .status(400)
          .json({ success: false, message: 'Username already taken' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/users/dashboard ─── Protected: Dashboard stats ───────────────────
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
