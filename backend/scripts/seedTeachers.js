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

    const teachers = [
      { 
        name: 'Ravi Kumar', 
        email: 'ravi.kumar@smartattend.com', 
        role: 'teacher', 
        approved: true,  // Pre-approved for testing
        recognitionActive: false
      },
      { 
        name: 'Anita Sharma', 
        email: 'anita.sharma@smartattend.com', 
        role: 'teacher', 
        approved: false  // Needs admin approval
      },
    ];

    for (const t of teachers) {
      const exists = await User.findOne({ email: t.email });
      if (!exists) {
        const hashed = await bcrypt.hash('teacher123', 10);
        const user = new User({ ...t, password: hashed });
        await user.save();
        console.log(`Seeded teacher: ${t.email} (Password: teacher123)`);
      } else {
        console.log('Teacher already exists:', t.email);
      }
    }

    console.log('\n=== TEACHER ACCOUNTS CREATED ===');
    console.log('1. Approved Teacher (can login immediately):');
    console.log('   Email: ravi.kumar@smartattend.com');
    console.log('   Password: teacher123');
    console.log('\n2. Pending Teacher (needs admin approval):');
    console.log('   Email: anita.sharma@smartattend.com');
    console.log('   Password: teacher123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding teachers:', error);
    process.exit(1);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
