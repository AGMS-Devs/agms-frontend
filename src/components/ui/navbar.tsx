import {
  FiLogOut,
  FiClipboard,
  FiBell,
  FiUser,
  FiGlobe,
  FiMenu,
  FiSettings,
  FiAward,
} from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { t, setLanguage, getLanguage } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import { fetchInboxMessages } from "@/services/messageService";
import MessageModal from "./MessageModal";

interface NavbarProps {
  userName: string;
  onSidebarToggle: () => void;
  isSidebarOpen?: boolean;
}

export function Navbar({ userName, onSidebarToggle, isSidebarOpen }: NavbarProps) {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "tr">(getLanguage());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [previewMessages, setPreviewMessages] = useState<any[]>([]);

  const user = authService.getCurrentUser();
  const userId = user?.id;
  const isAdvisor = user?.role === "advisor";
  const isStudent = user?.role === "student";

  const handleLanguageChange = (newLang: "en" | "tr") => {
    setLang(newLang);
    setLanguage(newLang);
  };

  useEffect(() => {
    if (!isStudent || !userId) return;

    fetchInboxMessages(userId).then((messages) => {
      const unreadExists = messages.some((msg: any) => msg.status === "unread");
      setHasUnread(unreadExists);
      setPreviewMessages(messages.slice(0, 3));
    });
  }, [userId]);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Only show hamburger when sidebar is closed */}
        {!isSidebarOpen && (
          <button 
            onClick={onSidebarToggle}
            className="p-2 rounded hover:bg-gray-100"
          >
            <FiMenu size={22} />
          </button>
        )}
        {/* Logo ve metin kısmı */}
        <div className="flex items-center gap-2">
          <img
            src="/iztech-logo.png"
            alt="IZTECH Logo"
            className="h-9 w-9 object-contain"
          />
          <Link
            href="/home"
            className={cn(
              "font-bold text-lg tracking-tight text-black transition-all",
              isSidebarOpen ? "hidden sm:inline" : "inline"
            )}
          >
            IZTECH - AGMS
          </Link>
        </div>
      </div>


      <div className="flex items-center gap-4">
        {/* 🔔 Bildirim çanı - dropdown ile preview gösterimi */}
        {isStudent && (
          <DropdownMenu>
            <DropdownMenuTrigger className="relative p-2 rounded hover:bg-gray-100">
              <FiBell size={20} />
              {hasUnread && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 max-h-96 overflow-auto p-2"
            >
              {previewMessages.length === 0 ? (
                <p className="text-sm text-gray-500 px-2 py-1">No messages</p>
              ) : (
                previewMessages.map((msg) => (
                  <div key={msg.id} className="text-sm border-b py-2">
                    <p className="font-medium">From: {msg.senderId}</p>
                    <p className="text-gray-700 line-clamp-2">{msg.body}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
              <DropdownMenuItem
                onClick={() => router.push("/messages/inbox")}
                className="cursor-pointer text-blue-600 text-sm justify-center mt-2"
              >
                View all messages
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* ✉️ Advisor için mesaj gönderme */}
        {isAdvisor && (
          <>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Send Message
            </button>
            <MessageModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSend={({ receiverId, body, file }) => {
                const formData = new FormData();
                formData.append("receiverId", receiverId);
                formData.append("body", body);
                if (file) formData.append("file", file);

                fetch("/api/messages", {
                  method: "POST",
                  body: formData,
                })
                  .then(() => alert("Message delivered."))
                  .catch(() => alert("Error sending message."));
                setIsModalOpen(false);
              }}
            />
          </>
        )}

        {/* 🌐 Dil seçici */}
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded hover:bg-gray-100">
            <FiGlobe size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-24">
            <DropdownMenuItem
              onClick={() => handleLanguageChange("en")}
              className={cn("cursor-pointer", lang === "en" && "bg-gray-100")}
            >
              🇬🇧 ENG
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleLanguageChange("tr")}
              className={cn("cursor-pointer", lang === "tr" && "bg-gray-100")}
            >
              🇹🇷 TR
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 👤 Kullanıcı menüsü */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 cursor-pointer">
            <FiUser size={20} />
            <span className="font-medium text-sm">{userName}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer"
            >
              <FiSettings className="mr-2 h-4 w-4" />
              <span>{t("common.settings")}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                authService.logout();
                router.push("/");
              }}
              className="cursor-pointer text-[#8B0000]"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              <span>{t("common.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
