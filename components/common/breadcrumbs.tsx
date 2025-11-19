"use client";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useEffect } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: "default" | "light";
}

export function Breadcrumbs({ items, variant = "default" }: BreadcrumbsProps) {
  const isLight = variant === "light";
  const textColor = isLight ? "text-white/70" : "text-muted-foreground";
  const hoverColor = isLight ? "hover:text-white" : "hover:text-foreground";
  const currentColor = isLight ? "text-white" : "text-foreground";

  // Generate BreadcrumbList structured data for SEO
  useEffect(() => {
    if (typeof window === "undefined") return;

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        ...items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: item.label,
          item: item.href ? `${siteUrl}${item.href}` : undefined,
        })),
      ],
    };

    // Remove script if it already exists
    const existingScript = document.getElementById("breadcrumb-schema");
    if (existingScript) {
      existingScript.remove();
    }

    // Add new script
    const script = document.createElement("script");
    script.id = "breadcrumb-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(breadcrumbList);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("breadcrumb-schema");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [items]);

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      <Link
        href="/"
        className={`flex items-center ${textColor} transition-colors ${hoverColor}`}
      >
        <Home className="h-4 w-4" strokeWidth={1.5} />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className={`h-4 w-4 ${textColor}`} strokeWidth={1.5} />
          {item.href ? (
            <Link
              href={item.href}
              className={`label-luxury ${textColor} transition-colors ${hoverColor}`}
            >
              {item.label}
            </Link>
          ) : (
            <span className={`label-luxury ${currentColor}`}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
