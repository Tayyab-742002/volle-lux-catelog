"use client";
import { useState } from "react";
import { Breadcrumbs } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

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
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-400">
        <div className="container mx-auto px-6 py-6">
          <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-16 md:mb-20">
            <h1 className="mb-4 text-4xl font-light text-neutral-900 md:text-5xl lg:text-6xl">
              Get in Touch
            </h1>
            <p className="text-lg text-neutral-600">
              Have a question? We&apos;re here to help
            </p>
          </div>

          <div className="grid gap-16 lg:grid-cols-3 lg:gap-20">
            {/* Contact Info Sidebar */}
            <div className="space-y-12">
              <div className="space-y-3">
                <div className="mb-4">
                  <Mail
                    className="h-5 w-5 text-neutral-900"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-sm font-normal text-neutral-900">Email</h3>
                <a
                  href="mailto:support@volle.com"
                  className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  support@volle.com
                </a>
              </div>

              <div className="space-y-3">
                <div className="mb-4">
                  <Phone
                    className="h-5 w-5 text-neutral-900"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-sm font-normal text-neutral-900">Phone</h3>
                <a
                  href="tel:+18008665563"
                  className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  1-800-VOLLE-PKG
                </a>
                <p className="text-sm text-neutral-500">
                  Mon - Fri, 9 AM - 6 PM EST
                </p>
              </div>

              <div className="space-y-3">
                <div className="mb-4">
                  <MapPin
                    className="h-5 w-5 text-neutral-900"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-sm font-normal text-neutral-900">Office</h3>
                <p className="text-sm text-neutral-600">
                  123 Packaging Street
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="border-t border-neutral-400 pt-8 lg:pt-0 lg:border-t-0">
                <h2 className="mb-8 text-2xl font-light text-neutral-900">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-normal text-neutral-900"
                      >
                        Name <span className="text-neutral-400">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        className="border-neutral-300 bg-transparent focus:border-neutral-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-normal text-neutral-900"
                      >
                        Email <span className="text-neutral-400">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        className="border-neutral-300 bg-transparent focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
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
                        placeholder="Your company name"
                        className="border-neutral-300 bg-transparent focus:border-neutral-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-normal text-neutral-900"
                      >
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="border-neutral-300 bg-transparent focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-sm font-normal text-neutral-900"
                    >
                      Subject <span className="text-neutral-400">*</span>
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="What's this about?"
                      className="border-neutral-300 bg-transparent focus:border-neutral-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm font-normal text-neutral-900"
                    >
                      Message <span className="text-neutral-400">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={8}
                      placeholder="Tell us how we can help..."
                      className="resize-none border border-neutral-300 bg-transparent focus:border-none"
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="border border-neutral-400 bg-neutral-50 p-4 text-sm text-neutral-900">
                      Thank you! Your message has been sent successfully.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="border border-neutral-400 bg-neutral-50 p-4 text-sm text-neutral-900">
                      {errorMessage ||
                        "Something went wrong. Please try again later."}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="h-12 bg-primary px-8 text-sm cursor-pointer font-normal text-white hover:bg-primary/70"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" strokeWidth={1.5} />
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
