import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="mb-6 flex items-center gap-2 text-sm">
      <Link
        href="/"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="h-4 w-4" strokeWidth={1.5} />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight
            className="h-4 w-4 text-muted-foreground"
            strokeWidth={1.5}
          />
          {item.href ? (
            <Link
              href={item.href}
              className="label-luxury text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="label-luxury text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
