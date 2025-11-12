"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";

function ResetPasswordForm() {
  const router = useRouter();
  const { updatePassword, loading, user } = useAuth();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (session was set by callback)
    if (!loading && !user) {
      setError(
        "Auth session missing! Please click the reset link from your email again."
      );
    }
  }, [loading, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await updatePassword(formData.password);

      if (result.success) {
        setSuccess(true);
        setError("");
        setTimeout(() => {
          router.push(
            "/auth/login?message=Password updated successfully. Please sign in with your new password."
          );
        }, 3000);
      } else {
        setError(result.error || "Failed to update password");
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

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
                  Password Updated!
                </h1>
                <p className="text-sm text-gray-600">
                  Your password has been successfully changed
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-300 hover:shadow-2xl transition-all duration-300">
              <Alert className="border-emerald-200 bg-emerald-50">
                <AlertDescription className="text-sm leading-relaxed text-emerald-800">
                  Your password has been updated. You will be redirected to the
                  sign-in page shortly.
                </AlertDescription>
              </Alert>

              <Link href="/auth/login">
                <Button className="group h-12 w-full bg-linear-to-r from-emerald-600 to-teal-600 text-base cursor-pointer font-semibold text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                  Continue to sign in
                  <ArrowRight
                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </Button>
              </Link>
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
                className="h-10 w-auto transition-transform group-hover:scale-105  "
              />
            </Link>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Set New Password
              </h1>
              <p className="text-sm text-gray-600">
                Choose a strong password for your account
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
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-900"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a new password"
                    disabled={isSubmitting || loading}
                    className="h-11 border border-gray-300 focus:border-border-300 bg-transparent pr-10 focus-visible:ring-emerald-400! focus-visible:ring-1! transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting || loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" strokeWidth={2} />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={2} />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-gray-900"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your new password"
                    disabled={isSubmitting || loading}
                    className="h-11 border border-gray-300 focus:border-border-300 bg-transparent pr-10 focus-visible:ring-emerald-400! focus-visible:ring-1! transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting || loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" strokeWidth={2} />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="group h-12 w-full bg-linear-to-r from-emerald-600 to-teal-600 text-base cursor-pointer font-semibold text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  <>
                    Update password
                    <ArrowRight
                      className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                      strokeWidth={2}
                    />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t-2 border-emerald-100 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold ml-1 text-emerald-600 hover:text-emerald-700 transition-colors"
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
