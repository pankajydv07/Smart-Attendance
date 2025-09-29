# Smart Attendance System - Login Credentials

## 🔧 System Status
- ✅ Password field added to teacher registration (now visible in step 1)
- ✅ Auto-login after student registration implemented
- ✅ Admin login fixed to use backend API
- ✅ Sample data created for testing
- ✅ Backend deployed to: https://smart-attendance-qk5b.onrender.com
- ✅ Frontend updated to use deployed backend

---

## 👨‍💼 Admin Account
**Email:** admin@smartattend.com  
**Password:** Admin123!  
**Access:** http://localhost:8080/admin/login

---

## 👩‍🏫 Teacher Accounts

### 1. Approved Teacher (Ready to Use)
**Email:** ravi.kumar@smartattend.com  
**Password:** teacher123  
**Status:** ✅ Approved - Can login immediately  
**Access:** http://localhost:8080/ (Teacher Login)

### 2. Pending Teacher (Needs Admin Approval)  
**Email:** anita.sharma@smartattend.com  
**Password:** teacher123  
**Status:** ⏳ Pending - Needs admin approval first  

---

## 👨‍🎓 Student Accounts (All Auto-Approved)
**Assigned to:** Ravi Kumar (ravi.kumar@smartattend.com)  
**Password for all:** student123  
**Access:** http://localhost:8080/ (Student Login)

1. **rahul.sharma@smartattend.com**
2. **priya.patel@smartattend.com**  
3. **arjun.kumar@smartattend.com**
4. **sneha.singh@smartattend.com**
5. **kavita.joshi@smartattend.com**

---

## 🚀 Quick Test Workflow

### 1. Test Admin Login
- Go to: http://localhost:8080/admin/login
- Login with admin credentials
- Approve pending teacher (anita.sharma@smartattend.com)

### 2. Test Teacher Registration  
- Go to: http://localhost:8080/registration
- Select "Teacher Registration"
- Fill form (password field now visible in Personal Information step)
- Submit and check admin dashboard for approval

### 3. Test Student Registration
- Go to: http://localhost:8080/registration  
- Select "Student Registration"
- Fill form and submit
- Should auto-login after registration

### 4. Test Teacher Dashboard
- Login as: ravi.kumar@smartattend.com / teacher123
- Enable face recognition for students
- View assigned students

### 5. Test Student Dashboard  
- Login as any student (e.g., rahul.sharma@smartattend.com / student123)
- Check if attendance capture is enabled
- Try capturing attendance (requires teacher to enable recognition first)

---

## 🔧 Backend API Endpoints
- **Health Check:** https://smart-attendance-qk5b.onrender.com/health
- **API Base:** https://smart-attendance-qk5b.onrender.com/api/
- **Auth:** /auth/login, /auth/register
- **Admin:** /admin/teachers, /admin/teachers/:id/approve  
- **Teacher:** /teacher/students/:teacherId, /teacher/recognition/:teacherId
- **Student:** /student/attendance/:studentId, /student/capture-attendance

---

## 📱 Features Working
- ✅ Role-based registration (Admin/Teacher/Student)
- ✅ Auto-login for students after registration
- ✅ Admin approval workflow for teachers
- ✅ Face recognition toggle by teachers
- ✅ Location-based attendance validation
- ✅ Real-time attendance reporting
- ✅ JWT-based secure authentication
- ✅ MongoDB integration with proper error handling

---

## 🐛 Troubleshooting
- If MongoDB connection fails, ensure local MongoDB is running or update MONGO_URI in .env
- If frontend can't connect to backend, ensure backend is running on port 5000
- If login fails, check browser console for errors and verify credentials above