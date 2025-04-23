'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { t, setLanguage, getLanguage } from "@/lib/i18n"
import { authenticate } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Türkçe'ye geçiş
setLanguage('tr');

// İngilizce'ye geçiş
setLanguage('en');

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [lang, setLang] = useState<'en' | 'tr'>(getLanguage())

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
  }

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError(t('auth.login.error.invalidEmail'))
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      setEmailError(t('auth.login.error.invalidEmail'))
      return
    }

    setIsLoading(true)

    try {
      const response = await authenticate(email, password)
      if (response.success) {
        router.push('/dashboard')
      } else {
        toast({
          variant: "destructive",
          title: t('auth.login.error.title'),
          description: t('auth.login.error.message'),
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: t('auth.login.error.title'),
        description: t('auth.login.error.message'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = (newLang: 'en' | 'tr') => {
    setLang(newLang)
    setLanguage(newLang)
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/graduation-bg.jpg')`,
        backdropFilter: 'blur(4px)'
      }}
    >
      <Toaster />
      {/* Language switcher - positioned in the top-right corner */}
      <div className="absolute right-6 top-6 z-50">
        <div className="flex overflow-hidden rounded-md bg-black/30 backdrop-blur-sm">
          <button
            onClick={() => handleLanguageChange('tr')}
            className={cn(
              "px-3 py-1 text-sm font-medium transition-colors",
              lang === 'tr' ? "bg-white text-black" : "text-white hover:bg-white/10 cursor-pointer"
            )}
          >
            TR
          </button>
          <button
            onClick={() => handleLanguageChange('en')}
            className={cn(
              "px-3 py-1 text-sm font-medium transition-colors",
              lang === 'en' ? "bg-white text-black" : "text-white hover:bg-white/10 cursor-pointer"
            )}
          >
            EN
          </button>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex min-h-screen flex-col justify-center p-4 md:p-8">
        <div className="mx-auto w-full max-w-[480px] -mt-20">
          <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000]/5 to-transparent" />
            <div className="relative p-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative h-40 w-40 transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/iztech-logo.png"
                    alt="IZTECH Logo"
                    width={160}
                    height={160}
                    className="h-full w-full object-contain"
                  />
                </div>

                <h1 className="text-center text-2xl font-semibold text-gray-900 whitespace-pre-line">
                  {t('auth.login.title')}
                </h1>

                <div className="w-full space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        {t('auth.login.email')}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        className={cn(
                          "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20",
                          emailError && "border-red-500 focus:ring-red-500/20"
                        )}
                        disabled={isLoading}
                        required
                      />
                      {emailError && (
                        <p className="mt-1 text-xs text-red-500">
                          {emailError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                          {t('auth.login.password')}
                        </Label>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-[#8B0000] hover:text-[#660000] transition-colors"
                        >
                          {t('auth.login.forgotPassword')}
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn(
                          "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20"
                        )}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="relative w-full overflow-hidden bg-[#8B0000] transition-all duration-300 hover:bg-[#660000] cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.loading')}
                        </>
                      ) : (
                        t('auth.login.submit')
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 