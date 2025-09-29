import React, { useEffect, useState, useCallback } from 'react';
import { DashboardHeader, NavItem } from '@/components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ok = localStorage.getItem('adminLoggedIn');
      if (!ok) {
        // redirect to admin login
        window.location.href = '/admin/login';
        return;
      }

      const res = await fetch('http://localhost:5000/api/admin/teachers');
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setTeachers(data || []);
    } catch (err: any) {
      const msg = err?.message || 'Failed to load';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleReview = async (id: string, action: 'accept' | 'decline') => {
    const approved = action === 'accept';
    const res = await fetch(`http://localhost:5000/api/admin/teachers/${id}/approve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved }) });
    const updated = await res.json();
    setTeachers(prev => prev.map(t => t._id === id ? updated : t));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Admin Dashboard" subtitle="Manage teacher approvals" onLogout={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); window.location.href = '/'; }} />
      <div className="flex">
        <div className="w-64 bg-card border-r border-border min-h-screen p-4">
          <nav className="space-y-2">
            <NavItem icon={<span />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavItem icon={<span />} label="Teachers" active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} />
          </nav>
        </div>
        <div className="flex-1 p-8">
          {isLoading ? (
            <div className="p-8">
              <div className="text-lg">Loading teachers...</div>
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="text-destructive mb-4">Error: {error}</div>
              <div className="flex gap-2">
                <Button onClick={fetchTeachers}>Retry</Button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Teacher Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {teachers.length === 0 ? (
                        <div className="py-12 text-center">
                          <div className="text-4xl">🧑‍🏫</div>
                          <h3 className="text-xl font-semibold mt-4">No teacher registrations yet</h3>
                          <p className="text-sm text-muted-foreground mt-2">When teachers register, they'll appear here for review and approval.</p>
                          <div className="mt-4">
                            <Button onClick={fetchTeachers}>Refresh</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {teachers.map((teacher) => (
                            <div key={teacher._id} className="flex items-center justify-between border-b pb-4">
                              <div>
                                <div className="font-semibold">{teacher.name}</div>
                                <div className="text-sm">{teacher.email}</div>
                                <div className="text-xs text-muted-foreground">ID: {teacher._id}</div>
                              </div>
                              <div>
                                {teacher.status === 'pending' ? (
                                  <>
                                    <Button onClick={() => handleReview(teacher._id, 'accept')} className="mr-2">Accept</Button>
                                    <Button onClick={() => handleReview(teacher._id, 'decline')} variant="outline">Decline</Button>
                                  </>
                                ) : (
                                  <span className={"text-sm font-medium " + (teacher.status === 'accepted' ? 'text-success' : 'text-destructive')}>
                                    {typeof teacher.status === 'string' && teacher.status.length > 0
                                      ? teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)
                                      : 'Unknown'}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'teachers' && (
                <Card className="mt-8">
                  <CardHeader><CardTitle>Teachers Analytics</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex gap-8">
                      <div><div className="text-2xl font-bold">{teachers.length}</div><div className="text-sm">Total Teachers</div></div>
                      <div><div className="text-2xl font-bold">{teachers.filter(t => t.status === 'accepted').length}</div><div className="text-sm">Accepted</div></div>
                      <div><div className="text-2xl font-bold">{teachers.filter(t => t.status === 'pending').length}</div><div className="text-sm">Pending</div></div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
