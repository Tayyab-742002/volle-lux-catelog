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
      // Get form data
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        company: formData.get("company") as string,
        phone: formData.get("phone") as string,
      };

      // Send to API
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

        // Scroll to success message
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
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a question? We're here to help
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="mb-1 font-semibold">Email</h3>
                <a
                  href="mailto:support@volle.com"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  support@volle.com
                </a>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="mb-1 font-semibold">Phone</h3>
                <a
                  href="tel:+18008665563"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  1-800-VOLLE-PKG
                </a>
                <p className="mt-2 text-xs text-muted-foreground">
                  Mon - Fri, 9 AM - 6 PM EST
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="mb-1 font-semibold">Office</h3>
                <p className="text-sm text-muted-foreground">
                  123 Packaging Street
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-card p-8">
                <h2 className="mb-6 text-2xl font-semibold">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="mb-2">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="mb-2">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <Label htmlFor="company" className="mb-2">
                        Company (Optional)
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="mb-2">
                        Phone (Optional)
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="mb-2">
                      Subject <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="mb-2">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={8}
                      placeholder="Tell us how we can help..."
                      className="resize-none"
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                      Thank you! Your message has been sent successfully.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                      {errorMessage ||
                        "Something went wrong. Please try again later."}
                    </div>
                  )}

                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" strokeWidth={1.5} />
                        Send Message
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
