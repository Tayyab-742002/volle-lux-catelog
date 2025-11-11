"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ShieldCheck,
} from "lucide-react";
import { MiniCart } from "@/components/cart/mini-cart";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import Image from "next/image";
import { Category } from "@/types/category";

interface HeaderProps {
  categories?: Category[];
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

export function Header({ categories = MOCK_CATEGORIES }: HeaderProps) {
  const router = useRouter();
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
    const timer = setTimeout(() => setMounted(true), 0);
    return () => {
      clearTimeout(timer);
      if (megaMenuTimeoutRef.current) {
        clearTimeout(megaMenuTimeoutRef.current);
      }
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    const result = await signOut();
    if (result.success) {
      // Redirect to home page after successful signout
      router.push("/");
    }
  }, [signOut, router]);

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
      {/* Eco-Friendly Header with Gradient */}
      <header className="sticky top-0 z-50 w-full bg-linear-to-r from-emerald-600  to-teal-600 shadow-lg backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="shrink-0 cursor-pointer group">
              <Image
                src="logo.jpg"
                alt="Logo"
                width={100}
                height={32}
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <div
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
                className="relative"
              >
                <button className="px-4 py-2 text-sm font-normal text-white cursor-pointer hover:bg-white/10 rounded-lg transition-all duration-300">
                  Products
                </button>
              </div>
              <Link
                href="/sustainability"
                className="px-4 py-2 text-sm font-normal cursor-pointer text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                Sustainability
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-sm font-normal cursor-pointer text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 text-sm font-normal cursor-pointer text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                Contact
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden lg:block">
                <div className="relative group">
                  <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600 transition-colors group-focus-within:text-emerald-700"
                    strokeWidth={2}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-48 rounded-lg border-2 border-white/20 bg-white/95 py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:w-64 focus:border-white focus:outline-none focus:ring-0 transition-all duration-300"
                  />
                </div>
              </form>

              {/* Account */}
              {!authLoading && isAuthenticated ? (
                <div className="hidden lg:block relative group">
                  <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                    <User className="h-5 w-5" strokeWidth={2} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-emerald-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="p-3 border-b border-emerald-100 bg-linear-to-r from-emerald-50 to-teal-50">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1">
                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors font-semibold shadow-md mb-1"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/account"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer text-gray-900 hover:bg-emerald-50 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-emerald-600" />
                        Account
                      </Link>
                      <Link
                        href="/account?tab=orders"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer text-gray-900 hover:bg-emerald-50 transition-colors"
                      >
                        <Package className="h-4 w-4 text-emerald-600" />
                        Orders
                      </Link>
                      <Link
                        href="/account?tab=addresses"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer text-gray-900 hover:bg-emerald-50 transition-colors"
                      >
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        Addresses
                      </Link>
                    </div>
                    <div className="border-t border-emerald-100 p-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm cursor-pointer text-red-600 hover:bg-red-50 transition-colors"
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
                  className="hidden lg:block px-4 py-2 text-sm font-semibold cursor-pointer text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  Sign In
                </Link>
              ) : null}

              {/* Cart */}
              <MiniCart>
                <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300 group">
                  <ShoppingCart
                    className="h-5 w-5 group-hover:scale-110 transition-transform"
                    strokeWidth={2}
                  />
                  {mounted && cartItemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-r from-orange-600 to-red-600 text-[10px] font-bold text-white shadow-lg animate-pulse">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </button>
              </MiniCart>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 lg:hidden text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" strokeWidth={2} />
                ) : (
                  <Menu className="h-6 w-6" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Eco-Friendly Mega Menu */}
        {isMegaMenuOpen && (
          <div
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
            className="hidden lg:block absolute left-0 right-0 top-full border-b border-emerald-200 bg-white shadow-2xl"
          >
            <div className="container mx-auto px-6">
              <div className="flex py-6">
                {/* Category Tabs */}
                <div className="w-48 border-r border-emerald-100 pr-6">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onMouseEnter={() => setActiveCategory(category)}
                      className={`w-full text-left px-3 py-2 cursor-pointer text-sm rounded-lg transition-all duration-300 ${
                        activeCategory?.id === category.id
                          ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                          : "text-gray-900 hover:bg-emerald-50"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Category Description and CTA - PERFORMANCE: Removed product grid to reduce bundle */}
                <div className="flex-1 px-6">
                  {activeCategory && (
                    <div className="py-8">
                      {activeCategory.description && (
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-2xl">
                          {activeCategory.description}
                        </p>
                      )}
                      <Link
                        href={`/products?category=${activeCategory.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold cursor-pointer text-white bg-linear-to-r from-emerald-600 to-teal-600 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                        onClick={handleMegaMenuLeave}
                      >
                        Browse {activeCategory.name}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Featured Image */}
                {activeCategory?.image && (
                  <div className="w-64 pl-6 border-l border-emerald-100">
                    <Link
                      href={`/products?category=${activeCategory.slug}`}
                      className="block group cursor-pointer border-2 border-emerald-100 hover:border-emerald-300 p-3 rounded-xl transition-all duration-300 hover:shadow-lg"
                      onClick={handleMegaMenuLeave}
                    >
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-linear-to-br from-emerald-50 to-teal-50">
                        <Image
                          src={activeCategory.image}
                          alt={activeCategory.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="256px"
                        />
                      </div>
                      <p className="mt-2 text-sm font-semibold cursor-pointer text-gray-900 group-hover:text-emerald-600 transition-colors">
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

      {/* Mobile Menu with Eco Design */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-linear-to-b from-white to-emerald-50 overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-gray-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-900" />
                </button>
              </div>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-lg border-2 border-emerald-200 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
              </form>

              {!authLoading && isAuthenticated ? (
                <div className="mb-6 rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 p-4 border border-emerald-200">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email}
                  </p>
                </div>
              ) : !authLoading ? (
                <Link
                  href="/auth/login"
                  className="mb-6 flex h-10 items-center justify-center rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 text-sm font-semibold text-white hover:shadow-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              ) : null}

              <nav className="space-y-1">
                <Link
                  href="/products"
                  className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-emerald-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="rounded-lg px-3 py-2 text-sm hover:bg-emerald-100 transition-colors flex items-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={32}
                        height={32}
                        className="rounded-lg"
                      />
                    )}
                    {category.name}
                  </Link>
                ))}
                <div className="my-4 border-t border-emerald-200" />
                <Link
                  href="/sustainability"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-emerald-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sustainability
                </Link>
                <Link
                  href="/about"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-emerald-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-emerald-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>

              {isAuthenticated && (
                <>
                  <div className="my-4 border-t border-emerald-200" />
                  <nav className="space-y-1">
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors font-semibold shadow-md mb-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-emerald-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-emerald-600" />
                      Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-emerald-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 text-emerald-600" />
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm hover:bg-red-100 text-red-600 transition-colors"
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
