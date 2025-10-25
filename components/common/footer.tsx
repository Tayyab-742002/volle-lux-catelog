import Link from "next/link";
import { Package, HeadphonesIcon, Building2, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Shop Column */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
              <Package className="h-4 w-4" strokeWidth={1.5} />
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm transition-colors hover:text-primary"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/categories"
                  className="text-sm transition-colors hover:text-primary"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/products/featured"
                  className="text-sm transition-colors hover:text-primary"
                >
                  Featured Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/new-arrivals"
                  className="text-sm transition-colors hover:text-primary"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
              <HeadphonesIcon className="h-4 w-4" strokeWidth={1.5} />
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm transition-colors hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery"
                  className="text-sm transition-colors hover:text-primary"
                >
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm transition-colors hover:text-primary"
                >
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm transition-colors hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
              <Building2 className="h-4 w-4" strokeWidth={1.5} />
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="text-sm transition-colors hover:text-primary"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-colors hover:text-primary"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" strokeWidth={1.5} />
                <a
                  href="mailto:info@volle.com"
                  className="transition-colors hover:text-primary"
                >
                  info@volle.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-muted-foreground">
                NEXT DAY DELIVERY • ECO-FRIENDLY OPTIONS • AUTOMATIC BULK
                PRICING
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Volle. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="transition-colors hover:text-primary"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-primary"
              >
                Terms
              </Link>
              <Link
                href="/sustainability"
                className="transition-colors hover:text-primary"
              >
                Sustainability
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
