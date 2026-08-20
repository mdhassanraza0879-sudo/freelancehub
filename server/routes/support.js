const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { protect } = require('../middleware/auth');

// ─── GET /api/support (Get User's Tickets - Strict Privacy) ───────────────────
router.get('/', protect, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/support (Create New Ticket) ───────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { subject, category, priority, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required.' });
    }

    const ticketId = 'TICK_' + Math.floor(100000 + Math.random() * 900000);

    const ticket = await SupportTicket.create({
      ticketId,
      user: req.user._id,
      subject,
      category: category || 'General Query',
      priority: priority || 'medium',
      status: 'open',
      messages: [
        {
          sender: req.user.name,
          senderRole: 'user',
          text: message,
        },
      ],
    });

    res.json({
      success: true,
      message: `🎉 Support Ticket #${ticketId} created! Our 24/7 support team is reviewing your query.`,
      data: ticket,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/support/:id/reply (Reply to Ticket) ───────────────────────────
router.post('/:id/reply', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    const ticket = await SupportTicket.findOne({ _id: req.params.id, user: req.user._id });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found or access denied.' });
    }

    ticket.messages.push({
      sender: req.user.name,
      senderRole: 'user',
      text,
    });

    // Auto admin response trigger for demonstration
    setTimeout(async () => {
      try {
        const t = await SupportTicket.findById(ticket._id);
        if (t) {
          t.messages.push({
            sender: 'FreelanceHub 24/7 Support Team',
            senderRole: 'admin',
            text: 'Hello! Thank you for reaching out. We have logged your request and our specialist is resolving this for you.',
          });
          t.status = 'in-progress';
          await t.save();
        }
      } catch (e) {}
    }, 1500);

    await ticket.save();
    res.json({ success: true, message: 'Reply sent successfully!', data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
