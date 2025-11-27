/**
 * Order Confirmation Email Template
 *
 * This email is sent to customers after successful payment.
 * It includes order details, items, shipping address, and total.
 * Styled to match the website's "Immersive Minimalism & Performant Luxury" theme.
 */

import * as React from "react";
import type { Order } from "@/types/cart";

interface OrderConfirmationEmailProps {
  order: Order;
  customerEmail: string;
}

export const OrderConfirmationEmail: React.FC<
  Readonly<OrderConfirmationEmailProps>
> = ({ order, customerEmail }) => {
  const orderDate = order.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Theme colors matching website
  const colors = {
    primary: "#0f172a", // slate-900 (near black)
    primaryText: "#ffffff",
    accent: "#059669", // emerald-600
    accentLight: "#10b981", // emerald-500
    accentGradient: "linear-gradient(135deg, #059669 0%, #14b8a6 100%)", // emerald-600 to teal-500
    background: "#ffffff",
    cardBackground: "#f8fafc", // slate-50
    text: "#0f172a", // slate-900
    textMuted: "#64748b", // slate-500
    textLight: "#94a3b8", // slate-400
    border: "#e2e8f0", // slate-200
    success: "#059669", // emerald-600
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        `}</style>
      </head>
      <body
        style={{
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: "1.6",
          color: colors.text,
          backgroundColor: "#f1f5f9", // slate-100
          margin: 0,
          padding: 0,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: "#f1f5f9", padding: "32px 16px" }}
        >
          <tr>
            <td align="center">
              <table
                width="600"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  backgroundColor: colors.background,
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
                  maxWidth: "600px",
                }}
              >
                {/* Header with Emerald Gradient */}
                <tr>
                  <td
                    style={{
                      background: colors.accentGradient,
                      padding: "40px 32px",
                      textAlign: "center",
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        color: colors.primaryText,
                        fontSize: "28px",
                        fontWeight: "700",
                        letterSpacing: "-0.02em",
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      BUBBLE WRAP SHOP
                    </h1>
                    <div
                      style={{
                        marginTop: "8px",
                        height: "2px",
                        width: "60px",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                  </td>
                </tr>

                {/* Main Content */}
                <tr>
                  <td style={{ padding: "48px 32px" }}>
                    {/* Thank You Message */}
                    <h2
                      style={{
                        margin: "0 0 12px",
                        fontSize: "24px",
                        fontWeight: "700",
                        color: colors.text,
                        fontFamily: '"Inter", sans-serif',
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Thank You for Your Order!
                    </h2>
                    <p
                      style={{
                        margin: "0 0 32px",
                        color: colors.textMuted,
                        fontSize: "16px",
                        lineHeight: "1.6",
                      }}
                    >
                      Your order has been confirmed and will be shipped soon.
                    </p>

                    {/* Order Details Card */}
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{
                        backgroundColor: colors.cardBackground,
                        borderRadius: "8px",
                        padding: "24px",
                        marginBottom: "32px",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <tr>
                        <td>
                          <table width="100%" cellPadding="0" cellSpacing="0">
                            <tr>
                              <td style={{ paddingBottom: "12px" }}>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: colors.textMuted,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    display: "block",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Order Number
                                </span>
                                <strong
                                  style={{
                                    color: colors.text,
                                    fontSize: "16px",
                                    fontWeight: "600",
                                  }}
                                >
                                  #{order.orderNumber}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ paddingBottom: "12px" }}>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: colors.textMuted,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    display: "block",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Date
                                </span>
                                <span style={{ color: colors.text, fontSize: "16px" }}>
                                  {orderDate}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: colors.textMuted,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    display: "block",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Email
                                </span>
                                <span style={{ color: colors.text, fontSize: "16px" }}>
                                  {customerEmail}
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* Order Items */}
                    <h3
                      style={{
                        margin: "0 0 20px",
                        fontSize: "18px",
                        fontWeight: "600",
                        color: colors.text,
                        fontFamily: '"Inter", sans-serif',
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Order Items
                    </h3>
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{
                        borderTop: `1px solid ${colors.border}`,
                        marginBottom: "24px",
                      }}
                    >
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              padding: "20px 0",
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            <table width="100%" cellPadding="0" cellSpacing="0">
                              <tr>
                                <td width="70%" style={{ verticalAlign: "top" }}>
                                  <strong
                                    style={{
                                      color: colors.text,
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      display: "block",
                                      marginBottom: "6px",
                                    }}
                                  >
                                    {item.product?.name || "Product"}
                                  </strong>
                                  {item.variant && (
                                    <div
                                      style={{
                                        fontSize: "14px",
                                        color: colors.textMuted,
                                        marginBottom: "4px",
                                      }}
                                    >
                                      {item.variant.name}
                                    </div>
                                  )}
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: colors.textMuted,
                                    }}
                                  >
                                    Qty: {item.quantity}
                                  </div>
                                </td>
                                <td
                                  width="30%"
                                  align="right"
                                  style={{ verticalAlign: "top" }}
                                >
                                  <strong
                                    style={{
                                      color: colors.text,
                                      fontSize: "16px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    £
                                    {(
                                      item.pricePerUnit * item.quantity
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      ))}
                    </table>

                    {/* Order Summary */}
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ marginBottom: "32px" }}
                    >
                      <tr>
                        <td
                          width="70%"
                          align="right"
                          style={{ padding: "8px 0", color: colors.textMuted }}
                        >
                          Subtotal:
                        </td>
                        <td
                          width="30%"
                          align="right"
                          style={{ padding: "8px 0" }}
                        >
                          <strong style={{ color: colors.text }}>£{order.subtotal.toFixed(2)}</strong>
                        </td>
                      </tr>
                      {order.discount > 0 && (
                        <tr>
                          <td
                            align="right"
                            style={{
                              padding: "8px 0",
                              color: colors.success,
                              fontWeight: "500",
                            }}
                          >
                            Discount:
                          </td>
                          <td
                            align="right"
                            style={{
                              padding: "8px 0",
                              color: colors.success,
                              fontWeight: "600",
                            }}
                          >
                            -£{order.discount.toFixed(2)}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td
                          align="right"
                          style={{ padding: "8px 0", color: colors.textMuted }}
                        >
                          Shipping:
                        </td>
                        <td align="right" style={{ padding: "8px 0" }}>
                          <strong style={{ color: colors.text }}>£{order.shipping.toFixed(2)}</strong>
                        </td>
                      </tr>
                      {(order as any).vatAmount && (order as any).vatAmount > 0 && (
                        <tr>
                          <td
                            align="right"
                            style={{
                              padding: "8px 0",
                              color: colors.textMuted,
                            }}
                          >
                            VAT (20%):
                          </td>
                          <td align="right" style={{ padding: "8px 0" }}>
                            <strong style={{ color: colors.text }}>
                              £{((order as any).vatAmount).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td
                          align="right"
                          style={{
                            padding: "20px 0 8px",
                            fontSize: "18px",
                            fontWeight: "600",
                            borderTop: `2px solid ${colors.border}`,
                            color: colors.text,
                          }}
                        >
                          Total:
                        </td>
                        <td
                          align="right"
                          style={{
                            padding: "20px 0 8px",
                            fontSize: "18px",
                            fontWeight: "700",
                            borderTop: `2px solid ${colors.border}`,
                            color: colors.text,
                          }}
                        >
                          £{order.total.toFixed(2)}
                        </td>
                      </tr>
                    </table>

                    {/* Shipping Address */}
                    <h3
                      style={{
                        margin: "0 0 20px",
                        fontSize: "18px",
                        fontWeight: "600",
                        color: colors.text,
                        fontFamily: '"Inter", sans-serif',
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Shipping Address
                    </h3>
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{
                        backgroundColor: colors.cardBackground,
                        borderRadius: "8px",
                        padding: "24px",
                        marginBottom: "32px",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <tr>
                        <td>
                          <div
                            style={{
                              lineHeight: "1.8",
                              color: colors.text,
                              fontSize: "15px",
                            }}
                          >
                            <strong style={{ display: "block", marginBottom: "4px" }}>
                              {order.shippingAddress.fullName}
                            </strong>
                            {order.shippingAddress.address}
                            {(() => {
                              const addr2 =
                                (
                                  order.shippingAddress as unknown as Record<
                                    string,
                                    unknown
                                  >
                                )?.address2 ||
                                (
                                  order.shippingAddress as unknown as Record<
                                    string,
                                    unknown
                                  >
                                )?.address_line_2;
                              return addr2 ? (
                                <>
                                  <br />
                                  {String(addr2)}
                                </>
                              ) : null;
                            })()}
                            <br />
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zipCode}
                            <br />
                            {order.shippingAddress.country}
                          </div>
                        </td>
                      </tr>
                    </table>

                    {/* CTA Button with Emerald Gradient */}
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ marginTop: "32px" }}
                    >
                      <tr>
                        <td align="center">
                          <a
                            href={`${process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk"}/account/orders/${order.id}`}
                            style={{
                              display: "inline-block",
                              background: colors.accentGradient,
                              color: colors.primaryText,
                              padding: "14px 32px",
                              textDecoration: "none",
                              borderRadius: "8px",
                              fontWeight: "600",
                              fontSize: "16px",
                              fontFamily: '"Inter", sans-serif',
                              boxShadow: "0 4px 6px -1px rgba(5, 150, 105, 0.2)",
                            }}
                          >
                            View Order Details
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      backgroundColor: colors.cardBackground,
                      padding: "32px",
                      textAlign: "center",
                      borderTop: `1px solid ${colors.border}`,
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 12px",
                        fontSize: "14px",
                        color: colors.textMuted,
                        lineHeight: "1.6",
                      }}
                    >
                      Questions? Contact us at{" "}
                      <a
                        href="mailto:info@bubblewrapshop.co.uk"
                        style={{
                          color: colors.accent,
                          textDecoration: "none",
                          fontWeight: "500",
                        }}
                      >
                        info@bubblewrapshop.co.uk
                      </a>
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: colors.textLight,
                      }}
                    >
                      © {new Date().getFullYear()} Bubble wrap shop (Blackburn) Limited. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

export default OrderConfirmationEmail;
