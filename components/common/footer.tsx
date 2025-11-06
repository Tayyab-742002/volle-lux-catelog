import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-400 bg-white">
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {/* Shop Column */}
          <div>
            <h3 className="mb-6 text-xs uppercase tracking-wider text-neutral-500">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/products/featured"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  Featured Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/new-arrivals"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="mb-6 text-xs uppercase tracking-wider text-neutral-500">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="mb-6 text-xs uppercase tracking-wider text-neutral-500">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="mb-6 text-xs uppercase tracking-wider text-neutral-500">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+441254916167"
                  className="flex items-start gap-3 text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  <Phone
                    className="h-4 w-4 mt-0.5 shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>01254 916167</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:sales@bubblewrapshop.co.uk"
                  className="flex items-start gap-3 text-sm text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                  <span>sales@bubblewrapshop.co.uk</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-neutral-900">
                  <MapPin
                    className="h-4 w-4 mt-0.5 shrink-0"
                    strokeWidth={1.5}
                  />
                  <address className="not-italic leading-relaxed">
                    Unit 3, GBL House
                    <br />
                    Cleaver Street
                    <br />
                    Blackburn BB1 5DG
                    <br />
                    United Kingdom
                  </address>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <p className="text-xs leading-relaxed text-neutral-500">
                Next day delivery
                <br />
                Eco-friendly options
                {/* <br />
                Automatic bulk pricing */}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-neutral-400 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-xs text-neutral-500">
              © {new Date().getFullYear()} Bubble Wrap Shop (NW) Ltd. All
              rights reserved.
            </p>
            <div className="flex gap-6 text-xs">
              <Link
                href="/privacy"
                className="text-neutral-500 transition-colors hover:text-neutral-900"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-neutral-500 transition-colors hover:text-neutral-900"
              >
                Terms
              </Link>
              <Link
                href="/sustainability"
                className="text-neutral-500 transition-colors hover:text-neutral-900"
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
