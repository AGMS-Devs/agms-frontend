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
import { useToast } from "@/components/ui/use-toast";

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
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();

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
    const updated = students.map(s =>
      s.isEligible ? { ...s, invitationSent: true } : s
    );
    setStudents(updated);
    toast({
      title: "Invitations sent",
      description: "Invitations sent to all eligible students.",
      variant: "default",
    });
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
                <Button
                  onClick={() => setShowConfirm(true)}
                  className="bg-sky-700 hover:bg-sky-800"
                >
                  Generate Invitations
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      {/* Confirm Modal */}
      {showConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            aria-hidden="true"
            onClick={() => setShowConfirm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
              <div className="text-lg font-semibold mb-4">
                Are you sure you want to send invitations to all eligible students?
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800 font-semibold shadow-lg"
                  onClick={() => {
                    handleSendInvitations();
                    setShowConfirm(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
