/**
 * Login Page
 * User authentication and sign-in interface
 */
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const result = await signIn(formData.email, formData.password);
      if (result.success) {
        router.push("/account");
      } else {
        setError(result.error || "Failed to sign in");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Sign in to your account
              </h1>
              <p className="text-sm text-neutral-600">
                New to Volle?{" "}
                <Link
                  href="/auth/signup"
                  className="border-b border-neutral-900 font-normal text-neutral-900 transition-colors hover:border-neutral-600 hover:text-neutral-600"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="border-t border-neutral-300 pt-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Alert */}
              {error && (
                <Alert className="border-neutral-300 bg-neutral-50">
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
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  disabled={isSubmitting || loading}
                  className="border-neutral-300 bg-transparent focus:border-neutral-900"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-sm font-normal text-neutral-900"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
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
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  Forgot your password?
                </Link>
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </>
                )}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-12 border-t border-neutral-300 pt-8 text-center">
              <p className="text-sm text-neutral-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="border-b border-neutral-900 font-normal text-neutral-900 transition-colors hover:border-neutral-600 hover:text-neutral-600"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
