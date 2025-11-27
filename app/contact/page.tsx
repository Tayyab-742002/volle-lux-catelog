"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Leaf,
  Clock,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  phone?: string;
  company?: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = (): boolean => {
    const form = formRef.current;
    if (!form) return false;

    const formData = new FormData(form);
    const newErrors: FormErrors = {};

    // Name validation
    const name = (formData.get("name") as string)?.trim();
    if (!name) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const email = (formData.get("email") as string)?.trim();
    if (!email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Subject validation
    const subject = (formData.get("subject") as string)?.trim();
    if (!subject) {
      newErrors.subject = "Subject is required";
    } else if (subject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    // Message validation
    const message = (formData.get("message") as string)?.trim();
    if (!message) {
      newErrors.message = "Message is required";
    } else if (message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    // Phone validation (optional but if provided, must be valid)
    const phone = (formData.get("phone") as string)?.trim();
    if (phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phone) || phone.length < 10) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    // Clear general error message
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    setErrors({});

    // Validate form before submission
    if (!validateForm()) {
      setIsSubmitting(false);
      setSubmitStatus("error");
      setErrorMessage("Please fix the errors below before submitting.");
      // Scroll to first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        (firstErrorField as HTMLElement).focus();
      }
      return;
    }

    const form = e.currentTarget || formRef.current;

    if (!form) {
      setIsSubmitting(false);
      setSubmitStatus("error");
      setErrorMessage("Form reference lost. Please refresh the page.");
      return;
    }

    try {
      const formData = new FormData(form);
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        company: formData.get("company") as string,
        phone: formData.get("phone") as string,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        if (formRef.current) {
          formRef.current.reset();
        } else if (form) {
          form.reset();
        }
        setErrors({});
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(
          result.error || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Breadcrumbs */}
      <div className="relative z-10 border-b-2 border-emerald-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Back Button */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="mb-8 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={2} />
              Back to Home
            </Button>
          </Link>

          {/* Page Header */}
          <div className="mb-16 md:mb-20 text-center">
            <div className="flex items-center justify-center gap-2 mb-4 text-emerald-600">
              <Leaf className="h-6 w-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Get In Touch
              </span>
            </div>
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              We&apos;re Here to Help
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our eco-friendly packaging? We&apos;d love to
              hear from you.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Email Card */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-300  transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-teal-600 shadow-lg group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 mb-2">
                      Email
                    </h3>
                    <a
                      href="mailto:sales@bubblewrapshop.co.uk"
                      className="block text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                    >
                      sales@bubblewrapshop.co.uk
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-300 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-teal-600 shadow-lg group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 mb-2">
                      Phone
                    </h3>
                    <a
                      href="tel:01254916167"
                      className="block text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors mb-2"
                    >
                      01254 916167
                    </a>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Mon - Fri, 9 AM - 6 PM BST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Card */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-300  transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-teal-600 shadow-lg group-hover:scale-110 transition-transform">
                    <MapPin className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 mb-2">
                      Office
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Bubble wrap shop (Blackburn) Limited
                      <br />
                      Unit BR16 Blakewater Road
                      <br />
                      Blackburn, England, BB1 5QF
                      <br />
                      United Kingdom
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 ">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl border border-gray-300">
                <div className="flex items-center gap-2 mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Send us a Message
                  </h2>
                </div>

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6 "
                  noValidate
                >
                  {/* General Error Message */}
                  {submitStatus === "error" && errorMessage && (
                    <div className="border-2 border-red-200 bg-red-50 p-4 rounded-xl flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                      <p className="text-sm font-medium text-red-800">
                        {errorMessage}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2 ">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-semibold text-gray-900"
                      >
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Alex Smith"
                        onChange={handleInputChange}
                        className={`h-11 border ${
                          errors.name
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "border-gray-300 focus-visible:ring-emerald-400"
                        } bg-transparent focus-visible:ring-1! transition-all`}
                        aria-invalid={errors.name ? "true" : "false"}
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                      {errors.name && (
                        <p
                          id="name-error"
                          className="text-xs text-red-600 flex items-center gap-1 mt-1"
                          role="alert"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-900"
                      >
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        onChange={handleInputChange}
                        className={`h-11 border ${
                          errors.email
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "border-gray-300 focus-visible:ring-emerald-400"
                        } bg-transparent focus-visible:ring-1! transition-all`}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && (
                        <p
                          id="email-error"
                          className="text-xs text-red-600 flex items-center gap-1 mt-1"
                          role="alert"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        className="text-sm font-semibold text-gray-900"
                      >
                        Company
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Your company"
                        onChange={handleInputChange}
                        className="h-11 border border-gray-300 focus:border-border-300 bg-transparent focus-visible:ring-emerald-400! focus-visible:ring-1! transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-semibold text-gray-900"
                      >
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="01254 916167"
                        onChange={handleInputChange}
                        className={`h-11 border ${
                          errors.phone
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "border-gray-300 focus-visible:ring-emerald-400"
                        } bg-transparent focus-visible:ring-1! transition-all`}
                        aria-invalid={errors.phone ? "true" : "false"}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                      />
                      {errors.phone && (
                        <p
                          id="phone-error"
                          className="text-xs text-red-600 flex items-center gap-1 mt-1"
                          role="alert"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-sm font-semibold text-gray-900"
                    >
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="What's this about?"
                      onChange={handleInputChange}
                      className={`h-11 border ${
                        errors.subject
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-gray-300 focus-visible:ring-emerald-400"
                      } bg-transparent focus-visible:ring-1! transition-all`}
                      aria-invalid={errors.subject ? "true" : "false"}
                      aria-describedby={errors.subject ? "subject-error" : undefined}
                    />
                    {errors.subject && (
                      <p
                        id="subject-error"
                        className="text-xs text-red-600 flex items-center gap-1 mt-1"
                        role="alert"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm font-semibold text-gray-900"
                    >
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      placeholder="Tell us how we can help..."
                      onChange={handleInputChange}
                      className={`min-h-[120px] border ${
                        errors.message
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-gray-300 focus-visible:ring-emerald-400"
                      } bg-transparent focus-visible:ring-1! transition-all`}
                      aria-invalid={errors.message ? "true" : "false"}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                    {errors.message && (
                      <p
                        id="message-error"
                        className="text-xs text-red-600 flex items-center gap-1 mt-1"
                        role="alert"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {submitStatus === "success" && (
                    <div className="border-2 border-emerald-200 bg-emerald-50 p-4 rounded-xl flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                      <p className="text-sm font-medium text-emerald-800">
                        Thank you! Your message has been sent successfully.
                        We&apos;ll get back to you soon.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="h-12 w-full md:w-auto bg-linear-to-r from-emerald-600 to-teal-600 px-8 text-base font-semibold text-white hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" strokeWidth={2} />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
