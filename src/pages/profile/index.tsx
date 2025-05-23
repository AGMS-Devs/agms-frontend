'use client';

import '/src/app/globals.css';
import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiBook } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';
import { Navbar } from '@/components/ui/navbar';

export default function ProfileSettings() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    studentNo: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.name || '',
        email: currentUser.email || '',
        department: currentUser.department || '',
        studentNo: currentUser.role === 'student' ? currentUser.id || '' : '',
      }));
    } else {
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'New passwords do not match.'
      });
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'New password must be at least 8 characters long.'
      });
      return;
    }

    try {
      // const result = await authService.updatePassword(...);
      toast({
        title: 'Success',
        description: 'Password updated successfully.'
      });

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update password. Please try again.'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B0000]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(prev => !prev)} />

      {/* Main Content */}
      <div className="flex-1">
        <Navbar
          userName={formData.fullName || 'User'}
          onLogout={() => authService.logout()}
          onSidebarToggle={() => setIsSidebarOpen(prev => !prev)}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="py-10 px-6 max-w-5xl w-full mx-auto">
          <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

          <div className="grid gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <div className="relative">
                      <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        name="department"
                        value={formData.department}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                  </div>

                  {formData.studentNo && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Student No</label>
                      <div className="relative">
                        <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          name="studentNo"
                          value={formData.studentNo}
                          disabled
                          className="pl-10 bg-gray-50"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="pl-10"
                          required
                          minLength={8}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" className="bg-[#8B0000] hover:bg-[#6B0000]">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </main>
      </div>
  </div>
  );
}
