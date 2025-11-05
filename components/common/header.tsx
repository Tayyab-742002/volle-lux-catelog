"use client";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Package,
  Settings,
  MapPin,
} from "lucide-react";
import { MiniCart } from "@/components/cart/mini-cart";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import Image from "next/image";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

interface CategoryProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  subcategories?: SubCategory[];
  products?: CategoryProduct[];
}

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
    subcategories: [
      { id: "1-1", name: "Corrugated Boxes", slug: "corrugated-boxes" },
      { id: "1-2", name: "Mailer Boxes", slug: "mailer-boxes" },
      { id: "1-3", name: "Shipping Boxes", slug: "shipping-boxes" },
      { id: "1-4", name: "Custom Packaging", slug: "custom-packaging" },
    ],
    products: [
      {
        id: "prod-1",
        name: "Heavy Duty Shipping Boxes",
        slug: "heavy-duty-shipping-boxes",
        image:
          "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&auto=format&fit=crop",
        price: 1.99,
      },
      {
        id: "prod-2",
        name: "Corrugated Mailers",
        slug: "corrugated-mailers",
        image:
          "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&auto=format&fit=crop",
        price: 1.49,
      },
    ],
  },
  {
    id: "2",
    name: "Eco Materials",
    slug: "eco-materials",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop",
    subcategories: [
      { id: "2-1", name: "Recycled Paper", slug: "recycled-paper" },
      { id: "2-2", name: "Biodegradable Films", slug: "biodegradable-films" },
      { id: "2-3", name: "Compostable Bags", slug: "compostable-bags" },
    ],
  },
];

export function Header({ categories = MOCK_CATEGORIES }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const { getItemCount } = useCartStore();
  const { user, isAuthenticated, signOut, loading: authLoading } = useAuth();
  const cartItemCount = getItemCount();

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => {
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
    if (categories.length > 0) {
      setHoveredCategory(categories[0]);
    }
  }, [categories]);

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
      setHoveredCategory(null);
    }, 200);
  }, []);

  const handleCategoryHover = useCallback((category: Category) => {
    setHoveredCategory(category);
  }, []);

  const displayedCategory = useMemo(() => hoveredCategory, [hoveredCategory]);

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-400 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-light tracking-wider text-neutral-900"
              aria-label="VOLLE Home"
            >
              <Image
                src="/bubble-wrap-shop.png"
                alt="VOLLE"
                width={100}
                height={100}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <div
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
                className="relative"
              >
                <button className="text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors">
                  Products
                </button>
              </div>
              <Link
                href="/sustainability"
                className="text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                Sustainability
              </Link>
              <Link
                href="/about"
                className="text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
              {/* Search */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden"
                aria-label="Search"
              >
                <Search
                  className="h-5 w-5 text-neutral-900"
                  strokeWidth={1.5}
                />
              </button>

              <form onSubmit={handleSearch} className="hidden lg:block">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-48 border-b border-neutral-300 bg-transparent pb-1 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
              </form>

              {/* Account */}
              {!authLoading && isAuthenticated ? (
                <div className="hidden lg:block relative group">
                  <button className="flex items-center gap-2 text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors">
                    <User className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                  <div className="absolute right-0 top-full mt-4 w-56 bg-white border border-neutral-400 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-4 border-b border-neutral-200">
                      <p className="text-sm font-normal text-neutral-900 truncate">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-neutral-500 truncate mt-1">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50 transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        Orders
                      </Link>
                      <Link
                        href="/account/addresses"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50 transition-colors"
                      >
                        <MapPin className="h-4 w-4" />
                        Addresses
                      </Link>
                    </div>
                    <div className="p-2 border-t border-neutral-400">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50 transition-colors"
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
                  className="hidden lg:flex items-center gap-2 text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </Link>
              ) : null}

              {/* Cart */}
              <MiniCart>
                <button className="relative">
                  <ShoppingCart
                    className="h-5 w-5 text-neutral-900"
                    strokeWidth={1.5}
                  />
                  {mounted && cartItemCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-normal text-white">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </button>
              </MiniCart>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-neutral-900" strokeWidth={1.5} />
                ) : (
                  <Menu
                    className="h-6 w-6 text-neutral-900"
                    strokeWidth={1.5}
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        {isMegaMenuOpen && (
          <div
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
            className="hidden lg:block absolute left-0 right-0 top-full border-t border-neutral-400 bg-white"
          >
            <div className="container mx-auto px-6 py-12">
              <div className="grid grid-cols-4 gap-12">
                {/* Categories Navigation */}
                <div>
                  <h3 className="mb-6 text-xs uppercase tracking-wider text-neutral-500">
                    Categories
                  </h3>
                  <nav className="space-y-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onMouseEnter={() => handleCategoryHover(category)}
                        className={`block text-sm font-normal transition-colors ${
                          hoveredCategory?.id === category.id
                            ? "text-neutral-900"
                            : "text-neutral-600 hover:text-neutral-900"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Subcategories */}
                {displayedCategory && displayedCategory.subcategories && (
                  <div className="col-span-2">
                    <h4 className="mb-6 text-xs uppercase tracking-wider text-neutral-500">
                      {displayedCategory.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {displayedCategory.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/products?category=${displayedCategory.slug}&subcategory=${sub.slug}`}
                          className="text-sm text-neutral-900 hover:text-neutral-600 transition-colors"
                          onClick={handleMegaMenuLeave}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={`/products?category=${displayedCategory.slug}`}
                      className="group inline-flex items-center gap-2 mt-8 text-sm text-neutral-900 hover:text-neutral-600 transition-colors"
                      onClick={handleMegaMenuLeave}
                    >
                      View All {displayedCategory.name}
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                )}

                {/* Featured Image */}
                {displayedCategory?.image && (
                  <div>
                    <Link
                      href={`/products?category=${displayedCategory.slug}`}
                      className="block group"
                      onClick={handleMegaMenuLeave}
                    >
                      <div className="relative h-64 overflow-hidden bg-neutral-50">
                        <Image
                          src={displayedCategory.image}
                          alt={displayedCategory.name}
                          fill
                          className="object-cover transition-opacity duration-500 group-hover:opacity-75"
                          sizes="300px"
                        />
                      </div>
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
            className="absolute inset-0 bg-neutral-900/20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-normal text-neutral-900">
                  Menu
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-neutral-900" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-8">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products"
                  className="w-full border-b border-neutral-300 bg-transparent pb-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none transition-colors"
                />
              </form>

              {/* Auth Section */}
              {!authLoading && isAuthenticated ? (
                <div className="mb-8 pb-8 border-b border-neutral-400">
                  <p className="text-sm font-normal text-neutral-900 truncate">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs text-neutral-500 truncate mt-1">
                    {user?.email}
                  </p>
                </div>
              ) : !authLoading ? (
                <div className="mb-8 pb-8 border-b border-neutral-400">
                  <Link
                    href="/auth/login"
                    className="block text-sm text-neutral-900 hover:text-neutral-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              ) : null}

              {/* Navigation */}
              <nav className="space-y-6">
                <div>
                  <Link
                    href="/products"
                    className="block text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <div className="mt-3 ml-4 space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/sustainability"
                  className="block text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sustainability
                </Link>
                <Link
                  href="/about"
                  className="block text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>

              {/* Account Links */}
              {isAuthenticated && (
                <div className="mt-8 pt-8 border-t border-neutral-400 space-y-4">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 text-sm text-neutral-900 hover:text-neutral-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-3 text-sm text-neutral-900 hover:text-neutral-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="h-5 w-5" />
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-sm text-neutral-900 hover:text-neutral-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
