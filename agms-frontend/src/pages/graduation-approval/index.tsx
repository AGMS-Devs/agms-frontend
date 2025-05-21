"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar";
import { Sidebar } from "@/components/ui/sidebar";
import { authService } from "@/services/auth.service";
import { User } from "@/services/users.service";

type Status = "Pending" | "Approved" | "Denied";

interface Student {
  id: number;
  name: string;
  department: string;
  advisorStatus: Status;
  departmentSecretaryStatus: Status;
  facultyDeansOfficeStatus: Status;
  studentAffairsStatus: Status;
}

export default function GraduationApprovalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Ahmet Yılmaz",
      department: "Computer Engineering",
      advisorStatus: "Pending",
      departmentSecretaryStatus: "Pending",
      facultyDeansOfficeStatus: "Pending",
      studentAffairsStatus: "Pending",
    },
    {
      id: 2,
      name: "Ayşe Demir",
      department: "Mechanical Engineering",
      advisorStatus: "Approved",
      departmentSecretaryStatus: "Approved",
      facultyDeansOfficeStatus: "Pending",
      studentAffairsStatus: "Pending",
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      department: "Electrical Engineering",
      advisorStatus: "Approved",
      departmentSecretaryStatus: "Approved",
      facultyDeansOfficeStatus: "Approved",
      studentAffairsStatus: "Pending",
    },
  ]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    const allowedRoles = [
      "advisor",
      "departmentSecretary",
      "facultyDeansOffice",
      "studentAffairs",
    ];

    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      router.push("/");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const updateStatus = (id: number, role: User["role"], status: Status) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== id) return student;

        const updated = { ...student };
        if (role === "advisor") updated.advisorStatus = status;
        else if (role === "departmentSecretary")
          updated.departmentSecretaryStatus = status;
        else if (role === "facultyDeansOffice")
          updated.facultyDeansOfficeStatus = status;
        else if (role === "studentAffairs")
          updated.studentAffairsStatus = status;

        return updated;
      })
    );
    alert(`Student ID ${id} status updated to ${status} by ${role}`);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Main Content */}
      <div className="flex-1">
        <Navbar
          userName={user.name}
          onLogout={() => authService.logout()}
          onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="max-w-4xl mx-auto py-10 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Graduation Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {students.map((student) => {
                const {
                  advisorStatus,
                  departmentSecretaryStatus,
                  facultyDeansOfficeStatus,
                  studentAffairsStatus,
                } = student;

                const currentStatus =
                  user.role === "advisor"
                    ? advisorStatus
                    : user.role === "departmentSecretary"
                    ? departmentSecretaryStatus
                    : user.role === "facultyDeansOffice"
                    ? facultyDeansOfficeStatus
                    : studentAffairsStatus;

                const isPreviousApproved =
                  user.role === "advisor" ||
                  (user.role === "departmentSecretary" &&
                    advisorStatus === "Approved") ||
                  (user.role === "facultyDeansOffice" &&
                    departmentSecretaryStatus === "Approved") ||
                  (user.role === "studentAffairs" &&
                    facultyDeansOfficeStatus === "Approved");

                const canTakeAction =
                  currentStatus === "Pending" && isPreviousApproved;

                return (
                  <div
                    key={student.id}
                    className="border rounded-lg p-4 bg-white shadow-sm space-y-1"
                  >
                    <div className="font-medium text-gray-900">
                      {student.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {student.department}
                    </div>

                    <div className="text-sm mt-2 space-y-1">
                      <div>
                        <strong>Advisor:</strong> {advisorStatus}
                      </div>
                      <div>
                        <strong>Department Secretary:</strong>{" "}
                        {departmentSecretaryStatus}
                      </div>
                      <div>
                        <strong>Faculty Dean's Office:</strong>{" "}
                        {facultyDeansOfficeStatus}
                      </div>
                      <div>
                        <strong>Student Affairs:</strong> {studentAffairsStatus}
                      </div>
                    </div>

                    {canTakeAction && (
                      <div className="space-x-2 mt-3">
                        <button
                          onClick={() =>
                            updateStatus(student.id, user.role, "Approved")
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(student.id, user.role, "Denied")
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Deny
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
