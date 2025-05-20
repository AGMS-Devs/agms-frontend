import { FiLogOut, FiBell, FiUser, FiGlobe, FiMenu, FiSettings, FiAward } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { t, setLanguage, getLanguage } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface NavbarProps {
  userName: string;
  onLogout: () => void;
}

export function Navbar({ userName, onLogout }: NavbarProps) {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'tr'>(getLanguage());

  const handleLanguageChange = (newLang: 'en' | 'tr') => {
    setLang(newLang);
    setLanguage(newLang);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded hover:bg-gray-100">
          <FiMenu size={22} />
        </button>
        <img src="/iztech-logo.png" alt="IZTECH Logo" className="h-9 w-9 object-contain" />
        <Link href="/home" className="font-bold text-lg tracking-tight text-black hidden sm:inline ">
          IZTECH - AGMS
        </Link>

        {/* 🎓 Graduation Status Linki (navbar'da görünür) */}
        <Link
          href="/graduation-status"
          className="flex items-center gap-1 text-gray-700 hover:text-blue-700 font-medium text-sm ml-4 transition-colors duration-200"
        >
          <FiAward size={16} />
          Graduation Status
        </Link>
      </div>

      <div className="flex-1 max-w-lg mx-6 hidden md:block">
        <Input type="text" placeholder="Search..." className="bg-gray-100" />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded hover:bg-gray-100">
          <FiBell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded hover:bg-gray-100">
            <FiGlobe size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-24">
            <DropdownMenuItem 
              onClick={() => handleLanguageChange('en')} 
              className={cn("cursor-pointer", lang === 'en' && "bg-gray-100")}
            >
              🇬🇧 ENG
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleLanguageChange('tr')} 
              className={cn("cursor-pointer", lang === 'tr' && "bg-gray-100")}
            >
              🇹🇷 TR
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 cursor-pointer">
            <FiUser size={20} />
            <span className="font-medium text-sm">{userName}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
              <FiSettings className="mr-2 h-4 w-4" />
              <span>{t('common.settings')}</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-[#8B0000]">
              <FiLogOut className="mr-2 h-4 w-4" />
              <span>{t('common.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
