import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Using local dashboard components declared in this file (DashboardHeader, DashboardOverview, StudentManagement, SettingsPanel, NavItem)
// so we intentionally do not import them from '@/components/DashboardShell' to avoid name collisions.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import AttendanceReports from "@/components/AttendanceReports";
import heroImage from "@/assets/hero-education.jpg";
import { 
  GraduationCap, 
  Users, 
  Camera, 
  BarChart3, 
  Shield, 
  Smartphone,
  CheckCircle,
  Clock,
  UserCheck,
  Settings,
  FileText,
  Home,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink
} from "lucide-react";
  import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  
  const handleContactClick = (type: 'email' | 'phone') => {
    if (type === 'email') {
      window.open('mailto:varshithn33@gmail.com', '_blank');
    } else {
      window.open('tel:+919948360105', '_blank');
    }
  };

  const handleLogin = (role: 'teacher' | 'student', user?: any, token?: string) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    // persist authentication so refresh keeps the dashboard
    if (user) localStorage.setItem('user', JSON.stringify(user));
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    if (role === 'teacher' && user && user._id) localStorage.setItem('teacherId', user._id);
    if (role === 'student' && user && user._id) localStorage.setItem('studentId', user._id);
    // navigate to standalone dashboard route
    navigate(role === 'teacher' ? '/teacher' : '/student');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setActiveTab('dashboard');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('teacherId');
    localStorage.removeItem('studentId');
    navigate('/');
  };

  // On mount, restore auth state from localStorage but do not auto-navigate.
  useEffect(() => {
    const role = localStorage.getItem('userRole') as 'teacher' | 'student' | null;
    if (role) {
      setUserRole(role);
      setIsLoggedIn(true);
      // do not auto-navigate; keep landing page as default
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Note: standalone dashboard routes (/teacher, /student) now render dashboards.
  // The root landing page always renders the public landing and login UI.

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      {/* Header */}
      <DashboardHeader 
        title="SmartAttend" 
        subtitle="" 
        onLogout={() => handleLogout()} 
      />

      {/* Hero Section with Background Image */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Rural students using modern attendance technology" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Smart Attendance for 
              <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent block md:inline"> Rural Schools</span>
            </h1>
              {/* Removed hero section paragraph for simplicity */}
            
            {/* Key Benefits */}
            {/* Removed key benefits helper texts for simplicity */}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard 
              icon={<Camera className="h-8 w-8" />}
              title="AI Face Recognition"
              description=""
            />
            <FeatureCard 
              icon={<Smartphone className="h-8 w-8" />}
              title="Rural-First Design"
              description=""
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8" />}
              title="Smart Analytics"
              description=""
            />
          </div>

          {/* Login Section */}
          <div className="max-w-lg mx-auto">
            <Card className="dashboard-card backdrop-blur-sm bg-card/90">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Access Your Dashboard</CardTitle>
                {/* Removed helper text under dashboard title for simplicity */}
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="teacher" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="teacher" className="text-sm font-medium">Teacher</TabsTrigger>
                    <TabsTrigger value="student" className="text-sm font-medium">Student</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="teacher" className="space-y-4">
                    <LoginForm role="teacher" onLogin={handleLogin} />
                  </TabsContent>
                  
                  <TabsContent value="student" className="space-y-4">
                    <LoginForm role="student" onLogin={handleLogin} />
                  </TabsContent>
                </Tabs>
                
                <div className="text-center mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Don't have an account yet?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/registration'}
                    className="w-full"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Register New Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Need help with implementation or have questions about the system? Contact our development team.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ContactCard 
              icon={<Mail className="h-6 w-6" />}
              title="Email Support"
              content="varshithn33@gmail.com"
              description="Get technical support and implementation guidance"
              onClick={() => handleContactClick('email')}
            />
            <ContactCard 
              icon={<Phone className="h-6 w-6" />}
              title="Phone Support"
              content="+91 99483 60105"
              description="Direct line for urgent technical assistance"
              onClick={() => handleContactClick('phone')}
            />
            <ContactCard 
              icon={<GraduationCap className="h-6 w-6" />}
              title="Developer"
              content="Binary Bots"
              description="Lead developer and technical architect"
              onClick={() => {}}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-primary to-success rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">SmartAttend</h3>
                  <p className="text-sm text-muted-foreground">Rural School Attendance System</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Revolutionary AI-powered attendance system designed specifically for rural schools. 
                Bringing modern technology to remote educational institutions with offline-first capabilities.
              </p>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleContactClick('email')}
                  className="hover:bg-primary/10"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://github.com', '_blank')}
                  className="hover:bg-primary/10"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#login" className="hover:text-primary transition-colors">Login</a></li>
                <li><a href="/registration" className="hover:text-primary transition-colors">Registration</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#support" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact Info</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>varshithn33@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+91 99483 60105</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Binary Bots</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 SmartAttend. Developed by Binary Bots. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <Card className="dashboard-card text-center p-6 hover:shadow-lg transition-shadow">
    <div className="flex justify-center mb-4">
      <div className="p-3 bg-gradient-to-r from-primary/10 to-success/10 rounded-lg text-primary">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </Card>
);

const ContactCard = ({ icon, title, content, description, onClick }: { 
  icon: React.ReactNode; 
  title: string; 
  content: string; 
  description: string;
  onClick: () => void;
}) => (
  <Card className="dashboard-card text-center p-6 hover:shadow-lg transition-all cursor-pointer group" onClick={onClick}>
    <div className="flex justify-center mb-4">
      <div className="p-3 bg-gradient-to-r from-primary/10 to-success/10 rounded-lg text-primary group-hover:from-primary/20 group-hover:to-success/20 transition-colors">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-foreground font-medium mb-2">{content}</p>
    <p className="text-muted-foreground text-sm">{description}</p>
    {typeof onClick === 'function' && onClick.name !== '' && (
      <ExternalLink className="h-4 w-4 text-muted-foreground mx-auto mt-3 group-hover:text-primary transition-colors" />
    )}
  </Card>
);

const LoginForm = ({ role, onLogin }: { 
  role: 'teacher' | 'student';
  onLogin: (role: 'teacher' | 'student', user?: any, token?: string) => void;
}) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
    const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://smart-attendance-qk5b.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: id,
          password,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast({
          title: 'Login Successful',
          description: `Welcome, ${result.user.name}`,
        });
        onLogin(role, result.user, result.token);
      } else {
        toast({
          title: 'Login Failed',
          description: result.message || 'Invalid credentials',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Network Error',
        description: 'Could not connect to server.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${role}-id`}>
          {role === 'teacher' ? 'Teacher Email' : 'Student Email'}
        </Label>
        <Input
          id={`${role}-id`}
          placeholder={`Enter your ${role} email`}
          value={id}
          onChange={e => setId(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${role}-password`}>Password</Label>
        <Input
          id={`${role}-password`}
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <Button
        onClick={handleLogin}
        className="w-full btn-gradient"
        size="lg"
        disabled={loading}
      >
        <Shield className="mr-2 h-4 w-4" />
        {loading ? 'Signing In...' : `Sign In as ${role === 'teacher' ? 'Teacher' : 'Student'}`}
      </Button>
    </div>
  );
};

const TeacherDashboard = ({ 
  activeTab, 
  setActiveTab, 
  onLogout 
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void; 
  onLogout: () => void; 
}) => (
  <div className="min-h-screen bg-background">
    <DashboardHeader 
      title="Teacher Dashboard" 
      subtitle="Manage attendance and view reports" 
      onLogout={onLogout}
    />
    
    <div className="flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-card border-r border-border min-h-screen p-4">
        <nav className="space-y-2">
          <NavItem 
            icon={<Home />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          {/* Face Recognition removed from teacher dashboard here; control is in TeacherDashboard only */}
          <NavItem 
            icon={<BarChart3 />} 
            label="Reports" 
            active={activeTab === 'reports'} 
            onClick={() => setActiveTab('reports')} 
          />
          <NavItem 
            icon={<Users />} 
            label="Students" 
            active={activeTab === 'students'} 
            onClick={() => setActiveTab('students')} 
          />
          <NavItem 
            icon={<Settings />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'dashboard' && <DashboardOverview setActiveTab={setActiveTab} />}
  {/* recognition tab removed for teachers in this view */}
        {activeTab === 'reports' && <AttendanceReports />}
        {activeTab === 'students' && <StudentManagement />}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  </div>
);

const StudentDashboard = ({ onLogout }: { onLogout: () => void }) => (
  <div className="min-h-screen bg-background">
    <DashboardHeader 
      title="Student Dashboard" 
      subtitle="View your attendance records" 
      onLogout={onLogout}
    />
    
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="This Month" value="22/24" icon={<CheckCircle />} color="success" />
        <StatsCard title="This Week" value="5/5" icon={<UserCheck />} color="primary" />
        <StatsCard title="Overall Rate" value="92%" icon={<BarChart3 />} color="accent" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your attendance record for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "Today", status: "Present", time: "09:15 AM" },
                { date: "Yesterday", status: "Present", time: "09:10 AM" },
                { date: "Dec 18", status: "Present", time: "09:20 AM" },
                { date: "Dec 17", status: "Present", time: "09:05 AM" },
                { date: "Dec 16", status: "Present", time: "09:12 AM" },
              ].map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{record.date}</p>
                    <p className="text-sm text-muted-foreground">{record.time}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === 'Present' ? 'attendance-present' : 'attendance-absent'
                  }`}>
                    {record.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>Your attendance pattern this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Present Days</span>
                <span className="text-2xl font-bold text-success">22</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Absent Days</span>
                <span className="text-2xl font-bold text-destructive">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Days</span>
                <span className="text-2xl font-bold">24</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Attendance Rate</span>
                  <span className="text-sm font-bold">91.7%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-success to-primary h-2 rounded-full" style={{ width: '91.7%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const DashboardHeader = ({ title, subtitle, onLogout }: { title: string; subtitle: string; onLogout: () => void }) => (
  <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gradient-to-r from-primary to-success rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  </header>
);

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  color: string; 
}) => (
  <Card className="dashboard-card">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Navigation Item Component
const NavItem = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void; 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
      active 
        ? 'bg-primary text-primary-foreground' 
        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    }`}
  >
    <div className="h-5 w-5">{icon}</div>
    <span className="font-medium">{label}</span>
  </button>
);

// Dashboard Overview Component
const DashboardOverview = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => (
  <div className="space-y-6">
    <div className="grid lg:grid-cols-4 gap-6">
      <StatsCard title="Total Students" value="156" icon={<Users />} color="primary" />
      <StatsCard title="Present Today" value="142" icon={<CheckCircle />} color="success" />
      <StatsCard title="Absent Today" value="14" icon={<Clock />} color="warning" />
      <StatsCard title="Attendance Rate" value="91%" icon={<BarChart3 />} color="accent" />
    </div>

    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Quick Attendance
          </CardTitle>
          <CardDescription>Start face recognition for attendance marking</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Ready to mark attendance</p>
          <Button 
            className="w-full btn-gradient" 
            size="lg"
            onClick={() => setActiveTab('recognition')}
          >
            Start Face Recognition
          </Button>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Today's Summary
          </CardTitle>
          <CardDescription>Current attendance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Classes Conducted</span>
              <span className="text-2xl font-bold">6</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Attendance</span>
              <span className="text-2xl font-bold text-success">91%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Students Marked</span>
              <span className="text-2xl font-bold">142/156</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setActiveTab('reports')}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Detailed Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Student Management Component
const StudentManagement = () => {
  const handleAddStudent = () => {
    toast({
      title: "Add Student",
      description: "Student registration form will open here.",
    });
  };

  const handleImportCSV = () => {
    toast({
      title: "Import CSV",
      description: "CSV import functionality will be implemented.",
    });
  };

  const handleExportList = () => {
    toast({
      title: "Export Successful",
      description: "Student list has been exported to CSV.",
    });
  };

  return (
  <div className="space-y-6">
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Student Management
        </CardTitle>
        <CardDescription>Manage student profiles and class assignments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 mb-6">
            <Button className="btn-gradient" onClick={handleAddStudent}>
              <Users className="mr-2 h-4 w-4" />
              Add Student
            </Button>
            <Button variant="outline" onClick={handleImportCSV}>
              Import from CSV
            </Button>
            <Button variant="outline" onClick={handleExportList}>
              Export Student List
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { name: "Rahul Sharma", roll: "2024001", class: "10-A", status: "Active", attendance: "91%" },
              { name: "Priya Patel", roll: "2024002", class: "10-A", status: "Active", attendance: "100%" },
              { name: "Arjun Kumar", roll: "2024003", class: "10-A", status: "Active", attendance: "83%" },
              { name: "Sneha Singh", roll: "2024004", class: "10-A", status: "Active", attendance: "96%" },
            ].map((student, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.roll} • Class {student.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{student.attendance}</div>
                  <div className="text-xs text-muted-foreground">{student.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
  );
};

// Settings Panel Component
const SettingsPanel = () => {
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "All system settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>Configure attendance system preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Face Recognition Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="confidence">Recognition Confidence Threshold</Label>
                <Input id="confidence" type="number" defaultValue="85" className="w-20" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-mark">Auto-mark after recognition</Label>
                <input type="checkbox" id="auto-mark" defaultChecked className="rounded" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Attendance Rules</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="late-threshold">Late arrival threshold (minutes)</Label>
                <Input id="late-threshold" type="number" defaultValue="15" className="w-20" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="absent-threshold">Mark absent after (minutes)</Label>
                <Input id="absent-threshold" type="number" defaultValue="30" className="w-20" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Notifications</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="parent-sms">Send SMS to parents</Label>
                <input type="checkbox" id="parent-sms" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="daily-report">Daily report email</Label>
                <input type="checkbox" id="daily-report" defaultChecked className="rounded" />
              </div>
            </div>
          </div>

          <Button className="btn-gradient" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system status and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>System Version:</span>
              <span className="font-medium">SmartAttend v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Last Update:</span>
              <span className="font-medium">Today</span>
            </div>
            <div className="flex justify-between">
              <span>Total Students:</span>
              <span className="font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span>Active Classes:</span>
              <span className="font-medium">6</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;