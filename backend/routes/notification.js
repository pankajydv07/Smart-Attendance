import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// Create notification (stub for email/SMS)
router.post('/', async (req, res) => {
  const { userId, message, type } = req.body;
  const notification = new Notification({ userId, message, type });
  await notification.save();
  // Here, you would integrate with email/SMS service
  res.status(201).json(notification);
});

// Get notifications for user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const notifications = await Notification.find({ userId });
  res.json(notifications);
});

export default router;
