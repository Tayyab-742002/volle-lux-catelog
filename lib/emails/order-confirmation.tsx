/**
 * Order Confirmation Email Template
 *
 * This email is sent to customers after successful payment.
 * It includes order details, items, shipping address, and total.
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

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: "1.6",
          color: "#333333",
          backgroundColor: "#f4f4f4",
          margin: 0,
          padding: 0,
        }}
      >
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: "#f4f4f4", padding: "20px 0" }}
        >
          <tr>
            <td align="center">
              <table
                width="600"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Header */}
                <tr>
                  <td
                    style={{
                      backgroundColor: "#000000",
                      padding: "30px",
                      textAlign: "center",
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        color: "#ffffff",
                        fontSize: "32px",
                        fontWeight: "bold",
                        letterSpacing: "2px",
                      }}
                    >
                      VOLLE
                    </h1>
                  </td>
                </tr>

                {/* Main Content */}
                <tr>
                  <td style={{ padding: "40px 30px" }}>
                    {/* Thank You Message */}
                    <h2
                      style={{
                        margin: "0 0 10px",
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "#000000",
                      }}
                    >
                      Thank You for Your Order!
                    </h2>
                    <p style={{ margin: "0 0 20px", color: "#666666" }}>
                      Your order has been confirmed and will be shipped soon.
                    </p>

                    {/* Order Details Box */}
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "6px",
                        padding: "20px",
                        marginBottom: "30px",
                      }}
                    >
                      <tr>
                        <td>
                          <table width="100%" cellPadding="0" cellSpacing="0">
                            <tr>
                              <td style={{ paddingBottom: "10px" }}>
                                <strong style={{ color: "#000000" }}>
                                  Order Number:
                                </strong>{" "}
                                #{order.orderNumber}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ paddingBottom: "10px" }}>
                                <strong style={{ color: "#000000" }}>
                                  Date:
                                </strong>{" "}
                                {orderDate}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong style={{ color: "#000000" }}>
                                  Email:
                                </strong>{" "}
                                {customerEmail}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* Order Items */}
                    <h3
                      style={{
                        margin: "0 0 15px",
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#000000",
                      }}
                    >
                      Order Items
                    </h3>
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{
                        borderTop: "1px solid #e0e0e0",
                        marginBottom: "20px",
                      }}
                    >
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              padding: "15px 0",
                              borderBottom: "1px solid #e0e0e0",
                            }}
                          >
                            <table width="100%" cellPadding="0" cellSpacing="0">
                              <tr>
                                <td width="70%">
                                  <strong style={{ color: "#000000" }}>
                                    {item.product?.name || "Product"}
                                  </strong>
                                  {item.variant && (
                                    <div
                                      style={{
                                        fontSize: "14px",
                                        color: "#666666",
                                        marginTop: "4px",
                                      }}
                                    >
                                      {item.variant.name}
                                    </div>
                                  )}
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: "#666666",
                                      marginTop: "4px",
                                    }}
                                  >
                                    Qty: {item.quantity}
                                  </div>
                                </td>
                                <td width="30%" align="right">
                                  <strong style={{ color: "#000000" }}>
                                    $
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
                      style={{ marginBottom: "30px" }}
                    >
                      <tr>
                        <td
                          width="70%"
                          align="right"
                          style={{ padding: "5px 0" }}
                        >
                          Subtotal:
                        </td>
                        <td
                          width="30%"
                          align="right"
                          style={{ padding: "5px 0" }}
                        >
                          <strong>£{order.subtotal.toFixed(2)}</strong>
                        </td>
                      </tr>
                      {order.discount > 0 && (
                        <tr>
                          <td
                            align="right"
                            style={{ padding: "5px 0", color: "#22c55e" }}
                          >
                            Discount:
                          </td>
                          <td
                            align="right"
                            style={{ padding: "5px 0", color: "#22c55e" }}
                          >
                            <strong>-£{order.discount.toFixed(2)}</strong>
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td align="right" style={{ padding: "5px 0" }}>
                          Shipping:
                        </td>
                        <td align="right" style={{ padding: "5px 0" }}>
                          <strong>£{order.shipping.toFixed(2)}</strong>
                        </td>
                      </tr>
                      {(order as any).vatAmount && (order as any).vatAmount > 0 && (
                        <tr>
                          <td align="right" style={{ padding: "5px 0", color: "#666666" }}>
                            VAT (20%):
                          </td>
                          <td align="right" style={{ padding: "5px 0" }}>
                            <strong>£{((order as any).vatAmount).toFixed(2)}</strong>
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td
                          align="right"
                          style={{
                            padding: "15px 0 5px",
                            fontSize: "18px",
                            borderTop: "2px solid #000000",
                          }}
                        >
                          Total:
                        </td>
                        <td
                          align="right"
                          style={{
                            padding: "15px 0 5px",
                            fontSize: "18px",
                            borderTop: "2px solid #000000",
                          }}
                        >
                          <strong>£{order.total.toFixed(2)}</strong>
                        </td>
                      </tr>
                    </table>

                    {/* Shipping Address */}
                    <h3
                      style={{
                        margin: "0 0 15px",
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#000000",
                      }}
                    >
                      Shipping Address
                    </h3>
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "6px",
                        padding: "20px",
                        marginBottom: "30px",
                      }}
                    >
                      <tr>
                        <td>
                          <div style={{ lineHeight: "1.8", color: "#333333" }}>
                            <strong>{order.shippingAddress.fullName}</strong>
                            <br />
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

                    {/* CTA Button */}
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ marginTop: "30px" }}
                    >
                      <tr>
                        <td align="center">
                          <a
                            href={`${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}`}
                            style={{
                              display: "inline-block",
                              backgroundColor: "#000000",
                              color: "#ffffff",
                              padding: "14px 30px",
                              textDecoration: "none",
                              borderRadius: "6px",
                              fontWeight: "600",
                              fontSize: "16px",
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
                      backgroundColor: "#f9f9f9",
                      padding: "30px",
                      textAlign: "center",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 10px",
                        fontSize: "14px",
                        color: "#666666",
                      }}
                    >
                      Questions? Contact us at{" "}
                      <a
                        href="mailto:support@volle.com"
                        style={{ color: "#000000", textDecoration: "none" }}
                      >
                        support@volle.com
                      </a>
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#999999",
                      }}
                    >
                      © {new Date().getFullYear()} Volle. All rights reserved.
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
