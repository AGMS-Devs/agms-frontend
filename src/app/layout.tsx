"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { authService } from "@/services/auth.service";
import { usePathname, useRouter } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser && pathname !== "/") {
      router.push("/");
    } else {
      setUser(currentUser);
    }
  }, [pathname, router]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Don't show sidebar and navbar on login page
  if (pathname === "/") {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onToggle={handleSidebarToggle}
          />
          <div className="flex-1 flex flex-col">
            {user && (
              <Navbar
                userName={user.name}
                onLogout={() => {
                  authService.logout();
                  router.push("/");
                }}
                onSidebarToggle={handleSidebarToggle}
                isSidebarOpen={isSidebarOpen}
              />
            )}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
