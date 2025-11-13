/**
 * Contact Form API Route
 *
 * Handles contact form submissions and sends email notifications via Resend.
 *
 * POST /api/contact
 * Body: { name, email, subject, message, company?, phone? }
 */

import { NextRequest, NextResponse } from "next/server";
import { sendContactFormEmail } from "@/services/emails/email.service";

// Rate limiting (simple in-memory, replace with Redis for production)
const submissionTracker = new Map<string, number[]>();
const MAX_SUBMISSIONS = 5; // Max submissions per IP
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const submissions = submissionTracker.get(ip) || [];

  // Remove old submissions outside time window
  const recentSubmissions = submissions.filter(
    (timestamp) => now - timestamp < TIME_WINDOW
  );

  if (recentSubmissions.length >= MAX_SUBMISSIONS) {
    return false; // Rate limit exceeded
  }

  // Add current submission
  recentSubmissions.push(now);
  submissionTracker.set(ip, recentSubmissions);

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: "Too many submissions. Please try again later.",
          hint: "You can only submit 5 messages per hour.",
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, subject, message, company, phone } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["name", "email", "subject", "message"],
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Name is too long (max 100 characters)" },
        { status: 400 }
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        { error: "Subject is too long (max 200 characters)" },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long (max 5000 characters)" },
        { status: 400 }
      );
    }

    // Basic spam detection (very simple)
    const spamKeywords = ["viagra", "casino", "crypto", "bitcoin", "lottery"];
    const contentLower = `${name} ${subject} ${message}`.toLowerCase();
    const containsSpam = spamKeywords.some((keyword) =>
      contentLower.includes(keyword)
    );

    if (containsSpam) {
      console.warn(`Potential spam detected from ${email}`);
      // Still send but log it
    }

    // Send email via Resend
    const emailResult = await sendContactFormEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim(),
      phone: phone?.trim(),
      message: message.trim(),
    });

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully!",
        messageId: emailResult.messageId,
      });
    } else {
      console.error("Failed to send contact form email:", emailResult.error);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to send message. Please try again later.",
          hint: emailResult.error?.includes("not configured")
            ? "Email service is not configured. Please contact support directly."
            : "There was a temporary issue. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing contact form:", error);

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check if contact form is available
export async function GET() {
  // Check if email service is configured
  const isConfigured = !!process.env.RESEND_API_KEY;

  return NextResponse.json({
    available: isConfigured,
    message: isConfigured
      ? "Contact form is ready to receive submissions"
      : "Contact form is temporarily unavailable (email service not configured)",
    supportEmail: "info@bubblewrapshop.co.uk",
  });
}
