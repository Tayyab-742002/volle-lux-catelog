import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

export const metadata: Metadata = {
  title: "Contact Us - Premium Packaging Supplies | Bubble Wrap Shop",
  description:
    "Get in touch with Bubble Wrap Shop. Contact us for packaging supplies, bulk orders, wholesale pricing, or any questions. We're here to help with all your packaging needs.",
  openGraph: {
    title: "Contact Us - Premium Packaging Supplies | Bubble Wrap Shop",
    description:
      "Get in touch with Bubble Wrap Shop. Contact us for packaging supplies, bulk orders, wholesale pricing, or any questions.",
    url: `${siteUrl}/contact`,
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

