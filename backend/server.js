require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// ── SECURITY ──
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' }));

// ── ROUTES ──
app.use('/api/contact',     require('./routes/contact'));
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/submissions', require('./routes/submissions'));

// ── HEALTH CHECK ──
app.get('/api/health', (_, res) => res.json({ status: 'OK', time: new Date() }));

// ── 404 ──
app.use((_, res) => res.status(404).json({ error: 'Route not found.' }));

// ── DB + START ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => { console.error('❌ DB connection failed:', err); process.exit(1); });
