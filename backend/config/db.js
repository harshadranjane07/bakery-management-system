const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * Third-Year Computer Engineering Project: Bakery Product Management System
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bakery_management_db';
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed initial catalog if database is empty (useful for new cloud deployments like Render)
    const Category = require('../models/Category');
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      console.log('[AutoSeed] Empty database detected. Populating initial bakery categories and products...');
      const seedDatabase = require('./seed');
      await seedDatabase(false);
      console.log('[AutoSeed] Database initialized successfully!');
    }
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
