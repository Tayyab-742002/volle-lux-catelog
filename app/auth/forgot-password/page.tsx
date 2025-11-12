"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!email) {
      setError("Please enter your email address");
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setSuccess(true);
        setError("");
      } else {
        setError(result.error || "Failed to send reset email");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="relative z-10 container mx-auto flex min-h-screen items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <div className="mb-10 space-y-6 text-center">
              <Link href="/" className="inline-block group">
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto transition-transform group-hover:scale-105"
                />
              </Link>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Check Your Email
                </h1>
                <p className="text-sm text-gray-600">
                  Password reset instructions sent
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-300 hover:shadow-2xl transition-all duration-300">
              <Alert className="border-emerald-200 bg-emerald-50">
                <AlertDescription className="text-sm leading-relaxed text-emerald-800">
                  We&apos;ve sent password reset instructions to{" "}
                  <strong className="font-semibold">{email}</strong>. Please
                  check your email and follow the link to reset your password.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  className="h-11 w-full border border-gray-300 focus:border-border-300 bg-transparent text-sm font-semibold text-gray-900 hover:bg-emerald-50"
                >
                  Send another email
                </Button>

                <Link href="/auth/login" className="block">
                  <Button
                    variant="ghost"
                    className="h-11 w-full text-sm font-semibold ml-1 text-emerald-600 hover:bg-emerald-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={2} />
                    Back to sign in
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t-2 border-emerald-100 text-center text-sm text-gray-600">
                <p>
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    className="font-semibold ml-1 text-emerald-600 hover:text-emerald-700"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-10 space-y-6 text-center">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={120}
                height={40}
                className="h-10 w-auto transition-transform group-hover:scale-105 "
              />
            </Link>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Reset Password
              </h1>
              <p className="text-sm text-gray-600">
                Enter your email for reset instructions
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-300 hover:shadow-2xl transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-sm text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-900"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  disabled={isSubmitting || loading}
                  className="h-11 border border-gray-300 focus:border-border-300 bg-transparent focus-visible:ring-emerald-400! focus-visible:ring-1! transition-all"
                />
              </div>

              <Button
                type="submit"
                className="group h-12 w-full bg-linear-to-r from-emerald-600 to-teal-600 text-base cursor-pointer font-semibold text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send reset instructions
                    <ArrowRight
                      className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                      strokeWidth={2}
                    />
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" strokeWidth={2} />
                  Back to sign in
                </Link>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t-2 border-emerald-100 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
