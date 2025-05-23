"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar";
import { Sidebar } from "@/components/ui/sidebar";
import { authService } from "@/services/auth.service";
import { User } from "@/services/users.service";
import { useToast } from "@/components/ui/use-toast";
import "@/app/globals.css";

type Status = "Pending" | "Approved" | "Denied";

interface Student {
  id: number;
  name: string;
  department: string;
  advisorStatus: Status;
  departmentSecretaryStatus: Status;
  facultyDeansOfficeStatus: Status;
  studentAffairsStatus: Status;
  transcript: { code: string; name: string; grade: string; ects: number }[];
}

export default function GraduationApprovalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    studentId: number | null;
    action: "Approved" | "Denied" | null;
  }>({ open: false, studentId: null, action: null });
  const [transcriptModal, setTranscriptModal] = useState<{
    open: boolean;
    student: Student | null;
  }>({ open: false, student: null });

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Ahmet Yılmaz",
      department: "Computer Engineering",
      advisorStatus: "Pending",
      departmentSecretaryStatus: "Pending",
      facultyDeansOfficeStatus: "Pending",
      studentAffairsStatus: "Pending",
      transcript: [
        { code: "CENG111", name: "Intro to Programming", grade: "BA", ects: 5 },
        { code: "CENG112", name: "Data Structures", grade: "BB", ects: 5 },
      ],
    },
    {
      id: 2,
      name: "Ayşe Demir",
      department: "Mechanical Engineering",
      advisorStatus: "Approved",
      departmentSecretaryStatus: "Approved",
      facultyDeansOfficeStatus: "Pending",
      studentAffairsStatus: "Pending",
      transcript: [
        { code: "ME101", name: "Statics", grade: "AA", ects: 6 },
        { code: "ME102", name: "Dynamics", grade: "BA", ects: 6 },
      ],
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      department: "Electrical Engineering",
      advisorStatus: "Approved",
      departmentSecretaryStatus: "Approved",
      facultyDeansOfficeStatus: "Approved",
      studentAffairsStatus: "Pending",
      transcript: [
        { code: "EE101", name: "Circuit Analysis", grade: "BA", ects: 5 },
        { code: "EE102", name: "Electromagnetics", grade: "BB", ects: 5 },
      ],
    },
  ]);

  /* ------------------------------------------------------------------ */
  /*                      YETKİ KONTROLÜ / AUTH CHECK                    */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /*                      STATÜ GÜNCELLEME FONKSİYONU                    */
  /* ------------------------------------------------------------------ */
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

    toast({
      title: "Status updated",
      description: `Student ID ${id} status changed to ${status} by ${role}`,
      variant: status === "Denied" ? "destructive" : "default",
    });
  };

  if (!user) return null;

  /* ------------------------------------------------------------------ */
  /*                                UI                                  */
  /* ------------------------------------------------------------------ */
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* -------------------- Sidebar -------------------- */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* ----------------- Main Content ------------------ */}
      <div className="flex-1">
        <Navbar
          userName={user.name}
          onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="max-w-4xl mx-auto py-10 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Graduation Approval
              </CardTitle>

              {/* --- Arama kutusu --- */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search student by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded px-3 py-1 w-full max-w-xs"
                />
              </div>
            </CardHeader>

            {/* ------------------- Öğrenci Listesi ------------------- */}
            <CardContent className="space-y-4">
              {students
                .filter((s) =>
                  s.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((student) => {
                  const {
                    advisorStatus,
                    departmentSecretaryStatus,
                    facultyDeansOfficeStatus,
                    studentAffairsStatus,
                  } = student;

                  /* ------ Kullanıcının mevcut rolünün statüsü ------ */
                  const currentStatus =
                    user.role === "advisor"
                      ? advisorStatus
                      : user.role === "departmentSecretary"
                      ? departmentSecretaryStatus
                      : user.role === "facultyDeansOffice"
                      ? facultyDeansOfficeStatus
                      : studentAffairsStatus;

                  /* ------ Önceki adım onaylandı mı? ------ */
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

                      {/* ------------ Durum Satırları ------------ */}
                      <div className="flex flex-col mt-2 space-y-2">
                        {[
                          {
                            label: "Advisor",
                            status: advisorStatus,
                          },
                          {
                            label: "Department Secretary",
                            status: departmentSecretaryStatus,
                          },
                          {
                            label: "Faculty Dean's Office",
                            status: facultyDeansOfficeStatus,
                          },
                          {
                            label: "Student Affairs",
                            status: studentAffairsStatus,
                          },
                        ].map((item, idx) => (
                          <div
                            key={item.label}
                            className="flex items-center space-x-2"
                          >
                            <span>
                              {item.status === "Approved"
                                ? "✅"
                                : item.status === "Denied"
                                ? "❌"
                                : "⏳"}
                            </span>
                            <span className="font-bold text-gray-700">
                              {idx + 1}.
                            </span>
                            <span className="font-semibold">
                              {item.label}:
                            </span>
                            <span
                              className={
                                item.status === "Approved"
                                  ? "text-green-600 font-bold"
                                  : item.status === "Denied"
                                  ? "text-red-600 font-bold"
                                  : "text-gray-500"
                              }
                            >
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* ------------ Aksiyon Butonları ------------ */}
                      {canTakeAction && (
                        <div className="space-x-2 mt-3">
                          <button
                            onClick={() =>
                              setConfirmModal({
                                open: true,
                                studentId: student.id,
                                action: "Approved",
                              })
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              setConfirmModal({
                                open: true,
                                studentId: student.id,
                                action: "Denied",
                              })
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Deny
                          </button>
                        </div>
                      )}
                      {/* -------- Show Transcript Button -------- */}
                      <div className="mt-2">
                        <button
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                          onClick={() => setTranscriptModal({ open: true, student })}
                        >
                          Show Transcript
                        </button>
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* =========================================================== */}
      {/*                         Confirm Modal                       */}
      {/* =========================================================== */}
      {confirmModal.open && (
        <>
          {/* -------- Karartma + Blur Katmanı -------- */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            aria-hidden="true"
            onClick={() =>
              setConfirmModal({ open: false, studentId: null, action: null })
            } // dışarı tıklayınca da kapansın
          />

          {/* --------------- Modal Kutusu --------------- */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
              <div className="text-lg font-semibold mb-4">
                {confirmModal.action === "Approved"
                  ? "Are you sure you want to approve this student?"
                  : "Are you sure you want to deny this student?"}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() =>
                    setConfirmModal({
                      open: false,
                      studentId: null,
                      action: null,
                    })
                  }
                >
                  Cancel
                </button>

                <button
                  className={
                    confirmModal.action === "Approved"
                      ? "px-4 py-2 rounded bg-green-800 text-white hover:bg-green-900 shadow-lg font-semibold"
                      : "px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  }
                  onClick={() => {
                    if (confirmModal.studentId && confirmModal.action) {
                      updateStatus(
                        confirmModal.studentId,
                        user.role,
                        confirmModal.action
                      );
                    }
                    setConfirmModal({
                      open: false,
                      studentId: null,
                      action: null,
                    });
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================== */}
      {/*                      Transcript Modal                      */}
      {/* =========================================================== */}
      {transcriptModal.open && transcriptModal.student && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            aria-hidden="true"
            onClick={() => setTranscriptModal({ open: false, student: null })}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">Transcript - {transcriptModal.student.name}</div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setTranscriptModal({ open: false, student: null })}
                >
                  Close
                </button>
              </div>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Course</th>
                    <th className="p-2 text-left">Grade</th>
                    <th className="p-2 text-left">ECTS</th>
                  </tr>
                </thead>
                <tbody>
                  {transcriptModal.student.transcript.map((t, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{t.code}</td>
                      <td className="p-2">{t.name}</td>
                      <td className="p-2">{t.grade}</td>
                      <td className="p-2">{t.ects}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
