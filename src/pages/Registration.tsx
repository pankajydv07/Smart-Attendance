import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Upload, User, GraduationCap, Users, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type UserRole = 'student' | 'teacher' | '';

interface StudentData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  
  // Academic Info
  grade: string;
  section: string;
  rollNumber: string;
  previousSchool: string;
  teacherId: string; // Added teacher ID for student registration
  
  // Parent/Guardian Info
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  relationship: string;
  address: string;
  // Auth
  password: string;
}

interface TeacherData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  
  // Professional Info
  employeeId: string;
  subjects: string[];
  classes: string[];
  qualification: string;
  experience: string;
  
  // Contact Info
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  // Auth
  password: string;
}

const Registration = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [studentData, setStudentData] = useState<StudentData>({
  firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: '',
  grade: '', section: '', rollNumber: '', previousSchool: '', teacherId: '',
  parentName: '', parentEmail: '', parentPhone: '', relationship: '', address: ''
  , password: ''
  });
  const [teacherData, setTeacherData] = useState<TeacherData>({
    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: '',
    employeeId: '', subjects: [], classes: [], qualification: '', experience: '',
    emergencyContact: '', emergencyPhone: '', address: ''
    , password: ''
  });
  
  const { toast } = useToast();

  const getTotalSteps = () => selectedRole === 'student' ? 4 : selectedRole === 'teacher' ? 4 : 1;
  const getProgress = () => (currentStep / getTotalSteps()) * 100;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep(1);
  };

  const nextStep = () => {
    // Validate current step before moving forward
    const validation = validateCurrentStep();
    if (!validation.ok) {
      toast({ title: 'Validation', description: validation.message, variant: 'destructive' });
      return;
    }
    if (currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const validateCurrentStep = (): { ok: boolean; message?: string } => {
    if (selectedRole === 'student') {
      if (currentStep === 1) {
        // Personal info required: firstName, lastName, email, phone, dateOfBirth, gender, password
        if (!studentData.firstName) return { ok: false, message: 'First name is required' };
        if (!studentData.lastName) return { ok: false, message: 'Last name is required' };
        if (!studentData.email) return { ok: false, message: 'Email is required' };
        if (!studentData.phone) return { ok: false, message: 'Phone number is required' };
        if (!studentData.dateOfBirth) return { ok: false, message: 'Date of birth is required' };
        if (!studentData.gender) return { ok: false, message: 'Gender is required' };
        if (!studentData.password || studentData.password.length < 6) return { ok: false, message: 'Password is required (min 6 chars)' };
      }
      if (currentStep === 2) {
        if (!studentData.grade) return { ok: false, message: 'Grade is required' };
        if (!studentData.section) return { ok: false, message: 'Section is required' };
        if (!studentData.rollNumber) return { ok: false, message: 'Roll number is required' };
      }
      if (currentStep === 3) {
        if (!studentData.parentName) return { ok: false, message: 'Parent/Guardian name is required' };
        if (!studentData.parentEmail) return { ok: false, message: 'Parent email is required' };
        if (!studentData.parentPhone) return { ok: false, message: 'Parent phone is required' };
        if (!studentData.relationship) return { ok: false, message: 'Relationship is required' };
        if (!studentData.address) return { ok: false, message: 'Address is required' };
      }
    } else if (selectedRole === 'teacher') {
      if (currentStep === 1) {
        if (!teacherData.firstName) return { ok: false, message: 'First name is required' };
        if (!teacherData.lastName) return { ok: false, message: 'Last name is required' };
        if (!teacherData.email) return { ok: false, message: 'Email is required' };
        if (!teacherData.phone) return { ok: false, message: 'Phone number is required' };
        if (!teacherData.dateOfBirth) return { ok: false, message: 'Date of birth is required' };
        if (!teacherData.gender) return { ok: false, message: 'Gender is required' };
        if (!teacherData.password || teacherData.password.length < 6) return { ok: false, message: 'Password is required (min 6 chars)' };
      }
      if (currentStep === 2) {
        if (!teacherData.employeeId) return { ok: false, message: 'Employee ID is required' };
        if (!teacherData.qualification) return { ok: false, message: 'Qualification is required' };
        if (!teacherData.experience) return { ok: false, message: 'Experience is required' };
      }
      // Documents step can be optional; skip strict validation for step 3
    }
    return { ok: true };
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    let payload;
    if (selectedRole === 'teacher') {
      if (!teacherData.password || teacherData.password.length < 6) {
        toast({ title: 'Password required', description: 'Please provide a password (min 6 characters) for teacher account.', variant: 'destructive' });
        return;
      }
      payload = {
        name: `${teacherData.firstName} ${teacherData.lastName}`,
        email: teacherData.email,
        password: teacherData.password,
        role: 'teacher',
      };
    } else if (selectedRole === 'student') {
      // Require student to provide a password
      if (!studentData.password || studentData.password.length < 6) {
        toast({ title: 'Password required', description: 'Please provide a password (min 6 characters) for student account.', variant: 'destructive' });
        return;
      }
      payload = {
        name: `${studentData.firstName} ${studentData.lastName}`,
        email: studentData.email,
        password: studentData.password,
        role: 'student',
        teacherId: studentData.teacherId,
      };
    } else {
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast({
          title: "Registration Submitted!",
          description: result.message || "Your registration is pending approval.",
        });
        
        // Auto-login if registration includes token (for approved users like students)
        if (result.autoLogin && result.token && result.user) {
          // Store authentication data
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('userRole', result.user.role);
          
          if (result.user.role === 'teacher' && result.user._id) {
            localStorage.setItem('teacherId', result.user._id);
          }
          if (result.user.role === 'student' && result.user._id) {
            localStorage.setItem('studentId', result.user._id);
          }
          
          // Navigate to appropriate dashboard after a short delay to show toast
          setTimeout(() => {
            if (result.user.role === 'student') {
              navigate('/student');
            } else if (result.user.role === 'teacher') {
              navigate('/teacher');
            }
          }, 1000);
        } else {
          // Reset form if not auto-logging in
          setSelectedRole('');
          setCurrentStep(1);
        }
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Could not connect to server.",
        variant: "destructive",
      });
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
        <div className="container mx-auto max-w-4xl pt-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to SmartAttend</h1>
            {/* Removed helper text for minimal look */}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => handleRoleSelect('student')}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Student Registration</CardTitle>
                {/* Removed helper text for minimal look */}
              </CardHeader>
              <CardContent className="text-center">
                <Button className="btn-gradient w-full">Register as Student</Button>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => handleRoleSelect('teacher')}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Teacher Registration</CardTitle>
                {/* Removed helper text for minimal look */}
              </CardHeader>
              <CardContent className="text-center">
                <Button className="btn-gradient w-full">Register as Teacher</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="container mx-auto max-w-2xl pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedRole('')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Role Selection
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {selectedRole === 'student' ? 'Student Registration' : 'Teacher Registration'}
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={getProgress()} className="w-full h-2" />
        </div>

        {/* Form Content */}
        <div className="mb-8">
          {selectedRole === 'student' && currentStep === 1 && (
            <StudentPersonalInfo data={studentData} setData={setStudentData} />
          )}
          {selectedRole === 'student' && currentStep === 2 && (
            <StudentAcademicInfo data={studentData} setData={setStudentData} />
          )}
          {selectedRole === 'student' && currentStep === 3 && (
            <StudentParentInfo data={studentData} setData={setStudentData} />
          )}
          {selectedRole === 'student' && currentStep === 4 && (
            <StudentReview data={studentData} />
          )}
          {selectedRole === 'teacher' && currentStep === 1 && (
            <TeacherPersonalInfo data={teacherData} setData={setTeacherData} />
          )}
          {selectedRole === 'teacher' && currentStep === 2 && (
            <TeacherProfessionalInfo data={teacherData} setData={setTeacherData} />
          )}
          {selectedRole === 'teacher' && currentStep === 3 && (
            <TeacherDocuments />
          )}
          {selectedRole === 'teacher' && currentStep === 4 && (
            <TeacherReview data={teacherData} />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-4">
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
          )}
          <div className="flex-1"></div>
          {currentStep < getTotalSteps() && (
            <Button onClick={nextStep}>
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          {currentStep === getTotalSteps() && (
            <Button onClick={handleSubmit} className="btn-gradient">
              Submit Registration
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Student Form Components
const StudentPersonalInfo = ({ data, setData }: { data: StudentData, setData: React.Dispatch<React.SetStateAction<StudentData>> }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <User className="h-12 w-12 mx-auto text-primary mb-4" />
      <h2 className="text-2xl font-semibold">Personal Information</h2>
      {/* Removed helper text for minimal look */}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName">First Name *</Label>
        <Input 
          id="firstName"
          value={data.firstName}
          onChange={(e) => setData({...data, firstName: e.target.value})}
          placeholder="Enter your first name"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name *</Label>
        <Input 
          id="lastName"
          value={data.lastName}
          onChange={(e) => setData({...data, lastName: e.target.value})}
          placeholder="Enter your last name"
        />
      </div>
    </div>

    <div>
      <Label htmlFor="email">Email Address *</Label>
      <Input 
        id="email"
        type="email"
        value={data.email}
        onChange={(e) => setData({...data, email: e.target.value})}
        placeholder="Enter your email address"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input 
          id="phone"
          value={data.phone}
          onChange={(e) => setData({...data, phone: e.target.value})}
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <Label htmlFor="dob">Date of Birth *</Label>
        <Input 
          id="dob"
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => setData({...data, dateOfBirth: e.target.value})}
        />
      </div>
    </div>

    <div>
      <Label htmlFor="password">Password *</Label>
      <Input
        id="password"
        type="password"
        value={data.password}
        onChange={(e) => setData({...data, password: e.target.value})}
        placeholder="Choose a secure password"
      />
    </div>

    <div>
      <Label htmlFor="password">Password *</Label>
      <Input
        id="password"
        type="password"
        value={data.password}
        onChange={(e) => setData({...data, password: e.target.value})}
        placeholder="Choose a secure password"
      />
    </div>

    <div>
      <Label htmlFor="gender">Gender *</Label>
      <Select value={data.gender} onValueChange={(value) => setData({...data, gender: value})}>
        <SelectTrigger>
          <SelectValue placeholder="Select your gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const StudentAcademicInfo = ({ data, setData }: { data: StudentData, setData: React.Dispatch<React.SetStateAction<StudentData>> }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <GraduationCap className="h-12 w-12 mx-auto text-primary mb-4" />
      <h2 className="text-2xl font-semibold">Academic Information</h2>
      <p className="text-muted-foreground">Your class and academic details</p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="grade">Grade/Class *</Label>
        <Select value={data.grade} onValueChange={(value) => setData({...data, grade: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select your grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Grade 1</SelectItem>
            <SelectItem value="2">Grade 2</SelectItem>
            <SelectItem value="3">Grade 3</SelectItem>
            <SelectItem value="4">Grade 4</SelectItem>
            <SelectItem value="5">Grade 5</SelectItem>
            <SelectItem value="6">Grade 6</SelectItem>
            <SelectItem value="7">Grade 7</SelectItem>
            <SelectItem value="8">Grade 8</SelectItem>
            <SelectItem value="9">Grade 9</SelectItem>
            <SelectItem value="10">Grade 10</SelectItem>
            <SelectItem value="11">Grade 11</SelectItem>
            <SelectItem value="12">Grade 12</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="section">Section *</Label>
        <Select value={data.section} onValueChange={(value) => setData({...data, section: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Section A</SelectItem>
            <SelectItem value="B">Section B</SelectItem>
            <SelectItem value="C">Section C</SelectItem>
            <SelectItem value="D">Section D</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div>
      <Label htmlFor="rollNumber">Roll Number *</Label>
      <Input 
        id="rollNumber"
        value={data.rollNumber}
        onChange={(e) => setData({...data, rollNumber: e.target.value})}
        placeholder="Enter your roll number"
      />
    </div>

    <div>
      <Label htmlFor="previousSchool">Previous School (if any)</Label>
      <Input 
        id="previousSchool"
        value={data.previousSchool}
        onChange={(e) => setData({...data, previousSchool: e.target.value})}
        placeholder="Enter previous school name"
      />
    </div>
  </div>
);

const StudentParentInfo = ({ data, setData }: { data: StudentData, setData: React.Dispatch<React.SetStateAction<StudentData>> }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <Users className="h-12 w-12 mx-auto text-primary mb-4" />
      <h2 className="text-2xl font-semibold">Parent/Guardian Information</h2>
      <p className="text-muted-foreground">Contact details for your parent or guardian</p>
    </div>

    <div>
      <Label htmlFor="parentName">Parent/Guardian Name *</Label>
      <Input 
        id="parentName"
        value={data.parentName}
        onChange={(e) => setData({...data, parentName: e.target.value})}
        placeholder="Enter parent/guardian full name"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="parentEmail">Parent Email *</Label>
        <Input 
          id="parentEmail"
          type="email"
          value={data.parentEmail}
          onChange={(e) => setData({...data, parentEmail: e.target.value})}
          placeholder="parent@email.com"
        />
      </div>
      <div>
        <Label htmlFor="parentPhone">Parent Phone *</Label>
        <Input 
          id="parentPhone"
          value={data.parentPhone}
          onChange={(e) => setData({...data, parentPhone: e.target.value})}
          placeholder="Parent phone number"
        />
      </div>
    </div>

    <div>
      <Label htmlFor="relationship">Relationship *</Label>
      <Select value={data.relationship} onValueChange={(value) => setData({...data, relationship: value})}>
        <SelectTrigger>
          <SelectValue placeholder="Select relationship" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="father">Father</SelectItem>
          <SelectItem value="mother">Mother</SelectItem>
          <SelectItem value="guardian">Guardian</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="address">Home Address *</Label>
      <Textarea 
        id="address"
        value={data.address}
        onChange={(e) => setData({...data, address: e.target.value})}
        placeholder="Enter complete home address"
        rows={3}
      />
    </div>
  </div>
);

const StudentReview = ({ data }: { data: StudentData }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <CheckCircle className="h-12 w-12 mx-auto text-primary mb-4" />
      <h2 className="text-2xl font-semibold">Review Your Information</h2>
      <p className="text-muted-foreground">Please review all details before submitting</p>
    </div>

    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Personal Information</h3>
        <p><strong>Name:</strong> {data.firstName} {data.lastName}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Phone:</strong> {data.phone}</p>
        <p><strong>Date of Birth:</strong> {data.dateOfBirth}</p>
        <p><strong>Gender:</strong> {data.gender}</p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Academic Information</h3>
        <p><strong>Grade:</strong> {data.grade}</p>
        <p><strong>Section:</strong> {data.section}</p>
        <p><strong>Roll Number:</strong> {data.rollNumber}</p>
        {data.previousSchool && <p><strong>Previous School:</strong> {data.previousSchool}</p>}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Parent/Guardian Information</h3>
        <p><strong>Name:</strong> {data.parentName}</p>
        <p><strong>Email:</strong> {data.parentEmail}</p>
        <p><strong>Phone:</strong> {data.parentPhone}</p>
        <p><strong>Relationship:</strong> {data.relationship}</p>
        <p><strong>Address:</strong> {data.address}</p>
      </div>
    </div>
  </div>
);

// Teacher Form Components
const TeacherPersonalInfo = ({ data, setData }: { data: TeacherData, setData: React.Dispatch<React.SetStateAction<TeacherData>> }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <User className="h-12 w-12 mx-auto text-primary mb-4" />
      <h2 className="text-2xl font-semibold">Personal Information</h2>
      <p className="text-muted-foreground">Your basic information</p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName">First Name *</Label>
        <Input 
          id="firstName"
          value={data.firstName}
          onChange={(e) => setData({...data, firstName: e.target.value})}
          placeholder="Enter your first name"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name *</Label>
        <Input 
          id="lastName"
          value={data.lastName}
          onChange={(e) => setData({...data, lastName: e.target.value})}
          placeholder="Enter your last name"
        />
      </div>
    </div>

    <div>
      <Label htmlFor="email">Email Address *</Label>
      <Input 
        id="email"
        type="email"
        value={data.email}
        onChange={(e) => setData({...data, email: e.target.value})}
        placeholder="Enter your email address"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input 
          id="phone"
          value={data.phone}
          onChange={(e) => setData({...data, phone: e.target.value})}
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <Label htmlFor="dob">Date of Birth *</Label>
        <Input 
          id="dob"
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => setData({...data, dateOfBirth: e.target.value})}
        />
      </div>
    </div>

    <div>
      <Label htmlFor="gender">Gender *</Label>
      <Select value={data.gender} onValueChange={(value) => setData({...data, gender: value})}>
        <SelectTrigger>
          <SelectValue placeholder="Select your gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="address">Address *</Label>
      <Textarea 
        id="address"
        value={data.address}
        onChange={(e) => setData({...data, address: e.target.value})}
        placeholder="Enter your complete address"
        rows={3}
      />
    </div>

    <div>
      <Label htmlFor="teacherPassword">Account Password *</Label>
      <Input 
        id="teacherPassword"
        type="password"
        value={data.password}
        onChange={(e) => setData({...data, password: e.target.value})}
        placeholder="Create a secure password (minimum 6 characters)"
      />
      <p className="text-xs text-muted-foreground mt-1">
        This password will be used to login to your teacher account after admin approval.
      </p>
    </div>
  </div>
);

const TeacherProfessionalInfo = ({ data, setData }: { data: TeacherData, setData: React.Dispatch<React.SetStateAction<TeacherData>> }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <GraduationCap className="h-12 w-12 mx-auto text-primary mb-4" />
      <h2 className="text-2xl font-semibold">Professional Information</h2>
      <p className="text-muted-foreground">Your teaching credentials and subjects</p>
    </div>

    <div>
      <Label htmlFor="employeeId">Employee ID *</Label>
      <Input 
        id="employeeId"
        value={data.employeeId}
        onChange={(e) => setData({...data, employeeId: e.target.value})}
        placeholder="Enter your employee ID"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="qualification">Highest Qualification *</Label>
        <Input 
          id="qualification"
          value={data.qualification}
          onChange={(e) => setData({...data, qualification: e.target.value})}
          placeholder="e.g., B.Ed, M.A., etc."
        />
      </div>
      <div>
        <Label htmlFor="experience">Years of Experience *</Label>
        <Input 
          id="experience"
          value={data.experience}
          onChange={(e) => setData({...data, experience: e.target.value})}
          placeholder="Enter years of experience"
        />
      </div>
    </div>

    <div>
      <Label htmlFor="subjects">Subjects You Teach</Label>
      <Textarea 
        id="subjects"
        value={data.subjects.join(', ')}
        onChange={(e) => setData({...data, subjects: e.target.value.split(', ')})}
        placeholder="Enter subjects separated by commas (e.g., Mathematics, Physics, Chemistry)"
        rows={2}
      />
    </div>

    <div>
      <Label htmlFor="classes">Classes You Handle</Label>
      <Textarea 
        id="classes"
        value={data.classes.join(', ')}
        onChange={(e) => setData({...data, classes: e.target.value.split(', ')})}
        placeholder="Enter classes separated by commas (e.g., 9A, 10B, 11C)"
        rows={2}
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
        <Input 
          id="emergencyContact"
          value={data.emergencyContact}
          onChange={(e) => setData({...data, emergencyContact: e.target.value})}
          placeholder="Emergency contact person"
        />
      </div>
      <div>
        <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
        <Input 
          id="emergencyPhone"
          value={data.emergencyPhone}
          onChange={(e) => setData({...data, emergencyPhone: e.target.value})}
          placeholder="Emergency contact number"
        />
      </div>
    </div>
  </div>
);

const TeacherDocuments = () => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <Upload className="h-12 w-12 mx-auto text-primary mb-4" />
      <h2 className="text-2xl font-semibold">Document Upload</h2>
      <p className="text-muted-foreground">Upload your qualification certificates and ID proof</p>
    </div>

    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">ID Proof (Aadhar/Passport/License)</p>
        <Button variant="outline">Choose File</Button>
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">Highest Qualification Certificate</p>
        <Button variant="outline">Choose File</Button>
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">Teaching Certificate (if any)</p>
        <Button variant="outline">Choose File</Button>
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">Experience Certificate (if any)</p>
        <Button variant="outline">Choose File</Button>
      </div>
    </div>

    <div className="bg-muted/50 rounded-lg p-4">
      <p className="text-sm text-muted-foreground">
        <strong>Note:</strong> All documents will be verified by the administration. 
        Please ensure all uploaded documents are clear and valid.
      </p>
    </div>
  </div>
);

const TeacherReview = ({ data }: { data: TeacherData }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <CheckCircle className="h-12 w-12 mx-auto text-primary mb-4" />
      <h2 className="text-2xl font-semibold">Review Your Information</h2>
      <p className="text-muted-foreground">Please review all details before submitting</p>
    </div>

    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Personal Information</h3>
        <p><strong>Name:</strong> {data.firstName} {data.lastName}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Phone:</strong> {data.phone}</p>
        <p><strong>Date of Birth:</strong> {data.dateOfBirth}</p>
        <p><strong>Gender:</strong> {data.gender}</p>
        <p><strong>Address:</strong> {data.address}</p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Professional Information</h3>
        <p><strong>Employee ID:</strong> {data.employeeId}</p>
        <p><strong>Qualification:</strong> {data.qualification}</p>
        <p><strong>Experience:</strong> {data.experience} years</p>
        <p><strong>Subjects:</strong> {data.subjects.join(', ')}</p>
        <p><strong>Classes:</strong> {data.classes.join(', ')}</p>
        <p><strong>Emergency Contact:</strong> {data.emergencyContact} ({data.emergencyPhone})</p>
      </div>
    </div>
  </div>
);

export default Registration;