import type { Metadata } from "next";
import Script from "next/script";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/common";
import { AnnouncementBannerWrapper } from "@/components/common/announcement-banner-wrapper";
import { SanityLiveWrapper } from "@/components/common/sanity-live-wrapper";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { getAllCategories } from "@/sanity/lib";
import Chatbot from "@/components/common/Chatbot";
// PERFORMANCE: Vercel Speed Insights & Analytics
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Volle - Premium Packaging Supplies",
  description:
    "Professional packaging supplies with automatic bulk pricing. Next day delivery. Eco-friendly options.",
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
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
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

        {/* Preload homepage hero image to improve LCP */}
        <link
          rel="preload"
          as="image"
          href="https://pub-20f982007aa54df4849bcd969b89a1bf.r2.dev/hero-packaging.jpg"
          imageSrcSet="https://pub-20f982007aa54df4849bcd969b89a1bf.r2.dev/hero-packaging.jpg 1200w"
          imageSizes="100vw"
          fetchPriority="high"
        />
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
            {/* Announcement Banner - Above Header */}
            <AnnouncementBannerWrapper />
            <Header categories={categories || []} />
            <main className="flex-1">{children}</main>
            <Footer />

            {/* Enable real-time Sanity content updates */}
            <Chatbot />
            <SanityLiveWrapper />

            {/* Floating WhatsApp Button */}
            <WhatsAppButton
              phoneNumber="+447882851632"
              message="Hi! I'm interested in your packaging products."
              position="left"
            />
          </CartProvider>
        </AuthProvider>
        {/* PERFORMANCE: Real-time performance monitoring */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
