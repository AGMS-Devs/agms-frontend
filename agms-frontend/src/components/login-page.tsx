// src/components/login-page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [lang, setLang] = useState<'en' | 'tr'>('en')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Login attempted:', { username, password })
    } catch (err) {
      setError(lang === 'en' ? 'Invalid username or password' : 'Geçersiz kullanıcı adı veya parola')
    } finally {
      setIsLoading(false)
    }
  }

  const content = {
    en: {
      title: 'Automated Graduation System',
      username: 'Username',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      login: 'Login',
      signingIn: 'Signing in...',
    },
    tr: {
      title: 'Otomatik Mezuniyet Sistemi',
      username: 'Kullanıcı Adı',
      password: 'Parola',
      forgotPassword: 'Parolanızı mı unuttunuz?',
      login: 'Giriş Yap',
      signingIn: 'Giriş yapılıyor...',
    }
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/graduation-bg.jpg')`,
        backdropFilter: 'blur(4px)'
      }}
    >
      {/* Language switcher - positioned in the top-right corner */}
      <div className="absolute right-6 top-6 z-50">
        <div className="flex overflow-hidden rounded-md bg-black/30 backdrop-blur-sm">
          <button
            onClick={() => setLang('tr')}
            className={cn(
              "px-3 py-1 text-sm font-medium transition-colors",
              lang === 'tr' ? "bg-white text-black" : "text-white hover:bg-white/10"
            )}
          >
            TR
          </button>
          <button
            onClick={() => setLang('en')}
            className={cn(
              "px-3 py-1 text-sm font-medium transition-colors",
              lang === 'en' ? "bg-white text-black" : "text-white hover:bg-white/10"
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

                <h1 className="text-center text-2xl font-semibold text-gray-900">
                  {content[lang].title}
                </h1>

                <div className="w-full space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        {content[lang].username}
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={cn(
                          "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20",
                          error && "border-red-500 focus:ring-red-500/20"
                        )}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                          {content[lang].password}
                        </Label>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-[#8B0000] hover:text-[#660000] transition-colors"
                        >
                          {content[lang].forgotPassword}
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn(
                          "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20",
                          error && "border-red-500 focus:ring-red-500/20"
                        )}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    {error && (
                      <div className="text-sm text-red-500">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="relative w-full overflow-hidden bg-[#8B0000] transition-all duration-300 hover:bg-[#660000]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {content[lang].signingIn}
                        </>
                      ) : (
                        content[lang].login
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
