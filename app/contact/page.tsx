"use client";
import { useState } from "react";
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
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const formData = new FormData(e.currentTarget);
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
        e.currentTarget.reset();
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
                      Bubble Wrap Shop (NW) Ltd
                      <br />
                      Unit 3, GBL House
                      <br />
                      Cleaver Street, Blackburn
                      <br />
                      BB1 5DG, United Kingdom
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

                <form onSubmit={handleSubmit} className="space-y-6 ">
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
                        className="h-11 border border-gray-300 focus:border-border-300 bg-transparent focus-visible:ring-emerald-400! focus-visible:ring-1! transition-all"
                      />
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
                        className="h-11 border border-gray-300 focus:border-border-300 bg-transparent focus-visible:ring-emerald-400! focus-visible:ring-1! transition-all"
                      />
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
                        className="h-11 border border-gray-300 focus:border-border-300 bg-transparent focus-visible:ring-emerald-400! focus-visible:ring-1! transition-all"
                      />
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
                      className="h-11 border border-gray-300 focus:border-border-300 bg-transparent focus-visible:ring-emerald-400! focus-visible:ring-1! transition-all"
                    />
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
                      className="h-11 border border-gray-300 focus:border-border-300 bg-transparent focus-visible:ring-emerald-400! focus-visible:ring-1! transition-all"
                    />
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

                  {submitStatus === "error" && (
                    <div className="border-2 border-red-200 bg-red-50 p-4 rounded-xl text-sm text-red-800">
                      {errorMessage ||
                        "Something went wrong. Please try again later."}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="h-12 w-full md:w-auto bg-linear-to-r from-emerald-600 to-teal-600 px-8 text-base font-semibold text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
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
