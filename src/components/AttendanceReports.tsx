import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Users, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

interface StudentAttendance {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  presentDays: number;
  totalDays: number;
  percentage: number;
  lastSeen: string;
}

const AttendanceReports = () => {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { toast } = useToast();

  // Mock data - in production this would come from database
  const weeklyData: AttendanceData[] = [
    { date: "2024-01-15", present: 142, absent: 14, total: 156, percentage: 91.0 },
    { date: "2024-01-16", present: 138, absent: 18, total: 156, percentage: 88.5 },
    { date: "2024-01-17", present: 145, absent: 11, total: 156, percentage: 92.9 },
    { date: "2024-01-18", present: 140, absent: 16, total: 156, percentage: 89.7 },
    { date: "2024-01-19", present: 144, absent: 12, total: 156, percentage: 92.3 },
  ];

  const studentData: StudentAttendance[] = [
    { id: "1", name: "Rahul Sharma", rollNumber: "2024001", class: "10-A", presentDays: 22, totalDays: 24, percentage: 91.7, lastSeen: "Today, 09:15 AM" },
    { id: "2", name: "Priya Patel", rollNumber: "2024002", class: "10-A", presentDays: 24, totalDays: 24, percentage: 100.0, lastSeen: "Today, 09:10 AM" },
    { id: "3", name: "Arjun Kumar", rollNumber: "2024003", class: "10-A", presentDays: 20, totalDays: 24, percentage: 83.3, lastSeen: "Yesterday, 09:20 AM" },
    { id: "4", name: "Sneha Singh", rollNumber: "2024004", class: "10-A", presentDays: 23, totalDays: 24, percentage: 95.8, lastSeen: "Today, 09:05 AM" },
    { id: "5", name: "Vikram Reddy", rollNumber: "2024005", class: "10-A", presentDays: 18, totalDays: 24, percentage: 75.0, lastSeen: "2 days ago" },
  ];

  const classes = ["10-A", "10-B", "9-A", "9-B", "8-A", "8-B"];

  const generateReport = () => {
    if (selectedPeriod === "custom" && (!startDate || !endDate)) {
      toast({
        title: "Date Range Required",
        description: "Please select both start and end dates for custom period.",
        variant: "destructive",
      });
      return;
    }

    const classText = selectedClass === "all" ? "All Classes" : `Class ${selectedClass}`;
    toast({
      title: "Report Generated",
      description: `${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} attendance report for ${classText} created successfully.`,
    });
  };

  const exportReport = (format: 'csv' | 'pdf') => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `attendance_report_${selectedPeriod}_${timestamp}.${format}`;
    
    if (format === 'csv') {
      const csvData = studentData.map(student => 
        `${student.rollNumber},${student.name},${student.class},${student.presentDays},${student.totalDays},${student.percentage.toFixed(1)}%,${student.lastSeen}`
      );
      
      const csvContent = [
        "Roll Number,Name,Class,Present Days,Total Days,Percentage,Last Seen",
        ...csvData
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      // PDF export would be implemented with a library like jsPDF
      toast({
        title: "PDF Export",
        description: "PDF export functionality would be implemented here.",
      });
    }

    toast({
      title: "Report Downloaded",
      description: `${format.toUpperCase()} report saved as ${filename}`,
    });
  };

  const averageAttendance = weeklyData.reduce((acc, day) => acc + day.percentage, 0) / weeklyData.length;
  const totalPresent = weeklyData.reduce((acc, day) => acc + day.present, 0);
  const totalStudents = weeklyData[0]?.total || 0;

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Generate Attendance Report
          </CardTitle>
          {/* Removed helper text for minimal look */}
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="class-select">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period-select">Time Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod === "custom" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input 
                    id="start-date"
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input 
                    id="end-date"
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <Button onClick={generateReport} className="btn-gradient">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button onClick={() => exportReport('csv')} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => exportReport('pdf')} variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Stats</TabsTrigger>
          <TabsTrigger value="students">Student Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="dashboard-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                      {/* Removed helper text for minimal look */}
                      <p className="text-2xl font-bold text-primary">{averageAttendance.toFixed(1)}%</p>
                    </div>
                  <TrendingUp className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                      {/* Removed helper text for minimal look */}
                      <p className="text-2xl font-bold">{totalStudents}</p>
                    </div>
                  <Users className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                      {/* Removed helper text for minimal look */}
                      <p className="text-2xl font-bold text-success">
                        {studentData.filter(s => s.percentage === 100).length}
                      </p>
                    </div>
                  <CheckCircle className="h-8 w-8 text-success/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Below 80%</p>
                    <p className="text-2xl font-bold text-warning">
                      {studentData.filter(s => s.percentage < 80).length}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-warning/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Trend Chart */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Weekly Attendance Trend</CardTitle>
              <CardDescription>Daily attendance percentage over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.date} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">
                          {day.present}/{day.total} students
                        </span>
                        <span className="text-sm font-medium">{day.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-success h-2 rounded-full transition-all duration-300"
                          style={{ width: `${day.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Attendance Records
              </CardTitle>
              <CardDescription>Detailed daily attendance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.date} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        day.percentage >= 90 ? 'attendance-present' : 
                        day.percentage >= 80 ? 'attendance-pending' : 'attendance-absent'
                      }`}>
                        {day.percentage}%
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Present: {day.present}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span>Absent: {day.absent}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Total: {day.total}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Individual Student Records
              </CardTitle>
              <CardDescription>Detailed attendance records for each student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentData.map((student) => (
                  <div key={student.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div>
                            <h4 className="font-medium">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {student.rollNumber} • Class {student.class}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <span>Present: {student.presentDays}/{student.totalDays} days</span>
                          <span>Last seen: {student.lastSeen}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          student.percentage >= 90 ? 'attendance-present' :
                          student.percentage >= 80 ? 'attendance-pending' : 'attendance-absent'
                        }`}>
                          {student.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceReports;