"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import "@/app/globals.css";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

interface Student {
  id: number;
  name: string;
  surname: string;
  department: string;
  gpa: number;
  honors: string;
}

const mockStudents: Student[] = [
  { id: 1, name: "Serhat", surname: "Evren", department: "Computer Engineering", gpa: 3.95, honors: "Summa Cum Laude" },
  { id: 2, name: "Zeynep", surname: "Demir", department: "Mechanical Engineering", gpa: 3.95, honors: "Magna Cum Laude" },
  { id: 3, name: "Burak", surname: "Aydın", department: "Chemistry", gpa: 3.91, honors: "Cum Laude" },
  { id: 4, name: "Nadir Can", surname: "Değirmendere", department: "Computer Engineering", gpa: 3.90, honors: "Summa Cum Laude" },
  { id: 5, name: "Fatma", surname: "Çelik", department: "Electrical Engineering", gpa: 3.88, honors: "" },
  { id: 6, name: "Deniz", surname: "Yıldız", department: "Physics", gpa: 3.86, honors: "" },
];

export default function RectoratePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [listReviewed, setListReviewed] = useState(false);
  const [listFinalized, setListFinalized] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleReviewList = () => {
    setStudents(mockStudents);
    setListReviewed(true);
    setMessage("");
  };

  const handleApproveList = () => {
    if (students.length > 0) {
      setListFinalized(true);
      setMessage("Top Students List has been approved and finalized.");
    }
  };
  4
  const handleLogout = async () => {
    await authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={true} onToggle={() => {}} />
      <div className="flex-1">
        <Navbar
          userName="Rectorate"
          onLogout={handleLogout}
          onSidebarToggle={() => {}}
          isSidebarOpen={true}
        />
        <main className="max-w-6xl w-full mx-auto py-10 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Rectorate - Review Top Students List</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review, approve, and finalize the list of top-performing students for graduation.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-6">
                <Button onClick={handleReviewList} disabled={listReviewed}>Review List</Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={handleApproveList} disabled={!listReviewed || listFinalized}>
                  Approve & Finalize List
                </Button>
              </div>
              {message && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>
              )}
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Surname</th>
                    <th className="p-2 text-left">Department</th>
                    <th className="p-2 text-left">GPA</th>
                    <th className="p-2 text-left">Honors</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr key={s.id} className="border-b">
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">{s.name}</td>
                      <td className="p-2">{s.surname}</td>
                      <td className="p-2">{s.department}</td>
                      <td className="p-2">{s.gpa.toFixed(2)}</td>
                      <td className="p-2">{s.honors}</td>
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