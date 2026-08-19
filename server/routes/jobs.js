const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

// ── GET /api/jobs ─── Public: List all open jobs ──────────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      budgetMin,
      budgetMax,
      experienceLevel,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: 'open' };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (budgetMin || budgetMax) {
      query.budgetMax = {};
      if (budgetMin) query.budgetMax.$gte = Number(budgetMin);
      if (budgetMax) query.budgetMax.$lte = Number(budgetMax);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('client', 'name companyName profilePicture location')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/jobs/:id ─── Public: Single job detail ──────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'client',
      'name companyName profilePicture location rating reviewCount'
    );
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/jobs ─── Protected (client only): Create a job ─────────────────
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'client')
      return res.status(403).json({ success: false, message: 'Only clients can post jobs' });

    const {
      title, description, skillsRequired, category,
      budgetType, budgetMin, budgetMax, deadline, location, experienceLevel,
    } = req.body;

    const job = await Job.create({
      title, description, skillsRequired, category,
      budgetType, budgetMin, budgetMax, deadline, location, experienceLevel,
      client: req.user._id,
    });

    res.status(201).json({ success: true, data: job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── PUT /api/jobs/:id ─── Protected (owner only): Update a job ───────────────
router.put('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.client.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── DELETE /api/jobs/:id ─── Protected (owner only): Delete a job ─────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.client.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await job.deleteOne();
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/jobs/my/postings ─── Protected (client): My job postings ─────────
router.get('/my/postings', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
