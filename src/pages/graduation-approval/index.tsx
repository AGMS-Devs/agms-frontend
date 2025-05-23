"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar";
import { Sidebar } from "@/components/ui/sidebar";
import { authService } from "@/services/auth.service";
import { User } from "@/services/users.service";
import { toast } from "@/components/ui/use-toast";
import "@/app/globals.css";

type Status = "Pending" | "Approved" | "Denied";

interface Student {
  id: number;
  name: string;
  department: string;
  transcriptUrl: string;
  advisorStatus: Status;
  departmentSecretaryStatus: Status;
  facultyDeansOfficeStatus: Status;
  studentAffairsStatus: Status;
}

export default function GraduationApprovalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [transcriptStudent, setTranscriptStudent] = useState<Student | null>(
    null
  );
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [pendingAction, setPendingAction] = useState<Status | null>(null);

  const [students, setStudents] = useState<Student[]>([]);

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

    setStudents([
      {
        id: 1,
        name: "Ahmet Yılmaz",
        department: "Computer Engineering",
        transcriptUrl: "/transcripts/ahmet.pdf",
        advisorStatus: "Pending",
        departmentSecretaryStatus: "Pending",
        facultyDeansOfficeStatus: "Pending",
        studentAffairsStatus: "Pending",
      },
      {
        id: 2,
        name: "Ayşe Demir",
        department: "Mechanical Engineering",
        transcriptUrl: "/transcripts/ayse.pdf",
        advisorStatus: "Approved",
        departmentSecretaryStatus: "Approved",
        facultyDeansOfficeStatus: "Pending",
        studentAffairsStatus: "Pending",
      },
      {
        id: 3,
        name: "Mehmet Kaya",
        department: "Electrical Engineering",
        transcriptUrl: "/transcripts/mehmet.pdf",
        advisorStatus: "Approved",
        departmentSecretaryStatus: "Approved",
        facultyDeansOfficeStatus: "Approved",
        studentAffairsStatus: "Pending",
      },
    ]);
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
    setSelectedStudent(null);
    setPendingAction(null);
  };

  const handleLogout = async () => {
    await authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.push("/");
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
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

        <main className="max-w-4xl mx-auto py-10 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Graduation Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 🔍 Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              {filteredStudents.map((student) => {
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
                    className="border rounded-lg p-4 bg-white shadow-sm space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {student.department}
                        </div>
                      </div>
                      <button
                        onClick={() => setTranscriptStudent(student)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Show Transcript
                      </button>
                    </div>

                    {[
                      "advisor",
                      "departmentSecretary",
                      "facultyDeansOffice",
                      "studentAffairs",
                    ].map((roleLabel, idx) => {
                      const label =
                        roleLabel === "advisor"
                          ? "Advisor"
                          : roleLabel === "departmentSecretary"
                          ? "Department Secretary"
                          : roleLabel === "facultyDeansOffice"
                          ? "Faculty Dean's Office"
                          : "Student Affairs";

                      const status = student[
                        `${roleLabel}Status` as keyof Student
                      ] as Status;

                      return (
                        <div
                          key={roleLabel}
                          className="flex items-center space-x-2"
                        >
                          <span>
                            {status === "Approved"
                              ? "✅"
                              : status === "Denied"
                              ? "❌"
                              : "⏳"}
                          </span>
                          <span className="font-bold text-gray-700">
                            {idx + 1}.
                          </span>
                          <span className="font-semibold">{label}:</span>
                          <span
                            className={
                              status === "Approved"
                                ? "text-green-600 font-bold"
                                : status === "Denied"
                                ? "text-red-600 font-bold"
                                : "text-gray-500"
                            }
                          >
                            {status}
                          </span>
                        </div>
                      );
                    })}

                    {canTakeAction && (
                      <div className="space-x-2 mt-3">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setPendingAction("Approved");
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setPendingAction("Denied");
                          }}
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

      {/* 📄 Transcript Dummy Modal */}
      {transcriptStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Transcript - {transcriptStudent.name}
              </h3>
              <button
                onClick={() => setTranscriptStudent(null)}
                className="text-sm text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-gray-800 space-y-2">
              <p>
                <strong>Department:</strong> {transcriptStudent.department}
              </p>
              <p>
                <strong>GPA:</strong> 2.85
              </p>
              <p>
                <strong>Completed ECTS:</strong> 140
              </p>
              <p>
                <strong>Courses:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-600">
                <li>
                  CENG111 - Introduction to Programming - 5 ECTS - Grade: BB
                </li>
                <li>CENG112 - Data Structures - 6 ECTS - Grade: BA</li>
                <li>CENG113 - Computer Organization - 5 ECTS - Grade: AA</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Confirmation Modal */}
      {selectedStudent && pendingAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">
              Confirm {pendingAction} for {selectedStudent.name}?
            </h2>
            <p className="text-sm text-gray-500">
              Are you sure you want to mark this student as{" "}
              <strong>{pendingAction}</strong> for <strong>{user?.role}</strong>
              ?
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setPendingAction(null);
                }}
                className="px-4 py-1 text-sm border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateStatus(selectedStudent.id, user.role, pendingAction)
                }
                className={`px-4 py-1 text-sm rounded text-white ${
                  pendingAction === "Approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
