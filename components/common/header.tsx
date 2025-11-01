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
  Phone,
  Mail,
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
      {
        id: "prod-3",
        name: "Custom Gift Boxes",
        slug: "custom-gift-boxes",
        image:
          "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&auto=format&fit=crop",
        price: 2.99,
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
      { id: "2-4", name: "Plant-Based Materials", slug: "plant-based" },
    ],
    products: [
      {
        id: "prod-4",
        name: "Recycled Kraft Paper",
        slug: "recycled-kraft-paper",
        image:
          "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=300&auto=format&fit=crop",
        price: 1.99,
      },
      {
        id: "prod-5",
        name: "Biodegradable Film Wrap",
        slug: "biodegradable-film-wrap",
        image:
          "https://images.unsplash.com/photo-1577702312576-5318f847145b?w=300&auto=format&fit=crop",
        price: 4.99,
      },
      {
        id: "prod-6",
        name: "Compostable Produce Bags",
        slug: "compostable-produce-bags",
        image:
          "https://images.unsplash.com/photo-1577702312576-5318f847145b?w=300&auto=format&fit=crop",
        price: 2.49,
      },
    ],
  },
  {
    id: "3",
    name: "Protective Packaging",
    slug: "protective",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop",
    subcategories: [
      { id: "3-1", name: "Bubble Wrap", slug: "bubble-wrap" },
      { id: "3-2", name: "Foam Inserts", slug: "foam-inserts" },
      { id: "3-3", name: "Air Pillows", slug: "air-pillows" },
      { id: "3-4", name: "Paper Fill", slug: "paper-fill" },
    ],
    products: [
      {
        id: "prod-7",
        name: "Premium Bubble Wrap",
        slug: "premium-bubble-wrap",
        image:
          "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&auto=format&fit=crop",
        price: 6.99,
      },
      {
        id: "prod-8",
        name: "Air Pillow Cushions",
        slug: "air-pillow-cushions",
        image:
          "https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?w=300&auto=format&fit=crop",
        price: 5.49,
      },
      {
        id: "prod-9",
        name: "Foam Inserts",
        slug: "foam-inserts",
        image:
          "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&auto=format&fit=crop",
        price: 8.99,
      },
    ],
  },
  {
    id: "4",
    name: "Shipping Supplies",
    slug: "shipping",
    image:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&auto=format&fit=crop",
    subcategories: [
      { id: "4-1", name: "Packing Tape", slug: "packing-tape" },
      { id: "4-2", name: "Labels & Stickers", slug: "labels-stickers" },
      { id: "4-3", name: "Stretch Film", slug: "stretch-film" },
      { id: "4-4", name: "Strapping", slug: "strapping" },
    ],
    products: [
      {
        id: "prod-10",
        name: "Heavy Duty Packing Tape",
        slug: "heavy-duty-packing-tape",
        image:
          "https://images.unsplash.com/photo-1560448204-e5e5d6e2d37e?w=300&auto=format&fit=crop",
        price: 3.99,
      },
      {
        id: "prod-11",
        name: "Shipping Labels Pack",
        slug: "shipping-labels-pack",
        image:
          "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&auto=format&fit=crop",
        price: 7.99,
      },
      {
        id: "prod-12",
        name: "Stretch Film Roll",
        slug: "stretch-film-roll",
        image:
          "https://images.unsplash.com/photo-1560448204-e5e5d6e2d37e?w=300&auto=format&fit=crop",
        price: 12.99,
      },
    ],
  },
  {
    id: "5",
    name: "Retail Packaging",
    slug: "retail",
    image:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&auto=format&fit=crop",
    subcategories: [
      { id: "5-1", name: "Shopping Bags", slug: "shopping-bags" },
      { id: "5-2", name: "Product Boxes", slug: "product-boxes" },
      { id: "5-3", name: "Tissue Paper", slug: "tissue-paper" },
      { id: "5-4", name: "Ribbon & Twine", slug: "ribbon-twine" },
    ],
    products: [
      {
        id: "prod-13",
        name: "Luxury Shopping Bag",
        slug: "luxury-shopping-bag",
        image:
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&auto=format&fit=crop",
        price: 8.99,
      },
      {
        id: "prod-14",
        name: "Product Gift Box",
        slug: "product-gift-box",
        image:
          "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=300&auto=format&fit=crop",
        price: 4.99,
      },
      {
        id: "prod-15",
        name: "Decorative Tissue Paper",
        slug: "decorative-tissue-paper",
        image:
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&auto=format&fit=crop",
        price: 2.99,
      },
    ],
  },
  {
    id: "6",
    name: "Food Packaging",
    slug: "food",
    image:
      "https://images.unsplash.com/photo-1610337673044-720471f83677?w=400&auto=format&fit=crop",
    subcategories: [
      { id: "6-1", name: "Takeout Containers", slug: "takeout-containers" },
      { id: "6-2", name: "Food Wraps", slug: "food-wraps" },
      { id: "6-3", name: "Beverage Carriers", slug: "beverage-carriers" },
      { id: "6-4", name: "Bakery Boxes", slug: "bakery-boxes" },
    ],
    products: [
      {
        id: "prod-16",
        name: "Eco Takeout Container",
        slug: "eco-takeout-container",
        image:
          "https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=300&auto=format&fit=crop",
        price: 2.49,
      },
      {
        id: "prod-17",
        name: "Bakery Display Box",
        slug: "bakery-display-box",
        image:
          "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&auto=format&fit=crop",
        price: 5.99,
      },
      {
        id: "prod-18",
        name: "Cardboard Food Tray",
        slug: "cardboard-food-tray",
        image:
          "https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=300&auto=format&fit=crop",
        price: 1.99,
      },
    ],
  },
];

