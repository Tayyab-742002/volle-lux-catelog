import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

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

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm">
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
