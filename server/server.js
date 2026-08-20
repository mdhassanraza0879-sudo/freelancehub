const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/support', require('./routes/support'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/google05b0fa64d515e42b.html', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send('google-site-verification: google05b0fa64d515e42b.html');
});

app.get('/', (req, res) => {
  res.json({ message: '🚀 FreelanceHub API is running!', status: 'OK' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ─── Database + Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
