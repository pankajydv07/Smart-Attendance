import express from 'express';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all student registrations for this teacher
router.get('/students/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const students = await User.find({ role: 'student', teacherId });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve or reject student
router.post('/students/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    const student = await User.findByIdAndUpdate(id, { approved }, { new: true });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark attendance
router.post('/attendance', async (req, res) => {
  try {
    const { studentId, date, status, location } = req.body;
    const attendance = new Attendance({ studentId, date, status, location });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recognition active state for a teacher
// Public read is allowed (students need to know if teacher enabled recognition) — but we still accept anonymous reads.
router.get('/recognition/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await User.findById(teacherId).select('recognitionActive');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ recognitionActive: teacher.recognitionActive });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Set recognition active state for a teacher (start/stop)
// Only authenticated teachers or admins may toggle their recognition flag
router.post('/recognition/:teacherId', auth, async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { active } = req.body;
    // ensure the requester is the teacher themself or an admin
    if (req.user.role !== 'admin' && req.user.id !== teacherId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const teacher = await User.findByIdAndUpdate(teacherId, { recognitionActive: !!active }, { new: true }).select('recognitionActive');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ recognitionActive: teacher.recognitionActive });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

