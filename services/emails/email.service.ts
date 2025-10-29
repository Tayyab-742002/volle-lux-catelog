/**
 * Email Service
 *
 * Centralized service for sending transactional emails using Resend.
 * This service provides helper functions for all email types in the application.
 */

import { render } from "@react-email/render";
import {
  getResendClient,
  EMAIL_CONFIG,
  getEmailRecipient,
  isResendConfigured,
} from "@/lib/resend/config";
import { OrderConfirmationEmail } from "@/lib/emails/order-confirmation";
import { ContactFormEmail } from "@/lib/emails/contact-form";
import type { Order } from "@/types/cart";

/**
 * Send order confirmation email
 *
 * @param order - The order object with all details
 * @param customerEmail - The customer's email address
 * @returns Promise with email send result
 */
export async function sendOrderConfirmationEmail(
  order: Order,
  customerEmail: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Check if Resend is configured
    if (!isResendConfigured()) {
      console.warn(
        "Resend is not configured. Skipping email send. Set RESEND_API_KEY in .env.local"
      );
      return {
        success: false,
        error: "Resend not configured",
      };
    }

    const resend = getResendClient();

    // Render email template to HTML string
    const emailHtml = await render(
      OrderConfirmationEmail({
        order,
        customerEmail,
      }),
      {
        pretty: false, // Minify HTML for better email client compatibility
      }
    );

    // Validate that emailHtml is a string
    if (typeof emailHtml !== "string" || !emailHtml) {
      throw new Error("Failed to render email template: HTML is not a string");
    }

    // Send email
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from.orders,
      to: getEmailRecipient(customerEmail),
      subject: EMAIL_CONFIG.subjects.orderConfirmation(order.orderNumber),
      html: emailHtml,
      bcc: EMAIL_CONFIG.bcc.orders,
    });

    if (result.error) {
      console.error("Failed to send order confirmation email:", result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    console.log(
      `✅ Order confirmation email sent to ${customerEmail} (ID: ${result.data?.id})`
    );

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send contact form submission email
 *
 * @param data - Contact form data
 * @returns Promise with email send result
 */
export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Check if Resend is configured
    if (!isResendConfigured()) {
      console.warn(
        "Resend is not configured. Skipping email send. Set RESEND_API_KEY in .env.local"
      );
      return {
        success: false,
        error: "Resend not configured",
      };
    }

    const resend = getResendClient();

    // Render email template to HTML string
    const emailHtml = await render(
      ContactFormEmail({
        ...data,
        submittedAt: new Date(),
      }),
      {
        pretty: false, // Minify HTML for better email client compatibility
      }
    );

    // Validate that emailHtml is a string
    if (typeof emailHtml !== "string" || !emailHtml) {
      throw new Error(
        "Failed to render contact form email template: HTML is not a string"
      );
    }

    // Determine where to send the email
    const toEmail =
      EMAIL_CONFIG.defaults.testEmail || EMAIL_CONFIG.replyTo.support;

    // Send email
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from.support,
      to: toEmail,
      replyTo: data.email, // Allow direct reply to customer
      subject: EMAIL_CONFIG.subjects.contactFormSubmission,
      html: emailHtml,
      bcc: EMAIL_CONFIG.bcc.contact,
    });

    if (result.error) {
      console.error("Failed to send contact form email:", result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    console.log(
      `✅ Contact form email sent for ${data.name} (ID: ${result.data?.id})`
    );

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error("Error sending contact form email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send order shipped notification
 *
 * @param order - The order object
 * @param customerEmail - Customer's email
 * @param trackingNumber - Shipping tracking number
 * @returns Promise with email send result
 */
export async function sendOrderShippedEmail(
  order: Order,
  customerEmail: string,
  trackingNumber: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Check if Resend is configured
    if (!isResendConfigured()) {
      console.warn("Resend is not configured. Skipping email send.");
      return {
        success: false,
        error: "Resend not configured",
      };
    }

    const resend = getResendClient();

    // For now, send a simple HTML email
    // TODO: Create a dedicated OrderShippedEmail template
    const emailHtml = `
      <h1>Your Order Has Shipped!</h1>
      <p>Hi there,</p>
      <p>Great news! Your order <strong>#${order.orderNumber}</strong> has shipped.</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p>You can track your package using the tracking number above.</p>
      <p>Thank you for your order!</p>
      <p>- Volle Team</p>
    `;

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from.orders,
      to: getEmailRecipient(customerEmail),
      subject: EMAIL_CONFIG.subjects.orderShipped(order.orderNumber),
      html: emailHtml,
    });

    if (result.error) {
      console.error("Failed to send order shipped email:", result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    console.log(
      `✅ Order shipped email sent to ${customerEmail} (ID: ${result.data?.id})`
    );

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error("Error sending order shipped email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test email configuration
 *
 * Sends a test email to verify Resend is properly configured
 */
export async function sendTestEmail(
  toEmail: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!isResendConfigured()) {
      return {
        success: false,
        error: "Resend not configured. Set RESEND_API_KEY in .env.local",
      };
    }

    const resend = getResendClient();

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from.noreply,
      to: toEmail,
      subject: "Volle - Test Email",
      html: `
        <h1>Test Email from Volle</h1>
        <p>If you're receiving this, your email configuration is working correctly!</p>
        <p>Environment: ${process.env.NODE_ENV}</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
