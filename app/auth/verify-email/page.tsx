"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, CheckCircle, ArrowRight, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/components/auth/auth-provider'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const { resetPassword, loading } = useAuth()
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResendEmail = async () => {
    if (!email || countdown > 0) return
    
    setResendStatus('sending')
    try {
      // Use the resetPassword function to resend verification
      // In a real app, you'd have a dedicated resend verification endpoint
      const result = await resetPassword(email)
      
      if (result.success) {
        setResendStatus('sent')
        setCountdown(60) // 60 second cooldown
        setTimeout(() => setResendStatus('idle'), 3000)
      } else {
        setResendStatus('error')
        setTimeout(() => setResendStatus('idle'), 3000)
      }
    } catch (error) {
      setResendStatus('error')
      setTimeout(() => setResendStatus('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative z-10 container mx-auto flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8 md:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full p-6">
                  <Mail className="h-12 w-12" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Check Your Email
              </h1>
              <p className="text-slate-600 text-lg">
                We've sent a verification link to
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
                  Please check your email and click the verification link to activate your account.
                </AlertDescription>
              </Alert>

              <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  Next Steps:
                </h3>
                <ol className="space-y-2 text-slate-600 text-sm ml-7 list-decimal">
                  <li>Open your email inbox</li>
                  <li>Look for an email from Volle</li>
                  <li>Click the verification link in the email</li>
                  <li>You'll be redirected to login</li>
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-800 text-sm">
                  <strong className="font-semibold">Can't find the email?</strong> Check your spam or junk folder.
                </p>
              </div>
            </div>

            {/* Resend Button */}
            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                disabled={resendStatus === 'sending' || countdown > 0 || !email}
                variant={resendStatus === 'sent' ? 'default' : 'outline'}
                className={`w-full ${
                  resendStatus === 'sent'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : ''
                }`}
              >
                {resendStatus === 'sending' ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendStatus === 'sent' ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Email Sent!
                  </>
                ) : countdown > 0 ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend in {countdown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              {resendStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to resend email. Please try again later.
                  </AlertDescription>
                </Alert>
              )}

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
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
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

