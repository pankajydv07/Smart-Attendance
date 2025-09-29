import React, { useEffect, useState } from 'react';
import { DashboardHeader, DashboardOverview, StudentManagement, SettingsPanel, NavItem } from '@/components/DashboardShell';
import AttendanceReports from '@/components/AttendanceReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceActive, setAttendanceActive] = useState(false);

  useEffect(() => {
    const teacherId = localStorage.getItem('teacherId');
    if (teacherId) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:5000/api/teacher/students/${teacherId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            alert('Session expired or not authorized');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
            return null as any;
          }
          return res.json();
        })
        .then(data => setStudents(data || []));
    }
  }, []);

  const handleReviewStudent = async (id: string, action: 'accept' | 'reject') => {
    const approved = action === 'accept';
    const res = await fetch(`http://localhost:5000/api/teacher/students/${id}/approve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved }) });
    const updated = await res.json();
    setStudents(prev => prev.map(s => s._id === id ? updated : s));
  };

  const toggleRecognition = async (active: boolean) => {
    const teacherId = localStorage.getItem('teacherId');
    if (!teacherId) return alert('Teacher ID not found');
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/teacher/recognition/${teacherId}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ active }) });
    if (res.status === 401 || res.status === 403) {
      alert('Not authorized to toggle recognition');
      return;
    }
    setAttendanceActive(active);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Teacher Dashboard" subtitle="Manage attendance and view reports" onLogout={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); window.location.href = '/'; }} />
      <div className="min-h-screen p-8">
        <div className="w-full">
          <div className="mb-6">
            {/* Header actions (left blank header area) */}
            <div className="flex items-center justify-between">
              <div />
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-3 items-center">
                <button className={`px-6 py-2 rounded-md shadow-sm ${activeTab === 'dashboard' ? 'bg-primary text-primary-foreground' : 'bg-white border'}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                <button className={`px-6 py-2 rounded-md shadow-sm ${activeTab === 'reports' ? 'bg-primary text-primary-foreground' : 'bg-white border'}`} onClick={() => setActiveTab('reports')}>Reports</button>
                <button className={`px-6 py-2 rounded-md shadow-sm ${activeTab === 'students' ? 'bg-primary text-primary-foreground' : 'bg-white border'}`} onClick={() => setActiveTab('students')}>Students</button>
                <button className={`px-6 py-2 rounded-md shadow-sm ${activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'bg-white border'}`} onClick={() => setActiveTab('settings')}>Settings</button>
              </div>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div>
              {/* Stats row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="dashboard-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                        <p className="text-2xl font-bold">156</p>
                      </div>
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">👥</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="dashboard-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Present Today</p>
                        <p className="text-2xl font-bold">142</p>
                      </div>
                      <div className="p-2 rounded-lg bg-success/10 text-success">✔️</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="dashboard-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Absent Today</p>
                        <p className="text-2xl font-bold">14</p>
                      </div>
                      <div className="p-2 rounded-lg bg-warning/10 text-warning">⏰</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="dashboard-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                        <p className="text-2xl font-bold">91%</p>
                      </div>
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">📊</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Two-column: Today's Summary | Attendance Control */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <Card className="dashboard-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">Today's Summary</CardTitle>
                    <div className="text-sm text-muted-foreground">Current attendance overview</div>
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
                      <Button variant="outline" className="w-full mt-2" onClick={() => setActiveTab('reports')}>View Detailed Report</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="dashboard-card">
                  <CardHeader>
                    <CardTitle>Attendance Control</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-4">
                      <Button onClick={async () => { await toggleRecognition(true); alert('Recognition enabled'); }} >Start Attendance</Button>
                      <Button onClick={async () => { await toggleRecognition(false); alert('Recognition disabled'); }} variant="outline">Stop Attendance</Button>
                    </div>
                    <div className="mb-4">Use these buttons to enable or disable face-capture for students.</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'reports' && <AttendanceReports />}
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
};

// lightweight icon placeholders to avoid importing lucide in this file
const HomeIcon = () => <span className="inline-block w-4 h-4 bg-muted rounded" />;
const BarChart3Icon = () => <span className="inline-block w-4 h-4 bg-muted rounded" />;
const UsersIcon = () => <span className="inline-block w-4 h-4 bg-muted rounded" />;
const SettingsIcon = () => <span className="inline-block w-4 h-4 bg-muted rounded" />;

export default TeacherDashboard;
