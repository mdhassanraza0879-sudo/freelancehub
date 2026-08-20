const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect } = require('../middleware/auth');

// ─── GET /api/companies (Paginated, Search & Filters) ─────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search, industry, location, isFeatured, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (industry && industry !== 'All') {
      query.industry = industry;
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: companies,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/companies/:id ───────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/companies/:id/apply (Apply to Company) ────────────────────────
router.post('/:id/apply', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({
      success: true,
      message: `🎉 Your application has been directly submitted to ${company.name} hiring team!`,
      data: { companyId: company._id, companyName: company.name, date: new Date() },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
