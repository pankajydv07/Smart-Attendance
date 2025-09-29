import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role, teacherId } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    // Require a password for both students and teachers
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password is required and must be at least 6 characters' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Auto-approve students; teachers require admin approval
    const approved = role === 'student' ? true : false;
    const user = new User({ name, email, password: hashedPassword, role, teacherId, approved });
    await user.save();
    
    // Auto-login for approved users (students)
    if (approved) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(201).json({ 
        message: 'Registration successful', 
        token, 
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          approved: user.approved,
          teacherId: user.teacherId
        },
        autoLogin: true 
      });
    } else {
      res.status(201).json({ 
        message: 'Registration successful, pending admin approval',
        autoLogin: false 
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.approved && user.role !== 'admin') return res.status(403).json({ message: 'Account not approved yet' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
