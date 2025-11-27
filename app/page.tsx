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

// Revalidation strategy: On-demand revalidation via Sanity webhooks
// Pages will only revalidate when content changes in Sanity CMS
// For development, use `npm run dev` which has hot reloading
export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

/**
 * Homepage Metadata
 * SEO optimization for the homepage with comprehensive UK-focused keywords
 * Targeting both B2C and B2B customers
 */
export const metadata: Metadata = {
  title:
    "Packaging Supplies UK | Bubble Wrap, Boxes & Wholesale Packaging | Bubble Wrap Shop",
  description:
    "UK's leading supplier of packaging supplies. Buy bubble wrap, cardboard boxes, packing tape, and protective packaging materials online. Wholesale pricing available. Next day delivery across the UK. Serving both businesses and consumers.",
  keywords: [
    "packaging supplies UK",
    "bubble wrap UK",
    "packaging boxes UK",
    "wholesale packaging UK",
    "bulk packaging supplies",
    "cardboard boxes UK",
    "packing tape UK",
    "shipping boxes UK",
    "protective packaging UK",
    "next day delivery packaging",
    "UK packaging supplier",
    "B2B packaging UK",
    "corporate packaging supplies",
    "eco-friendly packaging UK",
    "packaging materials UK",
    "bubble wrap online",
    "cheap packaging supplies",
    "packaging wholesale",
    "Blackburn packaging supplier",
    "Lancashire packaging",
  ],
  openGraph: {
    title:
      "Packaging Supplies UK | Bubble Wrap, Boxes & Wholesale | Bubble Wrap Shop",
    description:
      "UK's leading supplier of packaging supplies. Buy bubble wrap, cardboard boxes, and protective packaging. Wholesale pricing available. Next day delivery across the UK.",
    url: siteUrl,
    siteName: "Bubble Wrap Shop - Premium Packaging Supplies UK",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Packaging Supplies UK | Bubble Wrap, Boxes & Wholesale | Bubble Wrap Shop",
    description:
      "UK's leading supplier of packaging supplies. Wholesale pricing. Next day delivery across the UK.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function Home() {

  // Organization Structured Data (JSON-LD) for SEO
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bubble Wrap Shop",
    legalName: "Bubble wrap shop (Blackburn) Limited",
    url: siteUrl,
    logo: `${siteUrl}/logo.jpg`,
    description:
      "Premium packaging supplies with automatic bulk pricing. Next day delivery. Eco-friendly options.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44-7882-851632",
      contactType: "Customer Service",
      areaServed: "GB",
      availableLanguage: "English",
      email: "sales@bubblewrapshop.co.uk",
    },
    sameAs: [
      // Add social media links when available
      // "https://www.facebook.com/bubblewrapshop",
      // "https://www.twitter.com/bubblewrapshop",
      // "https://www.linkedin.com/company/bubblewrapshop",
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

  // LocalBusiness Structured Data (JSON-LD) for Local SEO
  const localBusinessStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}#organization`,
    name: "Bubble Wrap Shop",
    legalName: "Bubble wrap shop (Blackburn) Limited",
    image: `${siteUrl}/logo.jpg`,
    url: siteUrl,
    telephone: "+44-7882-851632",
    email: "sales@bubblewrapshop.co.uk",
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit BR16 Blakewater Road",
      addressLocality: "Blackburn",
      addressRegion: "England",
      postalCode: "BB1 5QF",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "53.7488",
      longitude: "-2.4883",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "17:00",
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    description:
      "Premium packaging supplies with automatic bulk pricing. Next day delivery across the UK. Eco-friendly options available.",
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
          __html: JSON.stringify(localBusinessStructuredData),
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
