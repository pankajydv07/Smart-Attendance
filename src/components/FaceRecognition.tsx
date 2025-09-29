import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CameraOff, CheckCircle, UserCheck, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
}

interface AttendanceRecord {
  studentId: string;
  timestamp: Date;
  confidence: number;
}

const FaceRecognition = ({ teacherControlled = false, externallyActive = false, studentAllowedStart = true }: { teacherControlled?: boolean; externallyActive?: boolean; studentAllowedStart?: boolean }) => {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [recognizedStudents, setRecognizedStudents] = useState<Student[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Mock student data - in production this would come from database
  const mockStudents: Student[] = [
    { id: "1", name: "Rahul Sharma", rollNumber: "2024001", class: "Class 10-A" },
    { id: "2", name: "Priya Patel", rollNumber: "2024002", class: "Class 10-A" },
    { id: "3", name: "Arjun Kumar", rollNumber: "2024003", class: "Class 10-A" },
    { id: "4", name: "Sneha Singh", rollNumber: "2024004", class: "Class 10-A" },
  ];

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      setIsActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      toast({
        title: "Camera Started",
        description: "Face recognition is now active. Position students in front of the camera.",
      });

      // Start face detection simulation
      simulateFaceDetection();
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
    
    toast({
      title: "Camera Stopped",
      description: `Attendance marked for ${attendanceRecords.length} students.`,
    });
  };

  // Simulate face detection and recognition
  const simulateFaceDetection = () => {
    const interval = setInterval(() => {
      if (!isActive) {
        clearInterval(interval);
        return;
      }

      // Simulate random student recognition
      const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
      const confidence = 0.85 + Math.random() * 0.14; // 85-99% confidence
      
      // Check if student already marked present
      const alreadyMarked = attendanceRecords.some(record => record.studentId === randomStudent.id);
      
      if (!alreadyMarked && Math.random() > 0.7) { // 30% chance of recognition per interval
        markAttendance(randomStudent, confidence);
      }
    }, 3000); // Check every 3 seconds

    // Clean up interval when component unmounts or camera stops
    return () => clearInterval(interval);
  };

  const markAttendance = (student: Student, confidence: number) => {
    const newRecord: AttendanceRecord = {
      studentId: student.id,
      timestamp: new Date(),
      confidence,
    };

    setAttendanceRecords(prev => [...prev, newRecord]);
    setRecognizedStudents(prev => [...prev, student]);

    toast({
      title: "Student Recognized",
      description: `${student.name} marked present (${(confidence * 100).toFixed(1)}% confidence)`,
    });
  };

  const exportAttendance = () => {
    const csvData = recognizedStudents.map((student, index) => {
      const record = attendanceRecords[index];
      return `${student.rollNumber},${student.name},${student.class},Present,${record.timestamp.toLocaleString()},${(record.confidence * 100).toFixed(1)}%`;
    });
    
    const csvContent = [
      "Roll Number,Name,Class,Status,Timestamp,Confidence",
      ...csvData
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Attendance report downloaded successfully.",
    });
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // If externally controlled (teacher toggles), reflect that
  useEffect(() => {
    if (!teacherControlled) return;
    if (externallyActive && !isActive) startCamera();
    if (!externallyActive && isActive) stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externallyActive]);

  return (
    <div className="space-y-6">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Face Recognition Attendance
          </CardTitle>
          <CardDescription>
            AI-powered attendance marking optimized for rural schools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Camera Feed */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
              {isActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ display: 'none' }}
                  />
                  <div className="absolute top-4 left-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    Live Recognition
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <CameraOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Camera is not active</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Click "Start Recognition" to begin
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4">
              {!teacherControlled && (
                !isActive ? (
                  <Button onClick={startCamera} className="btn-gradient flex-1" size="lg" disabled={!studentAllowedStart}>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Recognition
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="outline" className="flex-1" size="lg">
                    <CameraOff className="mr-2 h-4 w-4" />
                    Stop Camera
                  </Button>
                )
              )}
              {!teacherControlled && !studentAllowedStart && (
                <div className="text-xs text-muted-foreground">Teacher has not enabled face recognition yet.</div>
              )}
              
              {attendanceRecords.length > 0 && (
                <Button onClick={exportAttendance} variant="outline" size="lg">
                  Export CSV
                </Button>
              )}
            </div>

            {/* Recognition Stats */}
            {isActive && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{attendanceRecords.length}</div>
                  <div className="text-sm text-muted-foreground">Recognized</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {attendanceRecords.length > 0 
                      ? Math.round(attendanceRecords.reduce((acc, record) => acc + record.confidence, 0) / attendanceRecords.length * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{mockStudents.length - attendanceRecords.length}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recognized Students List */}
      {recognizedStudents.length > 0 && (
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Today's Attendance ({recognizedStudents.length})
            </CardTitle>
            <CardDescription>Students marked present via face recognition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recognizedStudents.map((student, index) => {
                const record = attendanceRecords[index];
                return (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border bg-success-light/50">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.rollNumber} • {student.class}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-success">Present</div>
                      <div className="text-xs text-muted-foreground">
                        {record.timestamp.toLocaleTimeString()} • {(record.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Requirements Notice */}
      <Card className="dashboard-card border-warning/20 bg-warning-light/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning-foreground mb-1">System Requirements</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Camera access required for face recognition</li>
                <li>• Works on mobile phones, tablets, and computers</li>
                <li>• Optimized for low-bandwidth rural internet</li>
                <li>• Best results with good lighting conditions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaceRecognition;