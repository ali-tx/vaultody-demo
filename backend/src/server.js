const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const config = require('./config/env');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallets');

const app = express();

// Database Connection
console.log('Connecting to MongoDB at:', config.mongoUri);
mongoose.connect(config.mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes - Managed in separate router
app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api', apiRoutes);

// Start Server
app.listen(config.port, () => {
    console.log(`Vaultody Demo Backend running on port ${config.port}`);
    console.log(`Vaultody Base URL: ${config.vaultody.baseUrl}`);
});
