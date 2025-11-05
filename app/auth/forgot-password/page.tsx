"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, ArrowRight, Mail } from "lucide-react";

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
      <div className="min-h-screen bg-white">
        <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-16">
          <div className="w-full max-w-md space-y-12">
            {/* Header */}
            <div className="space-y-6 text-center">
              <Link
                href="/"
                className="inline-block text-xl font-light tracking-wider text-neutral-900"
              >
                VOLLE
              </Link>
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                  <Mail
                    className="h-6 w-6 text-neutral-900"
                    strokeWidth={1.5}
                  />
                </div>
                <h1 className="text-3xl font-light text-neutral-900 md:text-4xl">
                  Check your email
                </h1>
                <p className="text-sm text-neutral-600">
                  Password reset instructions have been sent
                </p>
              </div>
            </div>

            {/* Success Content */}
            <div className="border-t border-neutral-300 pt-12">
              <Alert className="border-neutral-300 bg-neutral-50">
                <AlertDescription className="text-sm leading-relaxed text-neutral-900">
                  We&apos;ve sent password reset instructions to{" "}
                  <strong className="font-normal">{email}</strong>. Please check
                  your email and follow the link to reset your password.
                </AlertDescription>
              </Alert>

              <div className="mt-8 space-y-4">
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  className="h-12 w-full border border-neutral-300 bg-white text-sm font-normal text-neutral-900 hover:bg-neutral-50"
                >
                  Send another email
                </Button>

                <Link href="/auth/login" className="block">
                  <Button
                    variant="ghost"
                    className="h-12 w-full text-sm font-normal text-neutral-900 hover:bg-neutral-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.5} />
                    Back to sign in
                  </Button>
                </Link>
              </div>
            </div>

            {/* Help Text */}
            <div className="border-t border-neutral-300 pt-8 text-center text-sm text-neutral-600">
              <p>
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  className="border-b border-neutral-900 font-normal text-neutral-900 transition-colors hover:border-neutral-600 hover:text-neutral-600"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-12">
          {/* Header */}
          <div className="space-y-6 text-center">
            <Link
              href="/"
              className="inline-block text-xl font-light tracking-wider text-neutral-900"
            >
              VOLLE
            </Link>
            <div className="space-y-2">
              <h1 className="text-3xl font-light text-neutral-900 md:text-4xl">
                Reset your password
              </h1>
              <p className="text-sm text-neutral-600">
                Enter your email and we&apos;ll send you reset instructions
              </p>
            </div>
          </div>

          {/* Reset Form */}
          <div className="border-t border-neutral-300 pt-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Alert */}
              {error && (
                <Alert className="border-neutral-300 bg-red-300">
                  <AlertDescription className="text-sm text-neutral-900">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-normal text-neutral-900"
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
                  className="border-neutral-300 bg-transparent focus:border-neutral-900"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="group h-12 w-full bg-neutral-900 text-sm font-normal text-white hover:bg-neutral-800"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send reset instructions
                    <ArrowRight
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </>
                )}
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" strokeWidth={1.5} />
                  Back to sign in
                </Link>
              </div>
            </form>
          </div>

          {/* Additional Help */}
          <div className="border-t border-neutral-300 pt-8 text-center">
            <p className="text-sm text-neutral-600">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="border-b border-neutral-900 font-normal text-neutral-900 transition-colors hover:border-neutral-600 hover:text-neutral-600"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
