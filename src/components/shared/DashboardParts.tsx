import React from 'react';
import { GraduationCap, Home, BarChart3, Users, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AttendanceReports from '@/components/AttendanceReports';

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

export const DashboardOverview = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => (
  <div className="space-y-6">
    <div className="grid lg:grid-cols-4 gap-6">
      <Card className="dashboard-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <div className={`p-2 rounded-lg bg-primary/10 text-primary`}>
              <Home />
            </div>
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
            <div className={`p-2 rounded-lg bg-success/10 text-success`}>
              <BarChart3 />
            </div>
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
            <div className={`p-2 rounded-lg bg-warning/10 text-warning`}>
              <Users />
            </div>
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
            <div className={`p-2 rounded-lg bg-accent/10 text-accent`}>
              <BarChart3 />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Today's Summary</CardTitle>
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
              View Detailed Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => (
  <div className="w-64 bg-card border-r border-border min-h-screen p-4">
    <nav className="space-y-2">
      <button onClick={() => setActiveTab('dashboard')} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg">Dashboard</button>
      <button onClick={() => setActiveTab('reports')} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg">Reports</button>
      <button onClick={() => setActiveTab('students')} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg">Students</button>
      <button onClick={() => setActiveTab('settings')} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg">Settings</button>
    </nav>
  </div>
);
