import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  approved: { type: Boolean, default: false },
  // Whether face recognition/attendance is active for this teacher
  recognitionActive: { type: Boolean, default: false },
  teacherId: { type: String }, // For students
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
