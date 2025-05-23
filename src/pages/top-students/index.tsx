"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { User } from "@/services/users.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "@/app/globals.css";

interface Student {
  id: number;
  name: string;
  surname: string;
  department: string;
  gpa: number;
  isEligible: boolean;
  invitationSent: boolean;
}

const dummyStudents: Student[] = [
  { id: 1, name: "Serhat", surname: "Evren", department: "Computer Engineering", gpa: 3.95, isEligible: true, invitationSent: false },
  { id: 2, name: "Zeynep", surname: "Demir", department: "Mechanical Engineering", gpa: 3.95, isEligible: true, invitationSent: false },
  { id: 3, name: "Burak", surname: "Aydın", department: "Chemistry", gpa: 3.91, isEligible: true, invitationSent: false },
  { id: 4, name: "Nadir Can", surname: "Değirmendere", department: "Computer Engineering", gpa: 3.90, isEligible: true, invitationSent: false },
  { id: 5, name: "Fatma", surname: "Çelik", department: "Electrical Engineering", gpa: 3.88, isEligible: true, invitationSent: false },
  { id: 6, name: "Deniz", surname: "Yıldız", department: "Physics", gpa: 3.86, isEligible: true, invitationSent: false },
];

const departments = ["All Students", "Computer Engineering", "Mechanical Engineering", "Electrical Engineering", "Chemistry", "Physics"];

export default function TopStudentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("All Students");
  const [listApproved, setListApproved] = useState(false);
  const [dataFixed, setDataFixed] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== "studentAffairs") {
      router.push("/unauthorized");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const handlePrepareList = () => {
    const hasMissingData = dummyStudents.some(s => !s.name || !s.surname || !s.gpa);
    if (hasMissingData && !dataFixed) {
      alert("Some student data is missing. Please review the records.");
    } else {
      const sorted = [...dummyStudents].sort((a, b) => b.gpa - a.gpa);
      setStudents(sorted);
    }
  };

  const handleFixData = () => {
    setDataFixed(true);
    alert("Student data updated successfully.");
  };

  const handleApproveList = () => {
    if (students.length > 0) {
      setListApproved(true);
      alert("Top Students List has been successfully saved.");
    }
  };

  const filteredStudents = selectedDept === "All Students"
    ? students
    : students.filter(s => s.department === selectedDept);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(prev => !prev)} />
      <div className="flex-1">
        <Navbar
          userName={user.name}
          onSidebarToggle={() => setIsSidebarOpen(prev => !prev)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="max-w-6xl w-full mx-auto py-10 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Top Students List</CardTitle>
              <p className="text-sm text-muted-foreground">
                Prepare and manage the top-performing students list by GPA.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-4 flex-wrap">
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={selectedDept === dept ? "default" : "outline"}
                    onClick={() => setSelectedDept(dept)}
                  >
                    {dept}
                  </Button>
                ))}
              </div>
              <div className="flex gap-3 mb-6">
                <Button onClick={handlePrepareList}>Prepare List</Button>
                <Button variant="outline" onClick={handleFixData}>Fix Data</Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={handleApproveList}>
                  Approve List
                </Button>
              </div>
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Surname</th>
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
                      <td className="p-2">{s.department}</td>
                      <td className="p-2">{s.gpa.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
