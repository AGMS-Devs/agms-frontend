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
  gpa: number;
  isEligible: boolean;
  invitationSent: boolean;
}

const dummyStudents: Student[] = [
  { id: 1, name: "Ayşe Yıldız", gpa: 3.75, isEligible: true, invitationSent: false },
  { id: 2, name: "Mehmet Acar", gpa: 2.98, isEligible: true, invitationSent: false },
  { id: 3, name: "Ali Ural", gpa: 2.95, isEligible: false, invitationSent: false },
];

export default function GraduationCeremonyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== "studentAffairs") {
      router.push("/unauthorized");
    } else {
      setUser(currentUser);
      setStudents([...dummyStudents]);
    }
  }, [router]);

  const handleSendInvitations = () => {
    const updated = students.map(s => ({ ...s, invitationSent: true }));
    setStudents(updated);
    alert("Invitations sent to all eligible students.");
  };

  const handleApproveList = () => {
    alert("Graduation ceremony list approved successfully.");
  };

  if (!user) return null;

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
        <main className="max-w-4xl w-full mx-auto py-10 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Graduation Ceremony Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">GPA</th>
                    <th className="p-2 text-left">Eligible?</th>
                    <th className="p-2 text-left">Invitation Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr key={s.id} className="border-b">
                      <td className="p-2">{s.id}</td>
                      <td className="p-2">{s.name}</td>
                      <td className="p-2">{s.gpa.toFixed(2)}</td>
                      <td className="p-2">{s.isEligible ? "✅" : "❌"}</td>
                      <td className="p-2">{s.invitationSent ? "✅" : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSendInvitations} className="bg-sky-700 hover:bg-sky-800">
                  Generate Invitations
                </Button>
                <Button onClick={handleApproveList} className="bg-gray-600 hover:bg-gray-700">
                  Approve List
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
