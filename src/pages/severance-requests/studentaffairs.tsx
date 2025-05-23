'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { User } from '@/services/users.service';
import { cn } from '@/lib/utils';
import '@/app/globals.css';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import { Navbar } from '@/components/ui/navbar';
import { toast } from '@/components/ui/use-toast';

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

const ALLOWED_ROLES = ['studentAffairs'];

export default function StudentAffairsClearancePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen,setIsSidebarOpen] = useState(true);
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
      if (!currentUser || !ALLOWED_ROLES.includes(currentUser.role)) {
        router.push('/unauthorized'); // izin yoksa yönlendir
      } else {
        setUser(currentUser); // izin varsa user'ı ayarla
      }
    }, []);


  const handleFinalize = (id: number, isApproved: boolean) => {
    const msg = isApproved
      ? `✅ Student ID ${id} has completed all clearances. Process finalized.`
      : `❌ Student ID ${id} has missing approvals. Cannot finalize.`;
    alert(msg);
  };

  const handleLogout = async () => {
    await authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      variant: "default"
    });
    router.push('/');
  };

  if (!user) return null;
  return (
  <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(prev => !prev)} />

      <div className="flex-1">
        <Navbar
          userName={user.name}
          onLogout={handleLogout}
          onSidebarToggle={() => setIsSidebarOpen(prev => !prev)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="max-w-4xl w-full mx-auto py-10 px-4">
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
    </div>
  );
}
