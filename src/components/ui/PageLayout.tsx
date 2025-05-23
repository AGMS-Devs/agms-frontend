import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Sidebar } from "@/components/ui/sidebar";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  // Sidebar is closed by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = authService.getCurrentUser();
  const router = useRouter();

  if (!user) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  return (
    <div className="flex h-screen relative">
      {/* Sidebar with higher z-index */}
      <div className={isSidebarOpen ? "z-30" : "z-10"} style={{ position: 'relative' }}>
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
      <div className="flex-1 flex flex-col relative">
        {/* Navbar with highest z-index */}
        <div className="relative z-40">
          <Navbar
            userName={user.name}
            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
        {/* Overlay when sidebar is open, below sidebar and navbar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0  bg-transparent z-20 transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <main className="flex-1 overflow-auto relative z-0">{children}</main>
      </div>
    </div>
  );
} 