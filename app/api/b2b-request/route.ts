/**
 * B2B Request API Route
 *
 * Handles B2B custom bulk order request submissions.
 *
 * POST /api/b2b-request
 * Body: CreateB2BRequestInput
 */

import { NextRequest, NextResponse } from "next/server";
import { createB2BRequest } from "@/services/b2b/b2b-request.service";
import { sendB2BRequestEmail } from "@/services/emails/email.service";
import { z } from "zod";

// Rate limiting (simple in-memory, replace with Redis for production)
const submissionTracker = new Map<string, number[]>();
const MAX_SUBMISSIONS = 3; // Max submissions per IP
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

// Validation schema
const b2BRequestSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  companyWebsite: z.string().url().optional().or(z.literal("")),
  vatNumber: z.string().optional(),
  productsInterested: z
    .string()
    .min(10, "Please describe the products you're interested in"),
  estimatedQuantity: z.string().min(1, "Please provide an estimated quantity"),
  budgetRange: z.string().optional(),
  preferredDeliveryDate: z.string().optional(),
  deliveryAddress: z.object({
    addressLine1: z.string().min(5, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State/County is required"),
    postalCode: z.string().min(4, "Postal code is required"),
    country: z.string().min(2, "Country is required"),
  }),
  additionalNotes: z.string().optional(),
  isExistingCustomer: z.boolean().optional().default(false),
});

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
          hint: "You can only submit 3 B2B requests per hour.",
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate with Zod
    const validationResult = b2BRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.message,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Create B2B request in database
    const result = await createB2BRequest(validatedData);

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          error: result.error || "Failed to create B2B request",
        },
        { status: 500 }
      );
    }

    // Send email notification to admin
    try {
      await sendB2BRequestEmail(result.data);
    } catch (emailError) {
      // Log error but don't fail the request
      console.error("Failed to send B2B request email:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "B2B request submitted successfully",
        data: {
          id: result.data.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing B2B request:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to process your request. Please try again later.",
      },
      { status: 500 }
    );
  }
}
