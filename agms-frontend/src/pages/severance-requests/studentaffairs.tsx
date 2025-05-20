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
  approvals: {
    library: boolean;
    sks: boolean;
    doitp: boolean;
    careerOffice: boolean;
  };
}

export default function StudentAffairsClearancePage() {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([{
    id: 301,
    name: 'Merve Yıldız',
    department: 'Computer Engineering',
    approvals: {
      library: true,
      sks: true,
      doitp: true,
      careerOffice: true,
    },
  }, {
    id: 302,
    name: 'Berkay Erdem',
    department: 'Mechanical Engineering',
    approvals: {
      library: true,
      sks: false,
      doitp: true,
      careerOffice: true,
    },
  }]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) setUser(currentUser);
  }, []);

  const handleFinalize = (id: number, isApproved: boolean) => {
    const msg = isApproved
      ? `✅ Student ID ${id} has completed all clearances. Process finalized.`
      : `❌ Student ID ${id} has missing approvals. Cannot finalize.`;
    alert(msg);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar userName={user.name} onLogout={() => authService.logout()} />}
      <main className="max-w-6xl mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Student Affairs Clearance</CardTitle>
            <p className="text-sm text-muted-foreground">Verify if all departmental clearances are completed and finalize the student's process.</p>
          </CardHeader>
          <CardContent>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Student ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-center">Library</th>
                  <th className="p-2 text-center">SKS</th>
                  <th className="p-2 text-center">DOITP</th>
                  <th className="p-2 text-center">Career</th>
                  <th className="p-2 text-center">Finalize</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const isAllApproved = Object.values(student.approvals).every(v => v);
                  return (
                    <tr key={student.id} className="border-b">
                      <td className="p-2">{student.id}</td>
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.department}</td>
                      <td className="p-2 text-center"><input type="checkbox" checked={student.approvals.library} disabled /></td>
                      <td className="p-2 text-center"><input type="checkbox" checked={student.approvals.sks} disabled /></td>
                      <td className="p-2 text-center"><input type="checkbox" checked={student.approvals.doitp} disabled /></td>
                      <td className="p-2 text-center"><input type="checkbox" checked={student.approvals.careerOffice} disabled /></td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleFinalize(student.id, isAllApproved)}
                          className={cn(
                            'px-3 py-1 rounded text-white text-xs',
                            isAllApproved ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                          )}
                          disabled={!isAllApproved}
                        >
                          Finalize
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
