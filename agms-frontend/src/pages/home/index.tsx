import '@/app/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiLogOut, FiBell, FiUser, FiGlobe, FiMenu } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { User } from '@/services/users.service';
import { authService } from '@/services/auth.service';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress';
import { Navbar } from '@/components/ui/navbar';

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Bölüme göre mezuniyet şartları
  const departmentRequirements: Record<string, {
    ectsTotal: number;
    minGpa: number;
    requiredCourses: string[];
  }> = {
    'Computer Engineering': {
      ectsTotal: 150,
      minGpa: 2.0,
      requiredCourses: ['CENG101', 'CENG102', 'CENG103'],
    },
    'Electrical Engineering': {
      ectsTotal: 170,
      minGpa: 2.2,
      requiredCourses: ['EE101', 'EE102', 'EE201'],
    },
    // Diğer bölümler eklenebilir
  };

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

  if (isLoading) return null;
  if (!user) return null;

  // Kullanıcının bölümüne göre şartları al
  const dept = user.department;
  const req = departmentRequirements[dept] || departmentRequirements['Computer Engineering'];

  // Demo graduation data (kullanıcıya göre dinamik)
  const graduation = {
    department: dept,
    eligibility: false,
    ectsCompleted: 120, // Bunu user datasından da alabilirsin
    ectsTotal: req.ectsTotal,
    gpa: 2.85,
    gpaEligible: 2.85 >= req.minGpa,
    requiredCourses: req.requiredCourses,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} onLogout={handleLogout} />
      {/* Main Content */}

      <main className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{graduation.department}</h1>
        {user.role === 'student' ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Graduation Status</CardTitle>
              <Badge variant={graduation.eligibility ? 'success' : 'destructive'}>
                {graduation.eligibility ? 'Complete' : 'Incomplete'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700">Graduation Eligibility</div>
                <div className="text-lg font-semibold text-gray-900">
                  {graduation.eligibility ? 'Complete' : 'Incomplete'}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">ECTS Completed</span>
                  <span className="text-xs text-gray-600">{graduation.ectsCompleted}/{graduation.ectsTotal}</span>
                </div>
                <ProgressBar value={graduation.ectsCompleted / graduation.ectsTotal * 100} />
                <div className="text-xs text-gray-500 mt-1">
                  The student needs to complete {graduation.ectsTotal - graduation.ectsCompleted} more ECTS.
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">GPA</div>
                <div className="text-base text-gray-900">
                  Current GPA: <span className="font-semibold">{graduation.gpa}</span> {graduation.gpaEligible && <span className="ml-2 text-green-600 text-xs">(Eligible for graduation)</span>}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Required Courses</div>
                <div className="text-base text-gray-900">
                  {graduation.requiredCourses.join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Welcome, {user.name}!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-gray-700 text-base">
                This is the AGMS system. You are logged in as <span className="font-semibold">{user.role.replace(/^(.)/, c => c.toUpperCase())}</span>.
              </div>
              <div className="text-gray-500 text-sm">
                Graduation status is only visible for students. Please use the menu to access your role-specific features.
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
