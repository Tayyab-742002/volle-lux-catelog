import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { WebsiteLayoutWrapper } from "@/components/common/website-layout-wrapper";
import { SanityLiveWrapper } from "@/components/common/sanity-live-wrapper";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { getAllCategories } from "@/sanity/lib";
// import Chatbot from "@/components/common/Chatbot";
// PERFORMANCE: Vercel Speed Insights & Analytics
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

/**
 * Inter Font Configuration
 *
 * Why Inter is the best choice for this e-commerce site:
 * - Designed specifically for user interfaces and screens
 * - Excellent readability at all sizes (critical for product descriptions, prices, checkout)
 * - Professional and modern aesthetic (aligns with "Immersive Minimalism & Performant Luxury")
 * - Versatile: works perfectly for headings, body text, and UI elements
 * - Optimized for digital screens with high legibility
 * - Used by many successful e-commerce platforms
 * - Great performance with font-display: swap
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Get base URL for metadata
const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Bubble Wrap Shop - Premium Packaging Supplies",
    template: "%s | Bubble Wrap Shop",
  },
  description:
    "UK's leading supplier of packaging supplies. Buy bubble wrap, cardboard boxes, packing tape, and protective packaging. Wholesale pricing available. Next day delivery across the UK.",
  keywords: [
    // Primary keywords
    "packaging supplies",
    "packaging supplies UK",
    "bubble wrap",
    "bubble wrap UK",
    "packaging boxes",
    "cardboard boxes UK",
    "packing tape",
    "packing tape UK",
    "shipping boxes",
    "shipping boxes UK",
    // B2B/Wholesale keywords
    "wholesale packaging",
    "wholesale packaging UK",
    "bulk packaging supplies",
    "B2B packaging",
    "corporate packaging",
    "business packaging supplies",
    "packaging wholesale",
    "bulk bubble wrap",
    "wholesale cardboard boxes",
    // Delivery & Service keywords
    "next day delivery",
    "next day delivery UK",
    "UK packaging supplier",
    "packaging supplier UK",
    "Blackburn packaging",
    "Lancashire packaging supplier",
    // Product-specific keywords
    "protective packaging",
    "protective packaging UK",
    "eco-friendly packaging",
    "eco-friendly packaging UK",
    "packaging materials",
    "packaging materials UK",
    "bubble wrap online",
    "cheap packaging supplies",
    "packaging boxes online",
    // Long-tail keywords
    "next day delivery packaging supplies UK",
    "cheap bubble wrap online",
    "wholesale packaging supplies UK",
    "bulk packaging UK",
    "packaging supplies next day delivery",
  ],
  authors: [{ name: "Bubble Wrap Shop" }],
  creator: "Bubble Wrap Shop",
  publisher: "Bubble Wrap Shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: baseUrl,
    siteName: "Bubble Wrap Shop - Premium Packaging Supplies",
    title: "Bubble Wrap Shop - Premium Packaging Supplies",
    description:
      "Professional packaging supplies with automatic bulk pricing. Next day delivery. Eco-friendly options.",
    images: [
      {
        url: "/logo.jpg", // Relative URL - metadataBase will resolve it
        width: 1200,
        height: 630,
        alt: "Bubble Wrap Shop Premium Packaging Supplies",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bubble Wrap Shop - Premium Packaging Supplies",
    description:
      "Professional packaging supplies with automatic bulk pricing. Next day delivery. Eco-friendly options.",
    images: [
      {
        url: "/logo.jpg", // Relative URL - metadataBase will resolve it
        width: 1200,
        height: 630,
        alt: "Bubble Wrap Shop Premium Packaging Supplies",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification code here when available
    // google: "your-google-verification-code",
  },
};

// PERFORMANCE: Removed force-dynamic to enable static generation
// SanityLive is only used in specific dynamic pages that need real-time updates
// Static pages (home, products, etc.) will use ISR with revalidation

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // PERFORMANCE: Only fetch categories for header (not all products)
  // Products are loaded on-demand by search/category pages
  const categories = await getAllCategories();

  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnects for image/CDN origins to improve LCP */}
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//cdn.sanity.io" />
        <link
          rel="preconnect"
          href="https://pub-20f982007aa54df4849bcd969b89a1bf.r2.dev"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="//pub-20f982007aa54df4849bcd969b89a1bf.r2.dev"
        />
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
      </head>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        {/* Silence noisy console logs in production to reduce JS overhead */}
        <Script id="silence-console" strategy="beforeInteractive">
          {`(function(){try{if(process&&process.env&&process.env.NODE_ENV==='production'){['log','info','debug','trace'].forEach(function(m){if(console&&console[m]){console[m]=function(){}}})}}catch(e){}})();`}
        </Script>
        <AuthProvider>
          <CartProvider>
            {/* WebsiteLayoutWrapper conditionally renders header/footer based on route */}
            {/* For /studio routes, it only renders children (no header/footer) */}
            <WebsiteLayoutWrapper categories={categories || []}>
              {children}
            </WebsiteLayoutWrapper>

            {/* Enable real-time Sanity content updates - Server Component only */}
            {/* Safe to render everywhere - SanityLive only activates on pages that use sanityFetch */}
            <SanityLiveWrapper />
          </CartProvider>
        </AuthProvider>
        {/* PERFORMANCE: Real-time performance monitoring */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
