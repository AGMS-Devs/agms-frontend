"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { User } from "@/services/users.service";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import "@/app/globals.css";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";


export default function GraduationStatusPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  const departmentRequirements: Record<
    string,
    {
      ectsTotal: number;
      minGpa: number;
      requiredCourses: string[];
    }
  > = {
    "Computer Engineering": {
      ectsTotal: 150,
      minGpa: 2.0,
      requiredCourses: ["CENG111", "CENG112", "CENG113"],
    },
    // Diğer bölümler...
  };

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push("/");
    } else {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading || !user) return null;

  const req =
    departmentRequirements[user.department] ||
    departmentRequirements["Computer Engineering"];

  const graduation = {
    department: user.department,
    eligibility: false,
    ectsCompleted: 120,
    ectsTotal: req.ectsTotal,
    gpa: 2.85,
    gpaEligible: 2.85 >= req.minGpa,
    requiredCourses: req.requiredCourses,
  };

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
          <main className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {graduation.department}
          </h1>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Graduation Status</CardTitle>
              <Badge variant={graduation.eligibility ? "success" : "destructive"}>
                {graduation.eligibility ? "Complete" : "Incomplete"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Graduation Eligibility
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {graduation.eligibility ? "Complete" : "Incomplete"}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    ECTS Completed
                  </span>
                  <span className="text-xs text-gray-600">
                    {graduation.ectsCompleted}/{graduation.ectsTotal}
                  </span>
                </div>
                <ProgressBar
                  value={(graduation.ectsCompleted / graduation.ectsTotal) * 100}
                />
                <div className="text-xs text-gray-500 mt-1">
                  The student needs to complete{" "}
                  {graduation.ectsTotal - graduation.ectsCompleted} more ECTS.
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">GPA</div>
                <div className="text-base text-gray-900">
                  Current GPA:{" "}
                  <span className="font-semibold">{graduation.gpa}</span>{" "}
                  {graduation.gpaEligible && (
                    <span className="ml-2 text-green-600 text-xs">
                      (Eligible for graduation)
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Required Courses
                </div>
                <div className="text-base text-gray-900">
                  {graduation.requiredCourses.join(", ")}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
    );
  }
