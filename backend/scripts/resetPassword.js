import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/smartattend';

async function run() {
  const [,, email, newPassword] = process.argv;
  if (!email || !newPassword) {
    console.error('Usage: node resetPassword.js <email> <newPassword>');
    process.exit(1);
  }

  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    console.error('Password must be at least 6 characters');
    process.exit(1);
  }

  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

  const user = await User.findOne({ email });
  if (!user) {
    console.error('User not found:', email);
    process.exit(1);
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
  console.log(`Password updated for ${email}`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
