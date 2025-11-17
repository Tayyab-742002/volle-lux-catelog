"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'

function SignupSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading, refreshUser } = useAuth()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    // Check if user is authenticated (email confirmed)
    const checkAuth = async () => {
      // Give it a moment for the session to be established
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Refresh user data to get latest auth state
      if (refreshUser) {
        await refreshUser()
      }
      
      setIsVerifying(false)
    }

    checkAuth()
  }, [refreshUser])

  const handleContinue = () => {
    if (user) {
      // User is authenticated, redirect to account or home
      router.push('/account')
    } else {
      // User not authenticated yet, redirect to login
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8 md:p-12">
            {isVerifying ? (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <Loader2 className="h-16 w-16 text-emerald-600 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Verifying Your Account
                </h1>
                <p className="text-slate-600">
                  Please wait while we confirm your email...
                </p>
              </div>
            ) : (
              <>
                {/* Success Icon */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-linear-to-br from-emerald-500 to-teal-600 text-white rounded-full p-6">
                      <CheckCircle className="h-12 w-12" />
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="h-6 w-6 text-emerald-500 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Heading */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Account Verified!
                  </h1>
                  <p className="text-slate-600 text-lg">
                    Your email has been confirmed successfully
                  </p>
                </div>

                {/* Success Message */}
                <div className="space-y-6 mb-8">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-emerald-900 mb-2">
                          Welcome to Bubble Wrap Shop!
                        </h3>
                        <p className="text-emerald-800 text-sm">
                          Your account has been successfully created and verified. You can now start shopping and enjoy all the benefits of being a member.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      What&apos;s Next?
                    </h3>
                    <ul className="space-y-2 text-slate-600 text-sm ml-7 list-disc">
                      <li>Browse our wide selection of bubble wrap products</li>
                      <li>Add items to your cart and checkout securely</li>
                      <li>Track your orders in your account dashboard</li>
                      <li>Save your shipping addresses for faster checkout</li>
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={handleContinue}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    size="lg"
                  >
                    {user ? 'Go to My Account' : 'Continue to Login'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full group">
                      Continue Shopping
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupSuccessPage() {
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
      <SignupSuccessContent />
    </Suspense>
  )
}


