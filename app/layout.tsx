import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/common";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { SanityLive } from "@/sanity/lib";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Volle - Premium Packaging Supplies",
  description:
    "Professional packaging supplies with automatic bulk pricing. Next day delivery. Eco-friendly options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
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
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* Silence noisy console logs in production to reduce JS overhead */}
        <Script id="silence-console" strategy="beforeInteractive">
          {`(function(){try{if(process&&process.env&&process.env.NODE_ENV==='production'){['log','info','debug','trace'].forEach(function(m){if(console&&console[m]){console[m]=function(){}}})}}catch(e){}})();`}
        </Script>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />

            {/* Enable real-time Sanity content updates */}
            <SanityLive />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
