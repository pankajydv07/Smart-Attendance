import express from 'express';
import Attendance from '../models/Attendance.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get attendance for student
router.get('/attendance/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await Attendance.find({ studentId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Capture attendance (selfie-based)
router.post('/capture-attendance', auth, async (req, res) => {
  try {
    const { imageData, location } = req.body;
    const studentId = req.user.id;
    
    // In a real implementation, this would:
    // 1. Process the face image using face recognition
    // 2. Verify it matches the student's registered face
    // 3. Check if teacher has enabled attendance capture
    
    // For now, we'll create a mock attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if student already marked attendance today
    const existingAttendance = await Attendance.findOne({
      studentId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }
    
    const attendance = new Attendance({
      studentId,
      date: new Date(),
      status: 'present',
      location: location || 'Face Recognition',
      captureMethod: 'selfie'
    });
    
    await attendance.save();
    res.status(201).json({ 
      message: 'Attendance captured successfully', 
      attendance 
    });
  } catch (err) {
    console.error('Capture attendance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
