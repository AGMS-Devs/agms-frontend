// pages/graduation-approval/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { authService } from '@/services/auth.service';
import { User } from '@/services/users.service';

interface Student {
  id: number;
  name: string;
  department: string;
  status: 'Pending' | 'Approved' | 'Denied';
}

export default function GraduationApprovalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Ahmet Yılmaz', department: 'Computer Engineering', status: 'Pending' },
    { id: 2, name: 'Ayşe Demir', department: 'Mechanical Engineering', status: 'Approved' },
    { id: 3, name: 'Mehmet Kaya', department: 'Electrical Engineering', status: 'Pending' }
  ]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'advisor') {
      router.push('/');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const updateStatus = (id: number, status: 'Approved' | 'Denied') => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, status } : student
      )
    );
    alert(`Student ID ${id} status updated to ${status}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar
        userName={user.name}
        onLogout={() => authService.logout()}
        onSidebarToggle={() => {}}
        isSidebarOpen={true}
        />

      <main className="max-w-4xl mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Graduation Approval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {students.map(student => (
              <div key={student.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-1">
                <div className="font-medium text-gray-900">{student.name}</div>
                <div className="text-sm text-gray-600">{student.department}</div>
                <div className="text-sm">Status: <span className="font-semibold">{student.status}</span></div>

                {student.status === 'Pending' && (
                  <div className="space-x-2 mt-2">
                    <button
                      onClick={() => updateStatus(student.id, 'Approved')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(student.id, 'Denied')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Deny
                    </button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
