import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Simple JWT middleware that verifies the token and attaches user info to req.user
export default async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'secretkey';
    const payload = jwt.verify(token, secret);
    // attach minimal user info to request
    req.user = { id: payload.id, role: payload.role };
    // optionally fetch full user if needed
    // req.userDoc = await User.findById(payload.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
