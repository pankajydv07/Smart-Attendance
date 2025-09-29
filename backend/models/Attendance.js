import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
  location: { type: String },
  captureMethod: { type: String, enum: ['manual', 'face_recognition', 'selfie'], default: 'manual' },
  confidence: { type: Number, min: 0, max: 1 }, // For face recognition confidence
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Attendance', attendanceSchema);
