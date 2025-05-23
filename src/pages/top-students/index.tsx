"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { User } from "@/services/users.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import "@/app/globals.css";

interface Student {
  id: number;
  name: string;
  surname: string;
  department: string;
  faculty: string;
  gpa: number;
  isEligible: boolean;
  invitationSent: boolean;
}

const dummyStudents: Student[] = [
  {
    id: 1,
    name: "Serhat",
    surname: "Evren",
    department: "Computer Engineering",
    faculty: "Engineering",
    gpa: 3.95,
    isEligible: true,
    invitationSent: false,
  },
  {
    id: 2,
    name: "Zeynep",
    surname: "Demir",
    department: "Mechanical Engineering",
    faculty: "Engineering",
    gpa: 3.95,
    isEligible: true,
    invitationSent: false,
  },
  {
    id: 3,
    name: "Burak",
    surname: "Aydın",
    department: "Architecture",
    faculty: "Architecture",
    gpa: 3.91,
    isEligible: true,
    invitationSent: false,
  },
  {
    id: 4,
    name: "Nadir Can",
    surname: "Değirmendere",
    department: "Computer Engineering",
    faculty: "Engineering",
    gpa: 3.9,
    isEligible: true,
    invitationSent: false,
  },
  {
    id: 5,
    name: "Fatma",
    surname: "Çelik",
    department: "Electrical Engineering",
    faculty: "Engineering",
    gpa: 3.88,
    isEligible: true,
    invitationSent: false,
  },
  {
    id: 6,
    name: "Deniz",
    surname: "Yıldız",
    department: "Physics",
    faculty: "Science",
    gpa: 3.86,
    isEligible: true,
    invitationSent: false,
  },
];

const faculties = ["All Students", "Engineering", "Architecture", "Science"];

export default function TopStudentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState("All Students");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [listApproved, setListApproved] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== "studentAffairs") {
      router.push("/unauthorized");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const handlePrepareList = () => {
    const sorted = [...dummyStudents].sort((a, b) => b.gpa - a.gpa);
    setStudents(sorted);
  };

  const handleApproveList = () => {
    setShowConfirmModal(true);
  };

  const confirmApproval = () => {
    setListApproved(true);
    setShowConfirmModal(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.push("/");
  };

  const sendToRectorate = async () => {
    try {
      const response = await fetch("/api/send-to-rectorate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(students),
      });

      if (response.ok) {
        alert("List has been sent to the Rectorate.");
      } else {
        alert("Failed to send the list.");
      }
    } catch (error) {
      console.error("Send error:", error);
      alert("Error while sending to Rectorate.");
    }
  };

  const departmentsForSelectedFaculty =
    selectedFaculty === "All Students"
      ? []
      : Array.from(
          new Set(
            dummyStudents
              .filter((s) => s.faculty === selectedFaculty)
              .map((s) => s.department)
          )
        );

  const filteredStudents = students.filter(
    (s) =>
      selectedFaculty === "All Students" ||
      (s.faculty === selectedFaculty &&
        (!selectedDept || s.department === selectedDept))
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
        <main className="max-w-6xl w-full mx-auto py-10 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Top Students List
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Prepare and manage the top-performing students list by GPA.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-4 flex-wrap">
                {faculties.map((fac) => (
                  <Button
                    key={fac}
                    variant={selectedFaculty === fac ? "default" : "outline"}
                    onClick={() => {
                      setSelectedFaculty(fac);
                      setSelectedDept(null);
                    }}
                  >
                    {fac}
                  </Button>
                ))}
              </div>

              {departmentsForSelectedFaculty.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {departmentsForSelectedFaculty.map((dept) => (
                    <Button
                      key={dept}
                      variant={selectedDept === dept ? "default" : "outline"}
                      onClick={() => setSelectedDept(dept)}
                    >
                      {dept}
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mb-6 flex-wrap">
                <Button onClick={handlePrepareList}>Prepare List</Button>
                <Button
                  className="bg-green-700 hover:bg-green-800"
                  onClick={handleApproveList}
                >
                  Approve List
                </Button>
                {listApproved && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={sendToRectorate}
                  >
                    Send to Rectorate
                  </Button>
                )}
              </div>

              {filteredStudents.length > 0 && (
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">#</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Surname</th>
                      <th className="p-2 text-left">Faculty</th>
                      <th className="p-2 text-left">Department</th>
                      <th className="p-2 text-left">GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s, idx) => (
                      <tr key={s.id} className="border-b">
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.surname}</td>
                        <td className="p-2">{s.faculty}</td>
                        <td className="p-2">{s.department}</td>
                        <td className="p-2">{s.gpa.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Approval</h2>
            <p className="mb-6">Are you sure you want to approve this list?</p>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-green-700 hover:bg-green-800"
                onClick={confirmApproval}
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
