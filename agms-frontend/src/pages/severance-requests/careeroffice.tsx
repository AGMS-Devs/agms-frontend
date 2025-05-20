'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { authService } from '@/services/auth.service';
import { User } from '@/services/users.service';
import { cn } from '@/lib/utils';
import '@/app/globals.css';

interface Student {
  id: number;
  name: string;
  department: string;
}

const ALLOWED_ROLES = ['career'];

export default function CareerOfficeClearancePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState<Student[]>([
    { id: 101, name: 'Ahmet Yılmaz', department: 'Computer Engineering' },
    { id: 102, name: 'Ayşe Demir', department: 'Mechanical Engineering' },
    { id: 103, name: 'Mehmet Kaya', department: 'Electrical Engineering' }
  ]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !ALLOWED_ROLES.includes(currentUser.role)) {
      router.push('/unauthorized'); // izin yoksa yönlendir
    } else {
      setUser(currentUser);
    }
    setLoading(false);
  }, [router]);

  const handleApprove = (id: number) => {
    alert(`✅ Student ID ${id} Career Office clearance approved.`);
  };

  const handleReject = (id: number) => {
    alert(`❌ Student ID ${id} Career Office clearance rejected.`);
  };

  if (loading || !user) return null;

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
            <CardTitle className="text-lg font-semibold">Career Office Clearance Requests</CardTitle>
            <p className="text-sm text-muted-foreground">
              Review and process clearance requests for the career office.
            </p>
          </CardHeader>
          <CardContent>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Student ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="p-2">{student.id}</td>
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{student.department}</td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        className="px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700 text-xs"
                        onClick={() => handleApprove(student.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 text-xs"
                        onClick={() => handleReject(student.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
