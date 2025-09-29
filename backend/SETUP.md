# Smart Attendance Backend Setup

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env` if it exists, or ensure `.env` has:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   PORT=5000
   NODE_ENV=development
   ADMIN_EMAIL=admin@smartattend.com
   ADMIN_PASSWORD=Admin123!
   ```

3. **Setup Database**
   ```bash
   # Create admin user
   npm run seed:admin
   
   # Optional: Create sample teachers and students
   npm run seed:teachers
   npm run seed:students
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (student/teacher)
- `POST /api/auth/login` - Login user

### Student
- `GET /api/student/attendance/:studentId` - Get student attendance
- `POST /api/student/capture-attendance` - Capture attendance via selfie

### Teacher  
- `GET /api/teacher/students/:teacherId` - Get assigned students
- `POST /api/teacher/students/:id/approve` - Approve/reject student
- `GET /api/teacher/recognition/:teacherId` - Get face recognition status
- `POST /api/teacher/recognition/:teacherId` - Toggle face recognition

### Admin
- `GET /api/admin/teachers` - Get all teachers
- `POST /api/admin/teachers/:id/approve` - Approve/reject teacher

### Utilities
- `GET /` - API info
- `GET /health` - Health check

## Default Admin Credentials
- Email: admin@smartattend.com
- Password: Admin123!

**Please change these credentials after first login!**

## Development Notes

- The server runs on port 5000 by default
- Face recognition is simulated for development
- Location-based attendance uses simple radius calculation
- JWT tokens expire in 24 hours