const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to Database
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    project: 'Bakery Product Management System',
    timestamp: new Date()
  });
});

// Database seed / initialization endpoint for cloud deployments
app.get('/api/setup/seed', async (req, res) => {
  try {
    const seedDatabase = require('./config/seed');
    await seedDatabase(false);
    res.status(200).json({
      success: true,
      message: 'Database initialized successfully with admin account, categories, and bakery products!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve Angular production build if present (Unified full-stack support)
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist', 'frontend', 'browser');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // 404 handler for undefined API routes when frontend build is not served
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
  });
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[ServerError]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  Bakery Product Management System - Backend Server  `);
  console.log(`  Running on http://localhost:${PORT}               `);
  console.log(`  Unified Full-Stack: http://localhost:${PORT}      `);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});
