const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const { protect } = require('../middleware/auth');

// ─── GET /api/wallet (Get User Wallet - Strict Privacy) ───────────────────────
router.get('/', protect, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user._id,
        balance: 14500,
        pendingPayouts: 3500,
        totalWithdrawn: 12000,
        bankDetails: {
          accountHolderName: req.user.name,
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          upiId: '',
        },
        transactions: [
          {
            transactionId: 'TXN_' + Math.floor(100000 + Math.random() * 900000),
            amount: 7500,
            type: 'credit',
            description: 'Project Milestone Settled — React Web App',
            status: 'completed',
          },
          {
            transactionId: 'TXN_' + Math.floor(100000 + Math.random() * 900000),
            amount: 7000,
            type: 'credit',
            description: 'Work From Home Contract Payment',
            status: 'completed',
          },
        ],
      });
    }

    res.json({ success: true, data: wallet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/wallet/bank-details (Save Bank / UPI Details) ─────────────────
router.post('/bank-details', protect, async (req, res) => {
  try {
    const { accountHolderName, accountNumber, ifscCode, bankName, upiId } = req.body;

    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = new Wallet({ user: req.user._id });
    }

    wallet.bankDetails = {
      accountHolderName: accountHolderName || req.user.name,
      accountNumber: accountNumber || '',
      ifscCode: ifscCode || '',
      bankName: bankName || '',
      upiId: upiId || '',
    };

    await wallet.save();
    res.json({ success: true, message: 'Bank & UPI payout details saved securely!', data: wallet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/wallet/withdraw (Request Payout Withdrawal) ───────────────────
router.post('/withdraw', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid withdrawal amount.' });
    }

    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet || wallet.balance < withdrawAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance.' });
    }

    wallet.balance -= withdrawAmount;
    wallet.pendingPayouts += withdrawAmount;
    wallet.transactions.unshift({
      transactionId: 'WITHDRAW_' + Math.floor(100000 + Math.random() * 900000),
      amount: withdrawAmount,
      type: 'withdrawal',
      description: 'Payout Transfer Requested to Linked Bank/UPI',
      status: 'pending',
    });

    await wallet.save();
    res.json({
      success: true,
      message: `🎉 Withdrawal request for ₹${withdrawAmount.toLocaleString()} submitted! Funds will be credited to your bank within 24 hours.`,
      data: wallet,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
