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

    // Find the approved teacher to attach students to
    const teacher = await User.findOne({ email: 'ravi.kumar@smartattend.com', role: 'teacher' }) || await User.findOne({ role: 'teacher' });
    if (!teacher) {
      console.error('No teacher found. Run "npm run seed:teachers" first to create teachers.');
      process.exit(1);
    }

    const students = [
      { name: 'Rahul Sharma', email: 'rahul.sharma@smartattend.com' },
      { name: 'Priya Patel', email: 'priya.patel@smartattend.com' },
      { name: 'Arjun Kumar', email: 'arjun.kumar@smartattend.com' },
      { name: 'Sneha Singh', email: 'sneha.singh@smartattend.com' },
      { name: 'Kavita Joshi', email: 'kavita.joshi@smartattend.com' },
    ];

    for (const s of students) {
      const exists = await User.findOne({ email: s.email });
      if (!exists) {
        const hashed = await bcrypt.hash('student123', 10);
        const user = new User({ 
          name: s.name, 
          email: s.email, 
          password: hashed, 
          role: 'student', 
          approved: true,  // Students are auto-approved
          teacherId: teacher._id.toString() 
        });
        await user.save();
        console.log(`Seeded student: ${s.email} (Password: student123)`);
      } else {
        console.log('Student already exists:', s.email);
      }
    }

    console.log(`\n=== STUDENT ACCOUNTS CREATED ===`);
    console.log(`Assigned to teacher: ${teacher.name} (${teacher.email})`);
    console.log('All students can login immediately with password: student123');
    console.log('\nStudent Login Credentials:');
    students.forEach((s, i) => {
      console.log(`${i + 1}. ${s.email} / student123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding students:', error);
    process.exit(1);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
