'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { t, setLanguage, getLanguage } from "@/lib/i18n"
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { register as registerUser, authenticate, sendPasswordResetCode } from '@/lib/auth'

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [lang, setLang] = useState<'en' | 'tr'>(getLanguage())

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginIsLoading, setLoginIsLoading] = useState(false)
  const [loginEmailError, setLoginEmailError] = useState('')

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotIsLoading, setForgotIsLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')

  // Register state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [registerErrors, setRegisterErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [registerIsLoading, setRegisterIsLoading] = useState(false)

  // Validation helpers
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  const validatePassword = (password: string) => password.length >= 8

  // Login handlers
  const handleLoginEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginEmail(e.target.value)
    if (loginEmailError) setLoginEmailError('')
  }
  const handleLoginEmailBlur = () => {
    if (loginEmail && !validateEmail(loginEmail)) {
      setLoginEmailError('Invalid email address')
    } else {
      setLoginEmailError('')
    }
  }
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(loginEmail)) {
      setLoginEmailError('Invalid email address')
      return
    }
    setLoginIsLoading(true)
    try {
      const data = await authenticate(loginEmail, loginPassword)
      if (data.success) {
        toast({ title: 'Login successful' })
        router.push('/home')
      } else {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: data.error || 'Invalid credentials.'
        })
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'An unexpected error occurred.'
      })
    } finally {
      setLoginIsLoading(false)
    }
  }

  // Register handlers
  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData(prev => ({ ...prev, [name]: value }))
    if (registerErrors[name as keyof typeof registerErrors]) {
      setRegisterErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  const handleRegisterBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'email' && value && !validateEmail(value)) {
      setRegisterErrors(prev => ({ ...prev, email: 'Invalid email address' }))
    }
    if (name === 'password' && value && !validatePassword(value)) {
      setRegisterErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }))
    }
    if (name === 'confirmPassword' && value && value !== registerData.password) {
      setRegisterErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
    }
  }
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = {
      email: !validateEmail(registerData.email) ? 'Invalid email address' : '',
      password: !validatePassword(registerData.password) ? 'Password must be at least 8 characters' : '',
      confirmPassword: registerData.password !== registerData.confirmPassword ? 'Passwords do not match' : '',
      firstName: !registerData.firstName ? 'First name is required' : '',
      lastName: !registerData.lastName ? 'Last name is required' : ''
    }
    setRegisterErrors(newErrors)
    if (Object.values(newErrors).some(error => error)) {
      return
    }
    setRegisterIsLoading(true)
    try {
      const result = await registerUser(
        registerData.email,
        registerData.password,
        registerData.firstName,
        registerData.lastName
      );
      if (result.success) {
        toast({
          title: 'Registration successful',
          description: 'You can now log in with your credentials.'
        })
        setMode('login')
      } else {
        toast({
          variant: 'destructive',
          title: 'Registration failed',
          description: result.error || 'You are not in the 4th-year student list or another error occurred.'
        })
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: 'An unexpected error occurred.'
      })
    } finally {
      setRegisterIsLoading(false)
    }
  }

  // Forgot password handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(forgotEmail)) {
      setForgotError('Invalid email address')
      return
    }
    setForgotIsLoading(true)
    try {
      const result = await sendPasswordResetCode(forgotEmail)
      if (result.success) {
        toast({
          title: 'Success',
          description: 'New password has been sent to your email.'
        })
        setMode('login')
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to reset password',
          description: result.error || 'Failed to send reset code.'
        })
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to reset password',
        description: 'An unexpected error occurred.'
      })
    } finally {
      setForgotIsLoading(false)
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
                  {mode === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="loginEmail" className="text-sm font-medium">
                          {t('auth.login.email')}
                        </Label>
                        <Input
                          id="loginEmail"
                          type="email"
                          value={loginEmail}
                          onChange={handleLoginEmailChange}
                          onBlur={handleLoginEmailBlur}
                          className={cn(
                            "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20",
                            loginEmailError && "border-red-500 focus:ring-red-500/20"
                          )}
                          disabled={loginIsLoading}
                          required
                        />
                        {loginEmailError && (
                          <p className="mt-1 text-xs text-red-500">
                            {loginEmailError}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="loginPassword" className="text-sm font-medium">
                          {t('auth.login.password')}
                          </Label>
                          <button
                            type="button"
                            onClick={() => setMode('forgot')}
                            className="text-xs text-[#8B0000] hover:text-[#660000] transition-colors cursor-pointer underline"
                          >
                            {t('auth.login.forgotPassword')}
                          </button>
                        </div>
                        <Input
                          id="loginPassword"
                          type="password"
                          value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)}
                          className={cn(
                            "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20"
                          )}
                          disabled={loginIsLoading}
                          required
                        />
                      </div>
                        <Button
                        type="submit"
                        className="relative w-full overflow-hidden bg-[#8B0000] transition-all duration-300 hover:bg-[#660000] cursor-pointer"
                        disabled={loginIsLoading}
                        >
                        {loginIsLoading ? (
                          <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('auth.login.logginIn')}
                          </>
                        ) : (
                            t('auth.login.login')
                        )}
                        </Button>
                      <div className="text-center text-sm mt-2">
                        <span className="text-gray-600">
                          {t('auth.login.noAccount')}
                        </span>{' '}
                        <button
                          type="button"
                          className="text-[#8B0000] hover:text-[#660000] transition-colors underline cursor-pointer"
                          onClick={() => setMode('register')}
                        >
                          {t('auth.login.register')}
                        </button>
                      </div>
                    </form>
                  ) : mode === 'register' ? (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-medium">
                            {t('auth.login.firstName')}
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={registerData.firstName}
                            onChange={handleRegisterInputChange}
                            onBlur={handleRegisterBlur}
                            className={cn(
                              "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20",
                              registerErrors.firstName && "border-red-500 focus:ring-red-500/20"
                            )}
                            disabled={registerIsLoading}
                            required
                          />
                          {registerErrors.firstName && (
                            <p className="mt-1 text-xs text-red-500">
                              {registerErrors.firstName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-medium">
                            {t('auth.login.lastName')}
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={registerData.lastName}
                            onChange={handleRegisterInputChange}
                            onBlur={handleRegisterBlur}
                            className={cn(
                              "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20",
                              registerErrors.lastName && "border-red-500 focus:ring-red-500/20"
                            )}
                            disabled={registerIsLoading}
                            required
                          />
                          {registerErrors.lastName && (
                            <p className="mt-1 text-xs text-red-500">
                              {registerErrors.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registerEmail" className="text-sm font-medium">
                          {t('auth.login.email')}
                        </Label>
                        <Input
                          id="registerEmail"
                          name="email"
                          type="email"
                          value={registerData.email}
                          onChange={handleRegisterInputChange}
                          onBlur={handleRegisterBlur}
                          className={cn(
                            "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20",
                            registerErrors.email && "border-red-500 focus:ring-red-500/20"
                          )}
                          disabled={registerIsLoading}
                          required
                        />
                        {registerErrors.email && (
                          <p className="mt-1 text-xs text-red-500">
                            {registerErrors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registerPassword" className="text-sm font-medium">
                        {t('auth.login.password')}
                        </Label>
                        <Input
                          id="registerPassword"
                          name="password"
                          type="password"
                          value={registerData.password}
                          onChange={handleRegisterInputChange}
                          onBlur={handleRegisterBlur}
                          className={cn(
                            "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20",
                            registerErrors.password && "border-red-500 focus:ring-red-500/20"
                          )}
                          disabled={registerIsLoading}
                          required
                        />
                        {registerErrors.password && (
                          <p className="mt-1 text-xs text-red-500">
                            {registerErrors.password}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                        {t('auth.login.confirmPassword')}
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterInputChange}
                          onBlur={handleRegisterBlur}
                          className={cn(
                            "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20",
                            registerErrors.confirmPassword && "border-red-500 focus:ring-red-500/20"
                          )}
                          disabled={registerIsLoading}
                          required
                        />
                        {registerErrors.confirmPassword && (
                          <p className="mt-1 text-xs text-red-500">
                            {registerErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="relative w-full overflow-hidden bg-[#8B0000] transition-all duration-300 hover:bg-[#660000] cursor-pointer"
                        disabled={registerIsLoading}
                      >
                        {registerIsLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('auth.login.registering')}
                          </>
                        ) : (
                          t('auth.login.register')
                        )}
                      </Button>
                      <div className="text-center text-sm mt-2">
                        <span className="text-gray-600">
                          {t('auth.login.haveAccount')}
                        </span>{' '}
                        <button
                          type="button"
                          className="text-[#8B0000] hover:text-[#660000] transition-colors underline cursor-pointer"
                          onClick={() => setMode('login')}
                        >
                          {t('auth.login.login')}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgotEmail" className="text-sm font-medium">
                          {t('auth.login.email')}
                        </Label>
                        <Input
                          id="forgotEmail"
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => {
                            setForgotEmail(e.target.value)
                            setForgotError('')
                          }}
                          className={cn(
                            "transition-all duration-200 focus:ring-2 focus:ring-[#8B0000]/20",
                            forgotError && "border-red-500 focus:ring-red-500/20"
                          )}
                          disabled={forgotIsLoading}
                          required
                        />
                        {forgotError && (
                          <p className="mt-1 text-xs text-red-500">
                            {forgotError}
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="relative w-full overflow-hidden bg-[#8B0000] transition-all duration-300 hover:bg-[#660000] cursor-pointer"
                        disabled={forgotIsLoading}
                      >
                        {forgotIsLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('auth.login.sending')}
                          </>
                        ) : (
                          t('auth.login.sendNewPassword')
                        )}
                      </Button>
                      <div className="text-center text-sm mt-2">
                        <button
                          type="button"
                          className="text-[#8B0000] hover:text-[#660000] transition-colors underline cursor-pointer"
                          onClick={() => setMode('login')}
                        >
                          {t('auth.login.backToLogin')}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
