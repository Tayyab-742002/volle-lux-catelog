/**
 * Email Service
 *
 * Centralized service for sending transactional emails using Resend.
 * This service provides helper functions for all email types in the application.
 */

import { render } from "@react-email/render";
import React from "react";
import {
  getResendClient,
  EMAIL_CONFIG,
  getEmailRecipient,
  isResendConfigured,
} from "@/lib/resend/config";
import { OrderConfirmationEmail } from "@/lib/emails/order-confirmation";
import { ContactFormEmail } from "@/lib/emails/contact-form";
import type { Order } from "@/types/cart";

// Get email domain for admin email
const getEmailDomain = (): string => {
  if (process.env.RESEND_EMAIL_DOMAIN) {
    return process.env.RESEND_EMAIL_DOMAIN;
  }
  return "bubblewrapshop.co.uk";
};

const emailDomain = getEmailDomain();

/**
 * Send order confirmation email
 *
 * Sends order confirmation to customer and notification to admin
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
      React.createElement(OrderConfirmationEmail, {
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

    // Determine admin email (always send to admin, even in test mode)
    const adminEmail = `sales@${emailDomain}`;

    // Send email to customer
    // In production: send to actual customer email
    // In test mode: send to test email if configured
    const customerEmailToSend = customerEmail;

    const customerResult = await resend.emails.send({
      from: EMAIL_CONFIG.from.orders,
      to: customerEmailToSend,
      subject: EMAIL_CONFIG.subjects.orderConfirmation(order.orderNumber),
      html: emailHtml,
    });

    if (customerResult.error) {
      console.error(
        "Failed to send order confirmation email to customer:",
        customerResult.error
      );
      // Continue to send admin email even if customer email fails
    }

    // Send notification email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #059669;">New Order Received</h1>
        <p>A new order has been placed and payment has been confirmed.</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order Details</h2>
          <p><strong>Order Number:</strong> #${order.orderNumber}</p>
          <p><strong>Customer Email:</strong> ${customerEmail}</p>
          <p><strong>Order Total:</strong> £${order.total.toFixed(2)}</p>
          <p><strong>Items:</strong> ${order.items.length} item(s)</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        </div>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Items</h3>
          ${order.items
            .map(
              (item) => `
            <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0;"><strong>${item.product?.name || "Product"}</strong></p>
              ${item.variant ? `<p style="margin: 5px 0 0 0; color: #6b7280;">Variant: ${item.variant.name}</p>` : ""}
              <p style="margin: 5px 0 0 0;">Quantity: ${item.quantity} × £${item.pricePerUnit.toFixed(2)} = £${(item.pricePerUnit * item.quantity).toFixed(2)}</p>
            </div>
          `
            )
            .join("")}
        </div>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Shipping Address</h3>
          <p style="margin: 0;">${order.shippingAddress.fullName}</p>
          <p style="margin: 5px 0;">${order.shippingAddress.address}</p>
          <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
          <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
        </div>
        
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk"}/admin?tab=orders" 
             style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Order in Admin Dashboard
          </a>
        </p>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          This is an automated notification from Bubble wrap shop (Blackburn) Limited.
        </p>
      </div>
    `;

    const adminResult = await resend.emails.send({
      from: EMAIL_CONFIG.from.orders,
      to: adminEmail, // Always send to admin email directly
      subject: `New Order #${order.orderNumber} - £${order.total.toFixed(2)}`,
      html: adminEmailHtml,
      bcc: EMAIL_CONFIG.bcc.orders,
    });

    if (adminResult.error) {
      console.error(
        "Failed to send order notification email to admin:",
        adminResult.error
      );
      // If customer email succeeded but admin failed, still return success
      if (!customerResult.error) {
        return {
          success: true,
          messageId: customerResult.data?.id,
        };
      }
    }

    // Return success if at least one email was sent successfully
    if (customerResult.error && adminResult.error) {
      return {
        success: false,
        error:
          customerResult.error.message ||
          adminResult.error.message ||
          "Failed to send emails",
      };
    }

    return {
      success: true,
      messageId: customerResult.data?.id || adminResult.data?.id,
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
      React.createElement(ContactFormEmail, {
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
      <p>- Bubble wrap shop (Blackburn) Limited Team</p>
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
 * Send B2B request notification email
 *
 * @param request - B2B request data
 * @returns Promise with email send result
 */
export async function sendB2BRequestEmail(request: {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  productsInterested: string;
  estimatedQuantity: string;
  createdAt: string;
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

    // Determine where to send the email
    const toEmail =
      EMAIL_CONFIG.defaults.testEmail || EMAIL_CONFIG.replyTo.support;

    // Create email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #059669;">New B2B Request Received</h1>
        <p>A new B2B custom bulk order request has been submitted.</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Request Details</h2>
          <p><strong>Request ID:</strong> ${request.id}</p>
          <p><strong>Company:</strong> ${request.companyName}</p>
          <p><strong>Contact:</strong> ${request.contactName}</p>
          <p><strong>Email:</strong> ${request.email}</p>
          <p><strong>Phone:</strong> ${request.phone}</p>
          <p><strong>Products Interested:</strong> ${request.productsInterested}</p>
          <p><strong>Estimated Quantity:</strong> ${request.estimatedQuantity}</p>
          <p><strong>Submitted:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
        </div>
        
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk"}/admin?tab=b2b-requests" 
             style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View in Admin Dashboard
          </a>
        </p>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          This is an automated notification from Bubble wrap shop (Blackburn) Limited.
        </p>
      </div>
    `;

    // Send email
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from.support,
      to: toEmail,
      replyTo: request.email, // Allow direct reply to customer
      subject: `New B2B Request from ${request.companyName}`,
      html: emailHtml,
      bcc: EMAIL_CONFIG.bcc.contact,
    });

    if (result.error) {
      console.error("Failed to send B2B request email:", result.error);
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
    console.error("Error sending B2B request email:", error);
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
      subject: "Bubble Wrap Shop - Test Email",
      html: `
        <h1>Test Email from Bubble Wrap Shop</h1>
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
