// seedAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // make sure bcryptjs installed
const User = require('../models/user');
const connectDB = require('../config/db');

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword, // hashed password
      role: 'admin',
    });
    await admin.save();

    console.log('Admin user created successfully ✅');
    console.log(`Admin user details: 
Name: ${admin.name} 
Email: ${admin.email} 
Password: 'admin123'`); // login me use this password

    process.exit();
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
