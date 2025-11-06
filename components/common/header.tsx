"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Package,
  Settings,
  MapPin,
} from "lucide-react";
import { MiniCart } from "@/components/cart/mini-cart";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import Image from "next/image";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

interface HeaderProps {
  categories?: Category[];
  products?: Product[] | null;
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Packaging Solutions",
    slug: "packaging",
    image:
      "https://images.unsplash.com/photo-1586528116493-a029325540fa?w=400&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Eco Materials",
    slug: "eco-materials",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Protective Packaging",
    slug: "protective",
  },
  {
    id: "4",
    name: "Shipping Supplies",
    slug: "shipping",
  },
];

export function Header({
  categories = MOCK_CATEGORIES,
  products = null,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const { getItemCount } = useCartStore();
  const { user, isAuthenticated, signOut, loading: authLoading } = useAuth();
  const cartItemCount = getItemCount();

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Mark component as mounted to avoid hydration mismatch
    // Using setTimeout to defer state update and avoid cascading renders
    const timer = setTimeout(() => setMounted(true), 0);
    return () => {
      clearTimeout(timer);
      if (megaMenuTimeoutRef.current) {
        clearTimeout(megaMenuTimeoutRef.current);
      }
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      }
    },
    [searchQuery]
  );

  const handleMegaMenuEnter = useCallback(() => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setIsMegaMenuOpen(true);
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
      setActiveCategory(null);
    }, 150);
  }, []);

  return (
    <>
      {/* Compact Header */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-400 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="shrink-0 cursor-pointer">
              <Image
                src="/bubble-wrap-shop.png"
                alt="VOLLE"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <div
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
                className="relative"
              >
                <button className="px-3 py-2 text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors">
                  Products
                </button>
              </div>
              <Link
                href="/sustainability"
                className="px-3 py-2 text-sm font-medium cursor-pointer text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                Sustainability
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-sm font-medium cursor-pointer text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 text-sm font-medium cursor-pointer text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden lg:block">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                    strokeWidth={1.5}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-48 rounded-md border border-neutral-400 bg-white py-1.5 pl-9 pr-3 text-sm focus:w-64 focus:border-neutral-900 focus:outline-none transition-all"
                  />
                </div>
              </form>

              {/* Account */}
              {!authLoading && isAuthenticated ? (
                <div className="hidden lg:block relative group">
                  <button className="p-2 text-neutral-900 hover:text-neutral-600 transition-colors">
                    <User className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-lg bg-white border border-neutral-400 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b border-neutral-400">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/account"
                        className="flex items-center gap-2 rounded px-3 py-2 text-sm cursor-pointer text-neutral-900 hover:bg-neutral-50"
                      >
                        <Settings className="h-4 w-4" />
                        Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-2 rounded px-3 py-2 text-sm cursor-pointer text-neutral-900 hover:bg-neutral-50"
                      >
                        <Package className="h-4 w-4" />
                        Orders
                      </Link>
                      <Link
                        href="/account/addresses"
                        className="flex items-center gap-2 rounded px-3 py-2 text-sm cursor-pointer text-neutral-900 hover:bg-neutral-50"
                      >
                        <MapPin className="h-4 w-4" />
                        Addresses
                      </Link>
                    </div>
                    <div className="border-t border-neutral-400 p-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full rounded px-3 py-2 text-sm cursor-pointer text-neutral-900 hover:bg-neutral-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : !authLoading ? (
                <Link
                  href="/auth/login"
                  className="hidden lg:block px-3 py-2 text-sm font-medium cursor-pointer text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  Sign In
                </Link>
              ) : null}

              {/* Cart */}
              <MiniCart>
                <button className="relative p-2 text-neutral-900 hover:text-neutral-600 transition-colors">
                  <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                  {mounted && cartItemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </button>
              </MiniCart>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 lg:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="h-6 w-6" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Compact Mega Menu */}
        {isMegaMenuOpen && (
          <div
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
            className="hidden lg:block absolute left-0 right-0 top-full border-b border-neutral-400 bg-white shadow-lg"
          >
            <div className="container mx-auto px-6">
              <div className="flex py-6">
                {/* Category Tabs */}
                <div className="w-48 border-r border-neutral-400 pr-6">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onMouseEnter={() => setActiveCategory(category)}
                      className={`w-full text-left px-3 py-2 cursor-pointer text-sm rounded transition-colors ${
                        activeCategory?.id === category.id
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-900 hover:bg-neutral-50"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Featured Products from Active Category */}
                <div className="flex-1 px-6">
                  {activeCategory && (
                    <>
                      {products &&
                      products.filter(
                        (product) =>
                          product.categorySlug === activeCategory.slug
                      ).length > 0 ? (
                        <>
                          <div className="grid grid-cols-4 gap-4">
                            {products
                              .filter(
                                (product) =>
                                  product.categorySlug === activeCategory.slug
                              )
                              .slice(0, 4)
                              .map((product) => (
                                <Link
                                  key={product.id}
                                  href={`/products/${product.slug}`}
                                  className="group block cursor-pointer border border-neutral-400 p-2"
                                  onClick={handleMegaMenuLeave}
                                >
                                  <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-50 ">
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                  </div>
                                  <p className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
                                    {product.name}
                                  </p>
                                </Link>
                              ))}
                          </div>
                          <Link
                            href={`/products?category=${activeCategory.slug}`}
                            className="inline-block mt-4 text-md font-medium cursor-pointer text-neutral-900 hover:text-neutral-600 transition-colors hover:border-b hover:border-neutral-900"
                            onClick={handleMegaMenuLeave}
                          >
                            View all →
                          </Link>
                        </>
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-sm text-neutral-500">
                            No products in this category
                          </p>
                          <Link
                            href={`/products?category=${activeCategory.slug}`}
                            className="inline-block mt-2 text-sm font-medium cursor-pointer text-neutral-900 hover:text-neutral-600 transition-colors"
                            onClick={handleMegaMenuLeave}
                          >
                            Browse category →
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Featured Image (if exists) */}
                {activeCategory?.image && (
                  <div className="w-64 pl-6 border-l border-neutral-400">
                    <Link
                      href={`/products?category=${activeCategory.slug}`}
                      className="block group cursor-pointer border border-neutral-400 p-2"
                      onClick={handleMegaMenuLeave}
                    >
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-50 ">
                        <Image
                          src={activeCategory.image}
                          alt={activeCategory.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="256px"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium cursor-pointer text-neutral-900">
                        {activeCategory.name}
                      </p>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-lg border border-neutral-400 py-2 pl-10 pr-4 text-sm focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </form>

              {!authLoading && isAuthenticated ? (
                <div className="mb-6 rounded-lg bg-neutral-50 p-3">
                  <p className="text-sm font-medium truncate">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {user?.email}
                  </p>
                </div>
              ) : !authLoading ? (
                <Link
                  href="/auth/login"
                  className="mb-6 flex h-10 items-center justify-center rounded-lg bg-neutral-900 text-sm font-medium text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              ) : null}

              <nav className="space-y-1">
                <Link
                  href="/products"
                  className="block rounded px-3 py-2 text-sm font-medium hover:bg-neutral-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="rounded px-3  py-2 text-sm hover:bg-neutral-50 flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Image
                      src={category.image || ""}
                      alt={category.name}
                      width={30}
                      height={30}
                    />
                    {category.name}
                  </Link>
                ))}
                <div className="my-4 border-t border-neutral-400" />
                <Link
                  href="/sustainability"
                  className="block rounded px-3 py-2 text-sm hover:bg-neutral-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sustainability
                </Link>
                <Link
                  href="/about"
                  className="block rounded px-3 py-2 text-sm hover:bg-neutral-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block rounded px-3 py-2 text-sm hover:bg-neutral-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>

              {isAuthenticated && (
                <>
                  <div className="my-4 border-t border-neutral-400" />
                  <nav className="space-y-1">
                    <Link
                      href="/account"
                      className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-neutral-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-neutral-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full rounded px-3 py-2 text-sm hover:bg-neutral-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
