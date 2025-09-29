import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all teacher registrations
router.get('/teachers', async (req, res) => {
  const teachers = await User.find({ role: 'teacher' });
  res.json(teachers);
});

// Approve or decline teacher
router.post('/teachers/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;

  if (approved) {
    const teacher = await User.findByIdAndUpdate(id, { approved: true }, { new: true });
    console.log(`Teacher ${teacher.email} approved by admin.`);
    return res.json({ teacher });
  } else {
    const teacher = await User.findByIdAndUpdate(id, { approved: false }, { new: true });
    // Optionally notify rejection
    console.log(`Teacher ${teacher.email} was declined by admin.`);
    return res.json({ teacher });
  }
});

export default router;
