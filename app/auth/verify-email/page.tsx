"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, CheckCircle, ArrowRight, RefreshCw, Loader2, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/components/auth/auth-provider'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')
  const { verifyOTP, resendOTP, loading } = useAuth()
  const [otpCode, setOtpCode] = useState('')
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6) // Only numbers, max 6 digits
    setOtpCode(value)
    setError('')
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email is required')
      return
    }

    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP code')
      return
    }

    setVerifyStatus('verifying')
    setError('')

    try {
      const result = await verifyOTP(email, otpCode, 'signup')
      
      if (result.success) {
        setVerifyStatus('success')
        // Redirect to signup success page after a brief delay
        setTimeout(() => {
          router.push('/auth/signup-success')
        }, 1500)
      } else {
        setVerifyStatus('error')
        setError(result.error || 'Invalid OTP code. Please try again.')
      }
    } catch (err) {
      setVerifyStatus('error')
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleResendOTP = async () => {
    if (!email || countdown > 0) return
    
    setResendStatus('sending')
    setError('')
    
    try {
      const result = await resendOTP(email)
      
      if (result.success) {
        setResendStatus('sent')
        setCountdown(60) // 60 second cooldown
        setTimeout(() => setResendStatus('idle'), 3000)
      } else {
        setResendStatus('error')
        setError(result.error || 'Failed to resend OTP. Please try again.')
        setTimeout(() => setResendStatus('idle'), 3000)
      }
    } catch (error) {
      setResendStatus('error')
      setError('Failed to resend OTP. Please try again.')
      setTimeout(() => setResendStatus('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative z-10 container mx-auto flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8 md:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
                <div className="relative bg-linear-to-br from-emerald-500 to-teal-600 text-white rounded-full p-6">
                  <KeyRound className="h-12 w-12" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Enter Verification Code
              </h1>
              <p className="text-slate-600 text-lg">
                We&apos;ve sent a 6-digit code to
              </p>
              {email && (
                <p className="text-emerald-600 font-semibold text-lg mt-2 break-all">
                  {email}
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className="space-y-4 mb-8">
              <Alert className="bg-emerald-50 border-emerald-200">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <AlertDescription className="text-slate-700 ml-2">
                  <strong className="font-semibold">Account created successfully!</strong>
                  <br />
                  Please enter the verification code from your email to activate your account.
                </AlertDescription>
              </Alert>
            </div>

            {/* OTP Input Form */}
            <form onSubmit={handleVerifyOTP} className="space-y-6 mb-8">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-900 font-medium">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={otpCode}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-3xl font-bold tracking-widest h-16 text-slate-900"
                  disabled={verifyStatus === 'verifying' || verifyStatus === 'success'}
                  autoFocus
                />
                <p className="text-sm text-slate-500 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {verifyStatus === 'success' && (
                <Alert className="bg-emerald-50 border-emerald-200">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <AlertDescription className="text-emerald-800">
                    Email verified successfully! Redirecting...
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={verifyStatus === 'verifying' || verifyStatus === 'success' || !otpCode || otpCode.length !== 6}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
              >
                {verifyStatus === 'verifying' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : verifyStatus === 'success' ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Verified!
                  </>
                ) : (
                  <>
                    Verify Email
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Resend OTP */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-3">
                  Didn&apos;t receive the code?
                </p>
                <Button
                  onClick={handleResendOTP}
                  disabled={resendStatus === 'sending' || countdown > 0 || !email}
                  variant="outline"
                  className="w-full"
                >
                  {resendStatus === 'sending' ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : resendStatus === 'sent' ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Code Sent!
                    </>
                  ) : countdown > 0 ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend in {countdown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Code
                    </>
                  )}
                </Button>
              </div>

              <Link href="/auth/login" className="block">
                <Button variant="ghost" className="w-full group">
                  Back to Login
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-center text-sm text-slate-500">
                Need help?{' '}
                <Link
                  href="/contact"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative z-10 container mx-auto flex min-h-screen items-center justify-center px-6 py-16">
            <div className="w-full max-w-lg">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8 md:p-12">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
                </div>
                <p className="text-center text-slate-600 mt-4">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
