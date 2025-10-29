/**
 * Resend Configuration
 *
 * This file configures the Resend email service for sending transactional emails.
 *
 * Usage:
 * - Import { resend } for server-side email sending
 * - Import EMAIL_CONFIG for email addresses and settings
 */

import { Resend } from "resend";

/**
 * Initialize Resend client
 *
 * IMPORTANT: This uses lazy initialization to prevent build-time errors.
 * The API key is only accessed when emails are actually sent (runtime).
 */
let resendInstance: Resend | null = null;

export const getResendClient = (): Resend => {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Missing RESEND_API_KEY environment variable. Please add it to .env.local"
      );
    }

    resendInstance = new Resend(apiKey);
  }

  return resendInstance;
};

/**
 * Email Configuration
 *
 * Central configuration for all email-related settings
 */
export const EMAIL_CONFIG = {
  // From addresses
  from: {
    orders:
      process.env.NODE_ENV !== "production"
        ? "Volle Orders <onboarding@resend.dev>"
        : "Volle Orders <orders@volle.com>",
    support:
      process.env.NODE_ENV !== "production"
        ? "Volle Support <onboarding@resend.dev>"
        : "Volle Support <support@volle.com>",
    noreply:
      process.env.NODE_ENV !== "production"
        ? "Volle <onboarding@resend.dev>"
        : "Volle <noreply@volle.com>",
  },

  // Reply-to addresses
  replyTo: {
    support:
      process.env.NODE_ENV !== "production"
        ? "testveot@gmail.com"
        : "support@volle.com",
  },

  // BCC addresses for internal tracking (optional)
  bcc: {
    orders: process.env.RESEND_BCC_ORDERS || undefined,
    contact: process.env.RESEND_BCC_CONTACT || undefined,
  },

  // Email subjects
  subjects: {
    orderConfirmation: (orderNumber: string) =>
      `Order Confirmation - #${orderNumber}`,
    orderShipped: (orderNumber: string) =>
      `Your Order Has Shipped - #${orderNumber}`,
    orderDelivered: (orderNumber: string) =>
      `Your Order Has Been Delivered - #${orderNumber}`,
    contactFormSubmission: "New Contact Form Submission",
    passwordReset: "Reset Your Password",
    welcome: "Welcome to Volle",
  },

  // Default settings
  defaults: {
    // For development, send all emails to this address
    testMode: process.env.NODE_ENV !== "production",
    testEmail: process.env.RESEND_TEST_EMAIL || undefined,
  },
} as const;

/**
 * Helper function to get the correct "to" address based on environment
 *
 * In development, emails are sent to a test address instead of real users
 * In production, emails are sent to actual recipients
 */
export function getEmailRecipient(email: string): string {
  if (EMAIL_CONFIG.defaults.testMode && EMAIL_CONFIG.defaults.testEmail) {
    console.log(
      `[DEV MODE] Email would be sent to: ${email}, redirecting to: ${EMAIL_CONFIG.defaults.testEmail}`
    );
    return EMAIL_CONFIG.defaults.testEmail;
  }

  return email;
}

/**
 * Helper to check if Resend is properly configured
 */
export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}
