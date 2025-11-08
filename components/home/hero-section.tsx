"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BicepsFlexed,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Sprout,
  Truck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Sample banner data - replace with your actual banners
const BANNERS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1583496597549-0fd8b25e34e2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1742",
    title: "Premium Packaging",
    subtitle: "Elevate your brand with luxury solutions",
    alt: "Premium packaging solutions",
    gradient: "from-emerald-600/10 via-teal-600/10 to-transparent",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1585432959381-cd73eeed6e3d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1742",
    title: "50% OFF",
    subtitle: "Limited time offer on bulk orders",
    alt: "50% discount banner",
    gradient: "from-emerald-600/10 via-teal-600/10 to-transparent",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1586957960362-65815d739527?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1742",
    title: "New Arrivals",
    subtitle: "Discover our latest eco-friendly collection",
    alt: "New products banner",
    gradient: "from-emerald-600/10 via-teal-600/10 to-transparent",
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      } else {
        router.push("/products");
      }
    },
    [searchQuery, router]
  );

  return (
    <div className="relative w-full overflow-hidden ">
      {/* Main Carousel */}
      <div
        className="relative z-10 mx-auto max-w-[1600px] px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 lg:pt-12"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative h-[280px] sm:h-[380px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl">
          {/* Slides */}
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <Image
                src={banner.image}
                alt={banner.alt}
                fill
                className="w-full h-full object-cover"
                quality={95}
                sizes="100vw"
              />

              {/* Dynamic Gradient Overlay - Eco colors */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${banner.gradient}`}
              />

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-4 md:px-6">
                <div className="text-center w-full max-w-4xl">
                  <div
                    className={`transform transition-all duration-1000 delay-300 ${
                      index === currentSlide
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                  >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4 lg:mb-6 drop-shadow-2xl tracking-tight leading-tight sm:leading-none">
                      {banner.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-white font-light drop-shadow-lg px-2 sm:px-0 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                      {banner.subtitle}
                    </p>

                    <Link
                      href={"/products"}
                      className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 xl:mt-10 px-6 sm:px-7 md:px-8 lg:px-10 xl:px-12 py-2.5 sm:py-3 md:py-3.5 lg:py-4  cursor-pointer bg-white text-emerald-700 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-emerald-50 active:bg-emerald-100 transform hover:scale-105 active:scale-95 transition-all shadow-xl sm:shadow-2xl border-2 border-emerald-700/50 min-h-[44px] min-w-[120px] touch-manipulation"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows - Touch-friendly on mobile (min 44x44px) */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-3 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 active:bg-white/40 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10 group touch-manipulation min-h-[44px] min-w-[44px]"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white group-active:scale-90 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-3 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 active:bg-white/40 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10 group touch-manipulation min-h-[44px] min-w-[44px]"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white group-active:scale-90 transition-transform" />
          </button>

          {/* Dots Indicator - Touch-friendly */}
          <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 md:gap-3 z-10">
            {BANNERS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all rounded-full touch-manipulation ${
                  index === currentSlide
                    ? "w-10 sm:w-12 md:w-14 lg:w-16 h-2.5 sm:h-2.5 md:h-2.5 lg:h-2.5 bg-white shadow-lg"
                    : "w-2.5 sm:w-2.5 md:w-2.5 lg:w-2.5 h-2.5 sm:h-2.5 md:h-2.5 lg:h-2.5 bg-white/40 hover:bg-white/60 active:bg-white/70 min-h-[10px] min-w-[10px]"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search & Info Section */}
      <div className="relative z-10 mx-auto max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight">
            Professional
            <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-1 sm:mt-2">
              Packaging Solutions
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-light px-2 sm:px-0">
            Premium eco-friendly quality for businesses that demand excellence
          </p>
        </div>

        {/* Search Bar - Responsive layout: stacks on mobile, horizontal on tablet+ */}
        <div className="max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-14 lg:mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 rounded-xl sm:rounded-2xl blur-xl opacity-15 sm:opacity-20 group-hover:opacity-25 sm:group-hover:opacity-30 transition-opacity"></div>
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-emerald-600 overflow-hidden">
              <div className="relative flex items-center flex-1">
                <div className="pl-4 sm:pl-5 md:pl-6 shrink-0">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                </div>
                <form
                  onSubmit={handleSearch}
                  className="flex-1 flex items-center min-w-0"
                >
                  <input
                    type="search"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-3.5 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6 text-sm sm:text-base md:text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent min-w-0"
                  />
                </form>
              </div>

              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  const formEvent =
                    e as unknown as React.FormEvent<HTMLFormElement>;
                  handleSearch(formEvent);
                }}
                className="cursor-pointer m-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid - Responsive stacking */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          <div className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-md sm:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 border border-gray-300">
            <div className="relative">
              <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-3 sm:mb-4 md:mb-5 group-hover:scale-110 group-active:scale-95 transition-transform shadow-lg">
                <Truck className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                Express shipping in 2-3 business days
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 lg:p-8  shadow-2xl  transition-all duration-300 border border-gray-300">
            <div className="relative">
              <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-3 sm:mb-4 md:mb-5 group-hover:scale-110 group-active:scale-95 transition-transform shadow-lg">
                <BicepsFlexed className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                Quality Assured
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                100% satisfaction guarantee
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-md sm:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 border border-gray-300">
            <div className="relative">
              <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-3 sm:mb-4 md:mb-5 group-hover:scale-110 group-active:scale-95 transition-transform shadow-lg">
                <Sprout className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                Eco-Friendly
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                Sustainable materials and practices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
