"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { MiniCart } from "@/components/cart/mini-cart";
import { useCartStore } from "@/lib/stores/cart-store";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getItemCount } = useCartStore();
  const cartItemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              VOLLE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:justify-center md:flex-1 md:mx-8">
            <ul className="flex items-center gap-8">
              <li>
                <Link
                  href="/products"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button
              aria-label="Search"
              className="p-2 transition-colors hover:text-primary"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {/* Account Icon */}
            <Link
              href="/account"
              aria-label="Account"
              className="p-2 transition-colors hover:text-primary"
            >
              <User className="h-5 w-5" strokeWidth={1.5} />
            </Link>

            {/* Cart Icon */}
            <MiniCart>
              <button
                aria-label="Shopping Cart"
                className="relative p-2 transition-colors hover:text-primary"
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </button>
            </MiniCart>

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle menu"
              className="p-2 transition-colors hover:text-primary md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link
                href="/products"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/sustainability"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sustainability
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
