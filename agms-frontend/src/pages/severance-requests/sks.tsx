'use client';

import { useEffect, useState } from 'react';
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
  sksDebt: boolean;
}

export default function SKSClearancePage() {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([
    {
      id: 201,
      name: 'Ali Vural',
      department: 'Computer Engineering',
      sksDebt: false,
    },
    {
      id: 202,
      name: 'Fatma Kılıç',
      department: 'Mechanical Engineering',
      sksDebt: true,
    },
    {
      id: 203,
      name: 'Cem Şahin',
      department: 'Electrical Engineering',
      sksDebt: true,
    },
  ]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) setUser(currentUser);
  }, []);

  const handleApprove = (id: number) => {
    alert(`✅ Student ID ${id} SKS clearance approved.`);
  };

  const handleReject = (id: number) => {
    alert(`❌ Student ID ${id} SKS clearance rejected.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar userName={user.name} onLogout={() => authService.logout()} />}
      <main className="max-w-6xl mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pending SKS Requests</CardTitle>
            <p className="text-sm text-muted-foreground">
              Review and process pending severance requests for SKS
            </p>
          </CardHeader>
          <CardContent>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Student ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-center">SKS Debt</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const canApprove = !student.sksDebt;
                  return (
                    <tr key={student.id} className="border-b">
                      <td className="p-2">{student.id}</td>
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.department}</td>
                      <td className="p-2 text-center">
                        <input type="checkbox" checked={student.sksDebt} disabled />
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
