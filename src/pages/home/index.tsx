'use client';

import '@/app/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '@/services/auth.service';
import { User } from '@/services/users.service';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar } from '@/components/ui/sidebar';
import { Navbar } from '@/components/ui/navbar';

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to logout.'
      });
    }
  };

  if (isLoading || !user) return null;
  
  return (
    <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(prev => !prev)} />
    
          {/* Main Content */}
          <div className="flex-1">
            <Navbar
              userName={`${user.name}` || 'User'}
              onSidebarToggle={() => setIsSidebarOpen(prev => !prev)}
              isSidebarOpen={isSidebarOpen}
            />
      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Welcome, {user.name}!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-gray-700 text-base">
              This is the AGMS system. You are logged in as <span className="font-semibold">{user.role.replace(/^(.)/, c => c.toUpperCase())}</span>.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </div>
  );
}
