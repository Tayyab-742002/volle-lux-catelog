import Link from "next/link";
import { Mail, Phone, MapPin, Leaf } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative bg-linear-to-br from-emerald-950 to-teal-950 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full mix-blend-lighten filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500 rounded-full mix-blend-lighten filter blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-16 md:py-20">
        {/* Logo and Tagline */}
        <div className="mb-12 pb-12 border-b border-emerald-800/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Image
                src="/logo.jpg"
                alt="Bubble Wrap Shop"
                width={120}
                height={40}
                className="h-12 w-auto mb-4"
              />
              <p className="text-sm text-emerald-200 max-w-md">
                Your trusted UK partner for packaging supplies including bubble wrap, cardboard boxes, packing tape, shipping boxes, and protective packaging. Quality packaging materials with next-day delivery across the UK. Buy packaging supplies online with wholesale pricing available.
              </p>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-linear-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
              <Leaf className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">
                Eco-Friendly
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {/* Shop Column */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-emerald-400"></div>
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  Categories
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/products/featured"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  Featured Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/new-arrivals"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  New Arrivals
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-emerald-400"></div>
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  FAQ
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/delivery"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  Delivery Information
                </Link>
              </li> */}
              <li>
                <Link
                  href="/refund-policy"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-emerald-400"></div>
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-300 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300"></span>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-emerald-400"></div>
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+441254916167"
                  className="flex items-start gap-3 text-sm text-gray-300 transition-colors hover:text-emerald-400 group"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                    <Phone
                      className="h-4 w-4 text-emerald-400"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="mt-1.5">01254 916167</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:sales@bubblewrapshop.co.uk"
                  className="flex items-start gap-3 text-sm text-gray-300 transition-colors hover:text-emerald-400 group"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-teal-500/20 transition-colors">
                    <Mail
                      className="h-4 w-4 text-emerald-400"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="mt-1.5">sales@bubblewrapshop.co.uk</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-gray-300 group">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <MapPin
                      className="h-4 w-4 text-emerald-400"
                      strokeWidth={2}
                    />
                  </div>
                  <address className="not-italic leading-relaxed mt-1.5">
                    Unit BR16 Blakewater Road
                    <br />
                    Blackburn, England, BB1 5QF
                    <br />
                    United Kingdom
                  </address>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-emerald-800/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Bubble wrap shop (Blackburn) Limited. All
              rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 transition-colors hover:text-emerald-400"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 transition-colors hover:text-emerald-400"
              >
                Terms
              </Link>
              <Link
                href="/sustainability"
                className="text-gray-400 transition-colors hover:text-emerald-400"
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
