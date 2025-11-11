/**
 * Contact Form Email Template
 *
 * This email is sent when someone submits the contact form.
 * It notifies the support team about the new inquiry.
 */

import * as React from "react";

interface ContactFormEmailProps {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  submittedAt: Date;
}

export const ContactFormEmail: React.FC<Readonly<ContactFormEmailProps>> = ({
  name,
  email,
  company,
  phone,
  message,
  submittedAt,
}) => {
  const formattedDate = submittedAt.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
                        fontSize: "24px",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                      }}
                    >
                      New Contact Form Submission
                    </h1>
                  </td>
                </tr>

                {/* Main Content */}
                <tr>
                  <td style={{ padding: "40px 30px" }}>
                    {/* Submission Info */}
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
                          <p
                            style={{
                              margin: "0 0 10px",
                              fontSize: "14px",
                              color: "#666666",
                            }}
                          >
                            Submitted: {formattedDate}
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Contact Details */}
                    <h2
                      style={{
                        margin: "0 0 20px",
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#000000",
                      }}
                    >
                      Contact Information
                    </h2>

                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ marginBottom: "30px" }}
                    >
                      <tr>
                        <td
                          style={{
                            padding: "12px 0",
                            borderBottom: "1px solid #e0e0e0",
                          }}
                        >
                          <table width="100%" cellPadding="0" cellSpacing="0">
                            <tr>
                              <td width="30%" style={{ color: "#666666" }}>
                                <strong>Name:</strong>
                              </td>
                              <td width="70%" style={{ color: "#000000" }}>
                                {name}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style={{
                            padding: "12px 0",
                            borderBottom: "1px solid #e0e0e0",
                          }}
                        >
                          <table width="100%" cellPadding="0" cellSpacing="0">
                            <tr>
                              <td width="30%" style={{ color: "#666666" }}>
                                <strong>Email:</strong>
                              </td>
                              <td width="70%">
                                <a
                                  href={`mailto:${email}`}
                                  style={{
                                    color: "#000000",
                                    textDecoration: "underline",
                                  }}
                                >
                                  {email}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      {company && (
                        <tr>
                          <td
                            style={{
                              padding: "12px 0",
                              borderBottom: "1px solid #e0e0e0",
                            }}
                          >
                            <table width="100%" cellPadding="0" cellSpacing="0">
                              <tr>
                                <td width="30%" style={{ color: "#666666" }}>
                                  <strong>Company:</strong>
                                </td>
                                <td width="70%" style={{ color: "#000000" }}>
                                  {company}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      )}

                      {phone && (
                        <tr>
                          <td
                            style={{
                              padding: "12px 0",
                              borderBottom: "1px solid #e0e0e0",
                            }}
                          >
                            <table width="100%" cellPadding="0" cellSpacing="0">
                              <tr>
                                <td width="30%" style={{ color: "#666666" }}>
                                  <strong>Phone:</strong>
                                </td>
                                <td width="70%">
                                  <a
                                    href={`tel:${phone}`}
                                    style={{
                                      color: "#000000",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {phone}
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      )}
                    </table>

                    {/* Message */}
                    <h2
                      style={{
                        margin: "0 0 15px",
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#000000",
                      }}
                    >
                      Message
                    </h2>

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
                          <p
                            style={{
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              color: "#333333",
                              fontSize: "15px",
                              lineHeight: "1.8",
                            }}
                          >
                            {message}
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Quick Reply Button */}
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ marginTop: "30px" }}
                    >
                      <tr>
                        <td align="center">
                          <a
                            href={`mailto:${email}?subject=Re: Contact Form Inquiry`}
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
                            Reply to {name}
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
                      padding: "20px 30px",
                      textAlign: "center",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#999999",
                      }}
                    >
                      This is an automated notification from the Bubble Wrap Shop contact
                      form.
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

export default ContactFormEmail;
