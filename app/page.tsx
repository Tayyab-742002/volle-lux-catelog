import type { Metadata } from "next";
import {
  HeroSection,
  CategoryGrid,
  FeaturedProducts,
  SustainabilityBlock,
  NewArrivals,
  FinalCTA,
  B2BBanner,
} from "@/components/home";

// Revalidate every 60 seconds to ensure fresh category data
export const revalidate = 60;

/**
 * Homepage Metadata
 * SEO optimization for the homepage
 * This extends the root layout metadata with homepage-specific details
 */
export const metadata: Metadata = {
  title: "Premium Packaging Supplies | Eco-Friendly & Bulk Pricing",
  description:
    "Professional packaging supplies with automatic bulk pricing. Next day delivery. Eco-friendly options. Shop premium bubble wrap, boxes, and protective packaging materials.",
  openGraph: {
    title:
      "Bubble Wrap Shop - Premium Packaging Supplies | Eco-Friendly & Bulk Pricing",
    description:
      "Professional packaging supplies with automatic bulk pricing. Next day delivery. Eco-friendly options. Shop premium bubble wrap, boxes, and protective packaging materials.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://volle.com",
  },
  twitter: {
    title:
      "Bubble Wrap Shop - Premium Packaging Supplies | Eco-Friendly & Bulk Pricing",
    description:
      "Professional packaging supplies with automatic bulk pricing. Next day delivery. Eco-friendly options.",
  },
};

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://volle.com";

  // Organization Structured Data (JSON-LD) for SEO
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bubble Wrap Shop",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`, // Update with actual logo URL
    description:
      "Premium packaging supplies with automatic bulk pricing. Next day delivery. Eco-friendly options.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44-7882-851632",
      contactType: "Customer Service",
      areaServed: "GB",
      availableLanguage: "English",
    },
    sameAs: [
      // Add social media links when available
      // "https://www.facebook.com/volle",
      // "https://www.twitter.com/volle",
      // "https://www.linkedin.com/company/volle",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit BR16 Blakewater Road",
      addressLocality: "Blackburn",
      addressRegion: "England",
      postalCode: "BB1 5QF",
      addressCountry: "GB",
    },
  };

  // Website Structured Data (JSON-LD) for SEO
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bubble Wrap Shop - Premium Packaging Supplies",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />

      <B2BBanner />
      <HeroSection />
      {/* <TrustBar /> */}
      <CategoryGrid />
      <FeaturedProducts />
      <SustainabilityBlock />
      <NewArrivals />
      <FinalCTA />
    </>
  );
}
