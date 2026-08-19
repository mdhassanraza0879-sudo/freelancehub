const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Plans Config ──────────────────────────────────────────────────────────────
const PLANS = {
  freelancer_premium: {
    name: 'Freelancer Premium',
    amount: 19900,       // ₹199 in paise
    currency: 'INR',
    description: 'Premium profile badge, top search ranking, unlimited applications',
  },
  client_pro: {
    name: 'Client Pro',
    amount: 49900,       // ₹499 in paise
    currency: 'INR',
    description: 'Post unlimited jobs, priority applicants, featured listing credit',
  },
  featured_job: {
    name: 'Featured Job',
    amount: 29900,       // ₹299 in paise
    currency: 'INR',
    description: 'Feature your job at the top of search results for 30 days',
  },
};

// ── POST /api/payments/create-order ──────────────────────────────────────────
router.post('/create-order', protect, async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = PLANS[planId];

    if (!plan) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `order_${req.user._id}_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        planId,
      },
    });

    res.json({
      success: true,
      order,
      plan,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Payment order error:', err);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

// ── POST /api/payments/verify ─────────────────────────────────────────────────
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update user premium status
    if (planId === 'freelancer_premium' || planId === 'client_pro') {
      await User.findByIdAndUpdate(req.user._id, {
        isPremium: true,
        premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
    }

    // For featured job — handled separately via job ID in request
    if (planId === 'featured_job' && req.body.jobId) {
      const Job = require('../models/Job');
      await Job.findByIdAndUpdate(req.body.jobId, { isFeatured: true });
    }

    res.json({
      success: true,
      message: '✅ Payment successful! Premium activated.',
    });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/payments/plans ── Public: Get all plans ─────────────────────────
router.get('/plans', (req, res) => {
  const plans = Object.entries(PLANS).map(([id, plan]) => ({
    id,
    ...plan,
    displayPrice: `₹${plan.amount / 100}`,
  }));
  res.json({ success: true, data: plans });
});

module.exports = router;
