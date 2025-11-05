"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, CheckCircle, ArrowRight } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePassword, loading } = useAuth();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for access token in URL
  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setError(
        "Invalid or expired reset link. Please request a new password reset."
      );
    }
  }, [searchParams]);

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
        // Redirect to login after 3 seconds
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
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle
                    className="h-6 w-6 text-green-600"
                    strokeWidth={1.5}
                  />
                </div>
                <h1 className="text-3xl font-light text-neutral-900 md:text-4xl">
                  Password updated
                </h1>
                <p className="text-sm text-neutral-600">
                  Your password has been successfully changed
                </p>
              </div>
            </div>

            {/* Success Content */}
            <div className="border-t border-neutral-300 pt-12">
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-sm leading-relaxed text-green-900">
                  Your password has been updated. You will be redirected to the
                  sign-in page shortly.
                </AlertDescription>
              </Alert>

              <div className="mt-8">
                <Link href="/auth/login">
                  <Button className="group h-12 w-full bg-neutral-900 text-sm font-normal text-white hover:bg-neutral-800">
                    Continue to sign in
                    <ArrowRight
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </Button>
                </Link>
              </div>
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
                Set new password
              </h1>
              <p className="text-sm text-neutral-600">
                Choose a strong password for your account
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

              {/* Password Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-sm font-normal text-neutral-900"
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
                    className="border-neutral-300 bg-transparent pr-10 focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-900"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting || loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
                <p className="text-xs text-neutral-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-normal text-neutral-900"
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
                    className="border-neutral-300 bg-transparent pr-10 focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-900"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting || loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
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
                    Updating password...
                  </>
                ) : (
                  <>
                    Update password
                    <ArrowRight
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Help Text */}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
