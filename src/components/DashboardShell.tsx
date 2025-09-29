import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { GraduationCap, Users, Camera, BarChart3, CheckCircle, Clock, FileText, Settings, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const DashboardHeader = ({ title, subtitle, onLogout }: { title: string; subtitle: string; onLogout: () => void }) => (
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

export const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
      active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    }`}
  >
    <div className="h-5 w-5">{icon}</div>
    <span className="font-medium">{label}</span>
  </button>
);

const StatsCard = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) => (
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

export const DashboardOverview = ({ setActiveTab, hideQuickAttendance = false }: { setActiveTab: (tab: string) => void; hideQuickAttendance?: boolean }) => (
  <div className="space-y-6">
    <div className="grid lg:grid-cols-4 gap-6">
      <StatsCard title="Total Students" value="156" icon={<Users />} color="primary" />
      <StatsCard title="Present Today" value="142" icon={<CheckCircle />} color="success" />
      <StatsCard title="Absent Today" value="14" icon={<Clock />} color="warning" />
      <StatsCard title="Attendance Rate" value="91%" icon={<BarChart3 />} color="accent" />
    </div>

    <div className="grid lg:grid-cols-2 gap-8">
      {!hideQuickAttendance && (
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
          <Button className="w-full btn-gradient" size="lg" onClick={() => setActiveTab('recognition')}>Start Face Recognition</Button>
        </CardContent>
      </Card>
      )}

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
            <Button variant="outline" className="w-full" onClick={() => setActiveTab('reports')}>
              <FileText className="mr-2 h-4 w-4" />
              View Detailed Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const StudentManagement = () => {
  const handleAddStudent = () => toast({ title: 'Add Student', description: 'Student registration form will open here.' });
  const handleImportCSV = () => toast({ title: 'Import CSV', description: 'CSV import functionality will be implemented.' });
  const handleExportList = () => toast({ title: 'Export Successful', description: 'Student list has been exported to CSV.' });

  return (
    <div className="space-y-6">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Student Management</CardTitle>
          <CardDescription>Manage student profiles and class assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 mb-6">
              <Button className="btn-gradient" onClick={handleAddStudent}><Users className="mr-2 h-4 w-4" />Add Student</Button>
              <Button variant="outline" onClick={handleImportCSV}>Import from CSV</Button>
              <Button variant="outline" onClick={handleExportList}>Export Student List</Button>
            </div>
            <div className="space-y-3">
              {[{ name: 'Rahul Sharma', roll: '2024001', class: '10-A', status: 'Active', attendance: '91%' }].map((student, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><span className="text-sm font-medium text-primary">{student.name.split(' ').map(n => n[0]).join('')}</span></div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.roll} • Class {student.class}</p>
                    </div>
                  </div>
                  <div className="text-right"><div className="text-sm font-medium">{student.attendance}</div><div className="text-xs text-muted-foreground">{student.status}</div></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const SettingsPanel = () => {
  const handleSaveSettings = () => toast({ title: 'Settings Saved', description: 'All system settings have been updated successfully.' });
  return (
    <div className="space-y-6">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> System Settings</CardTitle>
          <CardDescription>Configure attendance system preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Face Recognition Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label htmlFor="confidence">Recognition Confidence Threshold</Label><Input id="confidence" type="number" defaultValue="85" className="w-20" /></div>
              <div className="flex items-center justify-between"><Label htmlFor="auto-mark">Auto-mark after recognition</Label><input type="checkbox" id="auto-mark" defaultChecked className="rounded" /></div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Attendance Rules</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label htmlFor="late-threshold">Late arrival threshold (minutes)</Label><Input id="late-threshold" type="number" defaultValue="15" className="w-20" /></div>
              <div className="flex items-center justify-between"><Label htmlFor="absent-threshold">Mark absent after (minutes)</Label><Input id="absent-threshold" type="number" defaultValue="30" className="w-20" /></div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Notifications</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label htmlFor="parent-sms">Send SMS to parents</Label><input type="checkbox" id="parent-sms" className="rounded" /></div>
              <div className="flex items-center justify-between"><Label htmlFor="daily-report">Daily report email</Label><input type="checkbox" id="daily-report" defaultChecked className="rounded" /></div>
            </div>
          </div>
          <Button className="btn-gradient" onClick={handleSaveSettings}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default {} as any;
