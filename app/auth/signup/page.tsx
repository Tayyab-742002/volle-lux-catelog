/**
 * Sign Up Page
 * User registration and account creation interface
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

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    company: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
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
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
      });

      if (result.success) {
        setError("");
        router.push(
          "/auth/login?message=Account created successfully. Please check your email to verify your account."
        );
      } else {
        setError(result.error || "Failed to create account");
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
                Create your account
              </h1>
              <p className="text-sm text-neutral-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="border-b border-neutral-900 font-normal text-neutral-900 transition-colors hover:border-neutral-600 hover:text-neutral-600"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Sign Up Form */}
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

              {/* Full Name Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-normal text-neutral-900"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  disabled={isSubmitting || loading}
                  className="border-neutral-300 bg-transparent focus:border-neutral-900"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-normal text-neutral-900"
                >
                  Email address <span className="text-neutral-400">*</span>
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

              {/* Phone Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="phone"
                  className="text-sm font-normal text-neutral-900"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  disabled={isSubmitting || loading}
                  className="border-neutral-300 bg-transparent focus:border-neutral-900"
                />
              </div>

              {/* Company Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="company"
                  className="text-sm font-normal text-neutral-900"
                >
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your company name"
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
                  Password <span className="text-neutral-400">*</span>
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
                    placeholder="Create a password"
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
                  Confirm Password <span className="text-neutral-400">*</span>
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
                    placeholder="Confirm your password"
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
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
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="border-b border-neutral-900 font-normal text-neutral-900 transition-colors hover:border-neutral-600 hover:text-neutral-600"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="border-t border-neutral-300 pt-8 text-center text-xs text-neutral-500">
            <p>
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="border-b border-neutral-500 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="border-b border-neutral-500 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