export function Header({ categories = MOCK_CATEGORIES }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const { getItemCount } = useCartStore();
  const { user, isAuthenticated, signOut, loading: authLoading } = useAuth();
  const cartItemCount = getItemCount();

  // Ref to store the timeout for closing mega menu
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
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
    // Clear any pending timeout
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
    // Set timeout to close menu after 300ms delay
    megaMenuTimeoutRef.current = setTimeout(() => {
    setIsMegaMenuOpen(false);
    setHoveredCategory(null);
    }, 300);
  }, []);

  const handleCategoryHover = useCallback((category: Category) => {
    setHoveredCategory(category);
  }, []);

  const displayedCategory = useMemo(() => hoveredCategory, [hoveredCategory]);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-10 text-xs">
            <div className="flex items-center gap-6">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>+1 (234) 567-890</span>
              </a>
              <a
                href="mailto:info@volle.com"
                className="flex items-center gap-2 hover:text-muted-foreground transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>info@volle.com</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/track-order"
                className="hover:text-muted-foreground transition-colors"
              >
                Track Order
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link
                href="/help"
                className="hover:text-muted-foreground transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-20 items-center justify-between gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 text-2xl font-bold tracking-tight text-foreground"
              aria-label="VOLLE Home"
            >
              VOLLE
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <div
                  onMouseEnter={handleMegaMenuEnter}
                  onMouseLeave={handleMegaMenuLeave}
                  className="relative"
                >
                  <button
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground transition-colors"
                    aria-expanded={isMegaMenuOpen}
                  >
                    Products
                  </button>
              </div>

              {/* <Link
                href="/solutions"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground transition-colors"
                  >
                Solutions
              </Link> */}

                  <Link
                    href="/sustainability"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground transition-colors"
                  >
                    Sustainability
                  </Link>

              <Link
                href="/about"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>

                  <Link
                    href="/contact"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>

              {isAuthenticated && user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden lg:block">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-64 h-10 pl-10 pr-4 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </form>

              {/* Mobile Search */}
              <Link
                href="/search"
                className="lg:hidden p-2.5 hover:bg-primary rounded-lg transition-colors"
              >
                <Search className="h-5 w-5 text-foreground" strokeWidth={1.5} />
              </Link>

              {/* Account */}
              {!authLoading && isAuthenticated ? (
                <div className="hidden lg:block relative group">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:text-foreground hover:bg-primary rounded-lg transition-colors">
                    <User className="h-5 w-5" strokeWidth={1.5} />
                    <span>{user?.fullName || user?.email || "User"}</span>
                  </button>

                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-primary rounded-lg transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-primary rounded-lg transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        Orders
                      </Link>
                      <Link
                        href="/account/addresses"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-primary rounded-lg transition-colors"
                      >
                        <MapPin className="h-4 w-4" />
                        Addresses
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-primary rounded-lg transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}
                    </div>
                    <div className="p-1.5 border-t border-border">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-destructive hover:bg-primary rounded-lg transition-colors"
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
                  className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:text-foreground transition-colors"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                  Sign In
                </Link>
              ) : null}

              {/* Cart */}
              <MiniCart>
                <button className="relative p-2.5 hover:bg-primary rounded-lg transition-colors">
                  <ShoppingCart
                    className="h-5 w-5 text-foreground"
                    strokeWidth={1.5}
                  />
                  {mounted && cartItemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </button>
              </MiniCart>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-primary rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" strokeWidth={1.5} />
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
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border border-neutral-300 shadow-xl"
          >
            <div className="container mx-auto px-6 py-8">
              <div className="flex gap-12">
                {/* Categories Column */}
                <div className="w-64 shrink-0">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                    Categories
                  </h3>
                  <nav className="space-y-0.5">
                    {categories.map((category) => (
                        <button
                        key={category.id}
                          onMouseEnter={() => handleCategoryHover(category)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm rounded-lg transition-colors ${
                            hoveredCategory?.id === category.id
                            ? "bg-primary text-white"
                            : "text-foreground hover:bg-primary"
                          }`}
                        >
                          <span className="font-medium">{category.name}</span>
                        <ChevronRight className="h-4 w-4" />
                        </button>
                    ))}
                  </nav>
                </div>

                {/* Subcategories Grid */}
                {displayedCategory && (
                  <div className="flex-1 grid grid-cols-3 gap-8">
                    <div className="col-span-2">
                      <h4 className="text-sm font-semibold text-foreground mb-4">
                      {displayedCategory.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6">
                      {displayedCategory.subcategories?.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/products?category=${displayedCategory.slug}&subcategory=${sub.slug}`}
                            className="text-sm text-foreground hover:text-primary transition-colors py-1.5"
                            onClick={handleMegaMenuLeave}
                          >
                              {sub.name}
                          </Link>
                        ))}
                      </div>

                      {/* Featured Products */}
                      {displayedCategory.products &&
                        displayedCategory.products.length > 0 && (
                          <div>
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                              Featured Products
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                              {displayedCategory.products.map((product) => (
                                <Link
                                  key={product.id}
                                  href={`/products/${product.slug}`}
                                  className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                                  onClick={handleMegaMenuLeave}
                                >
                                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      className="object-cover transition-transform group-hover:scale-105"
                                      sizes="48px"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-medium text-foreground">
                                      {product.name}
                                    </p>
                                    <p className="text-xs font-semibold text-primary">
                                      ${product.price.toFixed(2)}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                    <Link
                      href={`/products?category=${displayedCategory.slug}`}
                        className="inline-flex items-center gap-1 mt-6 text-sm text-primary font-semibold hover:gap-2 transition-all"
                      onClick={handleMegaMenuLeave}
                    >
                        View All {displayedCategory.name}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                    {/* Small Featured Image */}
                    <div className="col-span-1">
                      {displayedCategory.image && (
                    <Link
                      href={`/products?category=${displayedCategory.slug}`}
                      className="block group"
                      onClick={handleMegaMenuLeave}
                    >
                          <div className="relative h-48 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={displayedCategory.image}
                          alt={displayedCategory.name}
                          fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="300px"
                        />
                            <div className="absolute inset-0 bg-linear-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                      )}
                    </div>
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
            className="absolute inset-0 bg-primary/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold text-foreground">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-primary rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {!authLoading && isAuthenticated ? (
                <div className="p-4 bg-primary rounded-lg mb-6">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {user?.email}
                  </p>
                </div>
              ) : !authLoading ? (
                <div className="space-y-3 mb-6">
                  <Link
                    href="/auth/login"
                    className="block w-full px-4 py-3 text-center text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/80 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full px-4 py-3 text-center text-sm font-semibold text-foreground border border-border rounded-lg hover:bg-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              ) : (
                <div className="p-4 bg-primary rounded-lg mb-6">
                  <p className="text-sm font-semibold text-foreground truncate">
                    Loading...
                  </p>
                </div>
              )}

              <nav className="space-y-1">
                <div>
                  <button
                    onClick={() =>
                      setIsMobileProductsOpen(!isMobileProductsOpen)
                    }
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-primary rounded-lg transition-colors"
                  >
                    Products
                    <ChevronRight
                      className={`h-5 w-5 transition-transform ${
                        isMobileProductsOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {isMobileProductsOpen && (
                    <div className="mt-1 ml-4 space-y-1">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.slug}`}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary rounded-lg transition-colors"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsMobileProductsOpen(false);
                          }}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* <Link
                  href="/solutions"
                  className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Solutions
                </Link> */}

                <Link
                  href="/sustainability"
                  className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sustainability
                </Link>

                <Link
                  href="/about"
                  className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                {isAuthenticated && user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-primary rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
              </nav>

              {isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-border space-y-1">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-primary rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-primary rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="h-5 w-5" />
                    Orders
                  </Link>
                  <Link
                    href="/account/addresses"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-primary rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MapPin className="h-5 w-5" />
                    Addresses
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-primary rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
