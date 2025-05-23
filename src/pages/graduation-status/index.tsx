"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { User } from "@/services/users.service";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import TranscriptUploader from "@/components/transcript/transcript-uploader";
import "@/app/globals.css";

export default function GraduationStatusPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [analyzed, setAnalyzed] = useState<any | null>(null); // 📥 PDF analiz sonucu

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

  const dummyData = {
    totalEcts: 120,
    gpa: 2.85,
    courses: [
      { code: "CENG111", grade: "BA", ects: 5 },
      { code: "CENG112", grade: "BB", ects: 5 },
    ],
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

  // 👇 analyzed yoksa dummy data kullan
  const data = analyzed ?? dummyData;

  const ectsCompleted = data.totalEcts;
  const gpa = data.gpa;
  const gpaEligible = gpa >= req.minGpa;
  const missingCourses = req.requiredCourses.filter(
    (code) => !data.courses?.some((c: any) => c.code === code)
  );
  const eligibility =
    gpaEligible &&
    ectsCompleted >= req.ectsTotal &&
    missingCourses.length === 0;

  const handleLogout = async () => {
    await authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex-1">
        <Navbar
          userName={user.name}
          onLogout={handleLogout}
          onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user.department} - Graduation Status
          </h1>

          {/* ✅ Transkript yükleme bileşeni */}
          <TranscriptUploader onResult={setAnalyzed} />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Graduation Evaluation</CardTitle>
              <Badge variant={eligibility ? "success" : "destructive"}>
                {eligibility ? "Complete" : "Incomplete"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Graduation Eligibility
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {eligibility ? "Complete" : "Incomplete"}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    ECTS Completed
                  </span>
                  <span className="text-xs text-gray-600">
                    {ectsCompleted}/{req.ectsTotal}
                  </span>
                </div>
                <ProgressBar value={(ectsCompleted / req.ectsTotal) * 100} />
                <div className="text-xs text-gray-500 mt-1">
                  {req.ectsTotal - ectsCompleted} more ECTS needed.
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">GPA</div>
                <div className="text-base text-gray-900">
                  Current GPA:{" "}
                  <span className="font-semibold">{gpa.toFixed(2)}</span>{" "}
                  {gpaEligible && (
                    <span className="ml-2 text-green-600 text-xs">
                      (Eligible)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">
                  Required Courses
                </div>
                <div className="text-base text-gray-900">
                  {missingCourses.length === 0
                    ? "All compulsory courses completed"
                    : "Missing: " + missingCourses.join(", ")}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
