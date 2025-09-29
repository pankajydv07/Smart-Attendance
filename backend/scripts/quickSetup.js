#!/usr/bin/env node
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Try both Atlas and local MongoDB
const mongoUris = [
  process.env.MONGO_URI,
  'mongodb://localhost:27017/smartattend',
  'mongodb://127.0.0.1:27017/smartattend'
];

async function tryConnection(uri) {
  try {
    await mongoose.connect(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    console.log(`✅ Connected to MongoDB: ${uri}`);
    return true;
  } catch (error) {
    console.log(`❌ Failed to connect to: ${uri}`);
    return false;
  }
}

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@smartattend.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('✅ Admin user already exists:', email);
      return { email, password, existed: true };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({ 
      name: 'Smart Attend Admin', 
      email, 
      password: hashedPassword, 
      role: 'admin', 
      approved: true 
    });
    
    await admin.save();
    console.log('✅ Created admin user:', email);
    return { email, password, existed: false };
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    throw error;
  }
}

async function run() {
  console.log('🚀 Setting up Smart Attendance System...\n');
  
  // Try to connect to MongoDB
  let connected = false;
  for (const uri of mongoUris.filter(Boolean)) {
    if (await tryConnection(uri)) {
      connected = true;
      break;
    }
  }
  
  if (!connected) {
    console.error('\n❌ Could not connect to any MongoDB instance!');
    console.log('\n📋 Solutions:');
    console.log('1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.log('2. Start MongoDB service: net start MongoDB (Windows) or brew services start mongodb-community (Mac)');
    console.log('3. Or fix your MongoDB Atlas connection in .env file');
    process.exit(1);
  }
  
  try {
    const result = await createAdminUser();
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Admin Login Credentials:');
    console.log(`   Email: ${result.email}`);
    console.log(`   Password: ${result.password}`);
    
    if (!result.existed) {
      console.log('\n⚠️  Please change the password after first login for security!');
    }
    
    console.log('\n🌐 Next steps:');
    console.log('1. Start the backend: npm run dev');
    console.log('2. Start the frontend: cd .. && npm run dev');
    console.log('3. Access admin panel: http://localhost:8080/admin/login');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
  } finally {
    process.exit(0);
  }
}

run().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});