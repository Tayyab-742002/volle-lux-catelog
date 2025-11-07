"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

// Sample banner data - replace with your actual banners
const BANNERS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1543463573-35e4afd0ab43?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    title: "Premium Packaging",
    subtitle: "Elevate your brand with luxury solutions",
    alt: "Premium packaging solutions",
    gradient: "from-emerald-600/10 via-teal-600/10 to-transparent",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1617909517054-64d4958be1c9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    title: "50% OFF",
    subtitle: "Limited time offer on bulk orders",
    alt: "50% discount banner",
    gradient: "from-emerald-600/10 via-teal-600/10 to-transparent",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=1920&q=80",
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
    <div className="relative w-full overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Decorative Background Elements - Eco-friendly colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Carousel */}
      <div
        className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-12"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-3xl shadow-2xl">
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
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 sm:px-6 max-w-4xl">
                  <div
                    className={`transform transition-all duration-1000 delay-300 ${
                      index === currentSlide
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                  >
                    <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-6 drop-shadow-2xl tracking-tight">
                      {banner.title}
                    </h2>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 font-light drop-shadow-lg">
                      {banner.subtitle}
                    </p>

                    <button className="mt-8 sm:mt-10 px-8 sm:px-12 py-3 sm:py-4 bg-white text-emerald-800 rounded-full font-semibold text-base sm:text-lg hover:bg-emerald-50 transform hover:scale-105 transition-all shadow-2xl border-2 border-emerald-200">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-xl flex items-center justify-center transition-all hover:scale-110 z-10 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-xl flex items-center justify-center transition-all hover:scale-110 z-10 group"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
            {BANNERS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all rounded-full ${
                  index === currentSlide
                    ? "w-12 sm:w-16 h-2 sm:h-2.5 bg-white shadow-lg"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search & Info Section */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
            Professional
            <span className="block bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mt-2">
              Packaging Solutions
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
            Premium eco-friendly quality for businesses that demand excellence
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-emerald-200 overflow-hidden">
              <div className="pl-5 sm:pl-6">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </div>
              <form
                onSubmit={handleSearch}
                className="flex-1 flex items-center"
              >
                <input
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-4 sm:py-5 px-4 sm:px-6 text-base sm:text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="m-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Express shipping in 2-3 business days
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="absolute inset-0 bg-linear-to-br from-teal-50 to-cyan-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-linear-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Quality Assured
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                100% satisfaction guarantee
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-50 to-emerald-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-linear-to-br from-cyan-500 to-emerald-600 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Eco-Friendly
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Sustainable materials and practices
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
