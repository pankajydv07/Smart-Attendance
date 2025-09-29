# SmartAttend Backend (MERN)

## Features
- Node.js + Express REST API
- MongoDB models for users, attendance, notifications
- JWT authentication
- Registration, login, approval, attendance, dashboard endpoints
- Notification stubs for email/SMS

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up MongoDB and update `.env` with your URI and JWT secret.
3. Start server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/register` — Register user (teacher/student)
- `POST /api/auth/login` — Login
- `GET /api/admin/teachers` — List teacher registrations
- `POST /api/admin/teachers/:id/approve` — Approve/decline teacher
- `GET /api/teacher/students/:teacherId` — List students for teacher
- `POST /api/teacher/students/:id/approve` — Approve/reject student
- `POST /api/teacher/attendance` — Mark attendance
- `GET /api/student/attendance/:studentId` — Get student attendance
- `POST /api/notification` — Create notification (email/SMS stub)
- `GET /api/notification/:userId` — Get notifications for user

## Next Steps
- Integrate with frontend using fetch/axios
- Add real email/SMS service integration
- Add more validation and error handling
