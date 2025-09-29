import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/DashboardShell';

const StudentDashboard: React.FC = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [canCapture, setCanCapture] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'settings'>('dashboard');
  const [isCapturing, setIsCapturing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      fetch(`http://localhost:5000/api/student/attendance/${studentId}`)
        .then(res => res.json())
        .then(data => setAttendance(Array.isArray(data) ? data : []))
        .catch(() => setAttendance([]));
    }

    // Get student's assigned teacher and check recognition status
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const assignedTeacherId = user.teacherId;
    let poll: any;
    if (assignedTeacherId) {
      const check = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/teacher/recognition/${assignedTeacherId}`);
          if (res.ok) {
            const data = await res.json();
            setCanCapture(!!data.recognitionActive);
          }
        } catch (e) {
          // ignore
        }
      };
      check();
      poll = setInterval(check, 3000);
    }

    return () => { if (poll) clearInterval(poll); };
  }, []);

  const handleCaptureAttendance = async () => {
    setCaptureError(null);
    setIsCapturing(true);
    setPreview(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreview(dataUrl);

      stream.getTracks().forEach(t => t.stop());

      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
      });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const classLoc = localStorage.getItem('classLocation');
      let locationStr = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      if (classLoc) {
        const parts = classLoc.split(',').map(p => parseFloat(p));
        const classLat = parts[0];
        const classLng = parts[1];
        const radius = parts[2] || 200;
        const toRad = (x: number) => x * Math.PI / 180;
        const R = 6371000;
        const dLat = toRad(classLat - lat);
        const dLon = toRad(classLng - lng);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat)) * Math.cos(toRad(classLat)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const dist = R * c;
        const withinClass = dist <= radius;
        if (!withinClass) {
          const msg = `You appear to be ${Math.round(dist)}m away from class location (allowed ${radius}m). Attendance not allowed.`;
          setCaptureError(msg);
          toast({ title: 'Location mismatch', description: msg, variant: 'destructive' });
          setIsCapturing(false);
          return;
        }
      }

      const studentId = localStorage.getItem('studentId');
      const token = localStorage.getItem('token');
      if (!studentId) throw new Error('Student ID not found');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch('http://localhost:5000/api/student/capture-attendance', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          imageData: dataUrl, 
          location: locationStr 
        }),
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to capture attendance');
      }

      toast({ title: 'Attendance marked', description: 'Your attendance has been recorded.' });

      fetch(`http://localhost:5000/api/student/attendance/${studentId}`)
        .then(res => res.json())
        .then(data => setAttendance(Array.isArray(data) ? data : []))
        .catch(() => {});

    } catch (err: any) {
      console.error('Capture error', err);
      setCaptureError(err?.message || String(err));
      toast({ title: 'Capture failed', description: err?.message || 'Unable to capture attendance.', variant: 'destructive' });
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Student Dashboard" subtitle="View your attendance and capture when enabled by your teacher" onLogout={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); window.location.href = '/'; }} />
      <div className="min-h-screen p-8">
        <div className="w-full">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div />
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-3 items-center">
                <button className={`px-6 py-2 rounded-md shadow-sm ${activeTab === 'dashboard' ? 'bg-primary text-primary-foreground' : 'bg-white border'}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                <button className={`px-6 py-2 rounded-md shadow-sm ${activeTab === 'reports' ? 'bg-primary text-primary-foreground' : 'bg-white border'}`} onClick={() => setActiveTab('reports')}>Reports</button>
                <button className={`px-6 py-2 rounded-md shadow-sm ${activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'bg-white border'}`} onClick={() => setActiveTab('settings')}>Settings</button>
              </div>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {attendance && attendance.length > 0 ? (
                      attendance.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="font-semibold">{entry.date}</div>
                            <div className={"text-sm " + (entry.status === "Present" ? "text-success" : "text-destructive")}>{entry.status}</div>
                            <div className="text-xs text-muted-foreground">Location: {entry.location}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        <p className="text-lg font-medium">No attendance records yet</p>
                        <p className="mt-2 text-sm">Your attendance will appear here after your teacher marks or you capture attendance.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Quick Attendance Capture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">Recognition status</div>
                      {canCapture ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Disabled</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={async () => {
                        const teacherId = localStorage.getItem('teacherId');
                        if (!teacherId) return;
                        try {
                          const res = await fetch(`http://localhost:5000/api/teacher/recognition/${teacherId}`);
                          if (res.ok) {
                            const data = await res.json();
                            setCanCapture(!!data.recognitionActive);
                          }
                        } catch (e) { /* ignore */ }
                      }}>Refresh</Button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {!canCapture && (
                      <div>
                        <Button disabled className="w-full">Capture Attendance</Button>
                        <div className="mt-2 text-xs text-muted-foreground">Recognition is currently disabled by your teacher. Please wait for them to start recognition.</div>
                      </div>
                    )}
                    {canCapture && (
                      <div>
                        <div className="mb-3">
                          <Button className="w-full" onClick={handleCaptureAttendance} disabled={isCapturing}>
                            {isCapturing ? 'Capturing...' : 'Capture Attendance'}
                          </Button>
                          {preview && (
                            <div className="mt-2">
                              <img src={preview} alt="capture preview" className="w-48 h-auto rounded border" />
                            </div>
                          )}
                          {captureError && <div className="text-xs text-destructive mt-2">{captureError}</div>}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">Recognition is active — click capture to take a photo and submit your attendance. Your location will be captured automatically.</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'reports' && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <div className="text-lg font-semibold">No reports yet</div>
                    <div className="mt-2 text-sm text-muted-foreground text-center">Reports will appear here once your teacher or admin generates them. You can request attendance summaries or performance reports from your instructor.</div>
                    <div className="mt-4">
                      <Button onClick={() => window.alert('Request report feature is not implemented yet')}>
                        Request report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-4xl mb-4">⚙️</div>
                    <div className="text-lg font-semibold">No settings available</div>
                    <div className="mt-2 text-sm text-muted-foreground text-center">There are no user-configurable settings for this student account yet. Admins can manage system-wide settings from the admin panel.</div>
                    <div className="mt-4">
                      <Button onClick={() => window.alert('Visit Admin panel to manage settings')}>
                        Contact Admin
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

