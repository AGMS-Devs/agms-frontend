"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FiHome,
  FiClipboard,
  FiAward,
  FiMessageSquare,
  FiSettings,
  FiChevronLeft,
} from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ className, isOpen = true, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = authService.getCurrentUser();

  const handleSeveranceRequestClick = () => {
    const role = user?.role;
    if (role === "student") router.push("/severance-requests/student");
    else if (role === "library") router.push("/severance-requests/library");
    else if (role === "sks") router.push("/severance-requests/sks");
    else if (role === "doitp") router.push("/severance-requests/doitp");
    else if (role === "career") router.push("/severance-requests/careeroffice");
    else if (role === "studentAffairs")
      router.push("/severance-requests/studentaffairs");
    else router.push("/");
  };

  const routes = (() => {
    const role = user?.role;

    if (role === "advisor") {
      return [
        { label: "Home", icon: FiHome, href: "/home", color: "text-sky-500" },
        {
          label: "Graduation Approval",
          icon: FiAward,
          href: "/graduation-approval",
          color: "text-pink-700",
        },
        {
          label: "Messages",
          icon: FiMessageSquare,
          href: "/messages/inbox",
          color: "text-orange-700",
        },
        {
          label: "Settings",
          icon: FiSettings,
          href: "/profile",
          color: "text-emerald-500",
        },
      ];
    }

    if (role === "student") {
      return [
        { label: "Home", icon: FiHome, href: "/home", color: "text-sky-500" },
        {
          label: "Severance Requests",
          icon: FiClipboard,
          onClick: handleSeveranceRequestClick,
          color: "text-violet-500",
        },
        {
          label: "Graduation Status",
          icon: FiAward,
          href: "/graduation-status",
          color: "text-pink-700",
        },
        {
          label: "Messages",
          icon: FiMessageSquare,
          href: "/messages/inbox",
          color: "text-orange-700",
        },
        {
          label: "Settings",
          icon: FiSettings,
          href: "/profile",
          color: "text-emerald-500",
        },
      ];
    }

    if (role && ["library", "sks", "doitp", "career"].includes(role)) {
      return [
        { label: "Home", icon: FiHome, href: "/home", color: "text-sky-500" },
        {
          label: "Severance Requests",
          icon: FiClipboard,
          onClick: handleSeveranceRequestClick,
          color: "text-violet-500",
        },
        {
          label: "Settings",
          icon: FiSettings,
          href: "/profile",
          color: "text-emerald-500",
        },
      ];
    }

    if (role === "studentAffairs") {
      return [
        { label: "Home", icon: FiHome, href: "/home", color: "text-sky-500" },
        {
          label: "Severance Requests",
          icon: FiClipboard,
          onClick: handleSeveranceRequestClick,
          color: "text-violet-500",
        },
        {
          label: "Graduation Approval",
          icon: FiAward,
          href: "/graduation-approval",
          color: "text-pink-700",
        },
        {
          label: "Top Students",
          icon: FiAward,
          href: "/top-students",
          color: "text-yellow-600",
        },
      ];
    }

    if (role && ["departmentSecretary", "facultyDeansOffice"].includes(role)) {
      return [
        { label: "Home", icon: FiHome, href: "/home", color: "text-sky-500" },
        {
          label: "Graduation Approval",
          icon: FiAward,
          href: "/graduation-approval",
          color: "text-pink-700",
        },
        {
          label: "Settings",
          icon: FiSettings,
          href: "/profile",
          color: "text-emerald-500",
        },
      ];
    }

    if (role === "rectorate") {
      return [
        { label: "Home", icon: FiHome, href: "/home", color: "text-sky-500" },
        {
          label: "Top Students",
          icon: FiAward,
          href: "/top-students",
          color: "text-yellow-600",
        },
        {
          label: "Settings",
          icon: FiSettings,
          href: "/profile",
          color: "text-emerald-500",
        },
      ];
    }

    return []; // unknown or unsupported role tyea safds alksdaf ksf
  })();

  return (
    <div
      className={cn(
        "h-screen w-[240px] border-r bg-white transition-all duration-700 ease-in-out",
        isOpen ? "block" : "hidden", // ya da translate-x gibi çözüm varsa devam ettir
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">Menu</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
            aria-label="Close sidebar"
          >
            <FiChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-700",
                !isOpen && "rotate-180"
              )}
            />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            {routes.map((route) =>
              route.href ? (
                <Link
                  key={route.label}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100 cursor-pointer",
                    pathname === route.href
                      ? "bg-gray-100 text-black"
                      : "text-gray-600"
                  )}
                >
                  <route.icon className={cn("h-5 w-5", route.color)} />
                  <span>{route.label}</span>
                </Link>
              ) : (
                <div
                  key={route.label}
                  onClick={route.onClick}
                  className={cn(
                    "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100 cursor-pointer",
                    "text-gray-600"
                  )}
                >
                  <route.icon className={cn("h-5 w-5", route.color)} />
                  <span>{route.label}</span>
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
