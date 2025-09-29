import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/smartattend';

async function run() {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    
    const email = process.env.ADMIN_EMAIL || 'admin@smartattend.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin123!';
    
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin user already exists:', email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = new User({ 
      name: 'Smart Attend Admin', 
      email, 
      password: hashed, 
      role: 'admin', 
      approved: true 
    });
    await admin.save();
    console.log('Created admin user:', email);
    console.log('Password:', password);
    console.log('Please change the password after first login.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
