'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { authService } from '@/services/auth.service';
import { User } from '@/services/users.service';
import { cn } from '@/lib/utils';
import '@/app/globals.css';
import { useRouter } from 'next/navigation';

interface Student {
  id: number;
  name: string;
  department: string;
  fines: {
    library: boolean;
    bookReturns: boolean;
  };
}

const ALLOWED_ROLES = ['library'];

export default function LibraryClearancePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([{
    id: 101,
    name: 'Ahmet Yılmaz',
    department: 'Computer Engineering',
    fines: { library: false, bookReturns: true },
  }, {
    id: 102,
    name: 'Ayşe Demir',
    department: 'Mechanical Engineering',
    fines: { library: true, bookReturns: false },
  }, {
    id: 103,
    name: 'Mehmet Kaya',
    department: 'Electrical Engineering',
    fines: { library: true, bookReturns: true },
  }]);
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !ALLOWED_ROLES.includes(currentUser.role)) {
      router.push('/unauthorized'); // izin yoksa yönlendir
    } else {
      setUser(currentUser); // izin varsa user'ı ayarla
    }
  }, []);

  const handleApprove = (id: number) => {
    alert(`✅ Student ID ${id} library clearance approved.`);
  };

  const handleReject = (id: number) => {
    alert(`❌ Student ID ${id} library clearance rejected.`);
  };

  return(
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar
      userName={user.name}
      onLogout={() => authService.logout()}
      onSidebarToggle={() => {}}
      isSidebarOpen={true}
    />}
      <main className="max-w-6xl mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pending Severance Requests</CardTitle>
            <p className="text-sm text-muted-foreground">Review and process pending severance requests for the library</p>
          </CardHeader>
          <CardContent>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Student ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-center">Library Fines</th>
                  <th className="p-2 text-center">Book Returns</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const canApprove = !student.fines.library && student.fines.bookReturns;
                  return (
                    <tr key={student.id} className="border-b">
                      <td className="p-2">{student.id}</td>
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.department}</td>
                      <td className="p-2 text-center">
                        <input type="checkbox" checked={student.fines.library} disabled />
                      </td>
                      <td className="p-2 text-center">
                        <input type="checkbox" checked={student.fines.bookReturns} disabled />
                      </td>
                      <td className="p-2 text-center space-x-2">
                        <button
                          className={cn(
                            'px-3 py-1 rounded text-white text-xs',
                            canApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
                          )}
                          onClick={() => handleApprove(student.id)}
                          disabled={!canApprove}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs"
                          onClick={() => handleReject(student.id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

