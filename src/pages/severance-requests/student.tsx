'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { User } from '@/services/users.service';
import { cn } from '@/lib/utils';
import '@/app/globals.css';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';
import { Sidebar } from '@/components/ui/sidebar';
import PageLayout from "@/components/ui/PageLayout";

interface Checklist {
  Library: string;
  SKS: string;
  DOITP: string;
  'Career Office': string;
  'Student Affairs': string;
}

const ALLOWED_ROLES = ['student'];

export default function StudentClearanceStatusPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const studentChecklist: Checklist = {
    Library: 'Approved',
    SKS: 'Pending',
    DOITP: 'Approved',
    'Career Office': 'Not Approved',
    'Student Affairs': 'Not Approved',
  };

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !ALLOWED_ROLES.includes(currentUser.role)) {
      router.push('/unauthorized');
    } else {
      setUser(currentUser);
    }
  }, []);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(prev => !prev)} />

      <div className="flex-1">
        <Navbar
          userName={user.name}
          onLogout={() => authService.logout()}
          onSidebarToggle={() => setIsSidebarOpen(prev => !prev)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="max-w-4xl w-full mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">My Clearance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {Object.entries(studentChecklist).map(([department, status]) => (
              <li key={department} className="flex justify-between">
                <span className="font-medium text-gray-800">{department}</span>
                <span
                  className={cn(
                    'text-xs font-semibold px-2 py-1 rounded',
                    status === 'Approved' && 'bg-green-100 text-green-700',
                    status === 'Pending' && 'bg-yellow-100 text-yellow-700',
                    status === 'Not Approved' && 'bg-red-100 text-red-700'
                  )}
                >
                  {status}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            {Object.values(studentChecklist).every((status) => status === 'Approved') ? (
              <p className="text-green-700 font-semibold">🎉 Your clearance is fully approved!</p>
            ) : (
              <p className="text-yellow-700 font-medium">⚠️ Some approvals are still pending. Please check back later.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>

    </div>
  </div>
  );
}
