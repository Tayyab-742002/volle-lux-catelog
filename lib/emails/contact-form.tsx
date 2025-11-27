/**
 * Contact Form Email Template
 *
 * This email is sent when someone submits the contact form.
 * It notifies the support team about the new inquiry.
 * Styled to match the website's "Immersive Minimalism & Performant Luxury" theme.
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
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
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
                        fontSize: "24px",
                        fontWeight: "700",
                        letterSpacing: "-0.02em",
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      New Contact Form Submission
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
                    {/* Submission Info Card */}
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{
                        backgroundColor: colors.cardBackground,
                        borderRadius: "8px",
                        padding: "20px",
                        marginBottom: "32px",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <tr>
                        <td>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              color: colors.textMuted,
                              fontWeight: "500",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "500",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                display: "block",
                                marginBottom: "4px",
                              }}
                            >
                              Submitted
                            </span>
                            {formattedDate}
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Contact Details */}
                    <h2
                      style={{
                        margin: "0 0 24px",
                        fontSize: "20px",
                        fontWeight: "600",
                        color: colors.text,
                        fontFamily: '"Inter", sans-serif',
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Contact Information
                    </h2>

                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ marginBottom: "32px" }}
                    >
                      <tr>
                        <td
                          style={{
                            padding: "16px 0",
                            borderBottom: `1px solid ${colors.border}`,
                          }}
                        >
                          <table width="100%" cellPadding="0" cellSpacing="0">
                            <tr>
                              <td
                                width="30%"
                                style={{
                                  color: colors.textMuted,
                                  fontSize: "14px",
                                  fontWeight: "500",
                                }}
                              >
                                Name:
                              </td>
                              <td
                                width="70%"
                                style={{
                                  color: colors.text,
                                  fontSize: "15px",
                                  fontWeight: "500",
                                }}
                              >
                                {name}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style={{
                            padding: "16px 0",
                            borderBottom: `1px solid ${colors.border}`,
                          }}
                        >
                          <table width="100%" cellPadding="0" cellSpacing="0">
                            <tr>
                              <td
                                width="30%"
                                style={{
                                  color: colors.textMuted,
                                  fontSize: "14px",
                                  fontWeight: "500",
                                }}
                              >
                                Email:
                              </td>
                              <td width="70%">
                                <a
                                  href={`mailto:${email}`}
                                  style={{
                                    color: colors.accent,
                                    textDecoration: "none",
                                    fontSize: "15px",
                                    fontWeight: "500",
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
                              padding: "16px 0",
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            <table width="100%" cellPadding="0" cellSpacing="0">
                              <tr>
                                <td
                                  width="30%"
                                  style={{
                                    color: colors.textMuted,
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Company:
                                </td>
                                <td
                                  width="70%"
                                  style={{
                                    color: colors.text,
                                    fontSize: "15px",
                                  }}
                                >
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
                              padding: "16px 0",
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            <table width="100%" cellPadding="0" cellSpacing="0">
                              <tr>
                                <td
                                  width="30%"
                                  style={{
                                    color: colors.textMuted,
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Phone:
                                </td>
                                <td width="70%">
                                  <a
                                    href={`tel:${phone}`}
                                    style={{
                                      color: colors.accent,
                                      textDecoration: "none",
                                      fontSize: "15px",
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
                        margin: "0 0 20px",
                        fontSize: "20px",
                        fontWeight: "600",
                        color: colors.text,
                        fontFamily: '"Inter", sans-serif',
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Message
                    </h2>

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
                          <p
                            style={{
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              color: colors.text,
                              fontSize: "15px",
                              lineHeight: "1.8",
                            }}
                          >
                            {message}
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Quick Reply Button with Emerald Gradient */}
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ marginTop: "32px" }}
                    >
                      <tr>
                        <td align="center">
                          <a
                            href={`mailto:${email}?subject=Re: Contact Form Inquiry`}
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
                              boxShadow:
                                "0 4px 6px -1px rgba(5, 150, 105, 0.2)",
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
                      backgroundColor: colors.cardBackground,
                      padding: "32px",
                      textAlign: "center",
                      borderTop: `1px solid ${colors.border}`,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: colors.textLight,
                        lineHeight: "1.6",
                      }}
                    >
                      This is an automated notification from the Bubble wrap shop (Blackburn) Limited contact form.
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
