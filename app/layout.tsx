import type { Metadata } from "next";
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
      <body className="min-h-screen bg-background font-sans antialiased">
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
