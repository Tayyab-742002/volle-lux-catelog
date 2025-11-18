"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, TrendingUp, Package } from "lucide-react";
import Image from "next/image";

export default function B2BBanner() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);

  // Animate discount number on mount
  useEffect(() => {
    let start = 0;
    const end = 40;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDiscountValue(end);
        clearInterval(timer);
      } else {
        setDiscountValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-6xl mx-auto">
        <div
          className="relative overflow-hidden rounded-lg sm:rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 md:px-8 md:py-6">
            {/* Left Side */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-1 w-full md:w-auto">
              {/* Icon with Pulse Animation */}
              <div className="shrink-0 relative">
                <div
                  className={`absolute inset-0 bg-white/30 rounded-full animate-ping ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                ></div>

                <Image
                  src="https://pub-20f982007aa54df4849bcd969b89a1bf.r2.dev/gift.jpg"
                  alt="B2B Banner Icon"
                  width={74}
                  height={74}
                  className="rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-[74px] md:h-[74px] object-cover"
                  quality={95}
                  sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 74px"
                  loading="lazy"
                />
              </div>

              {/* Text Content with Animations */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5 flex-wrap">
                  <span className="text-white/90 font-semibold text-[10px] sm:text-xs uppercase tracking-wider">
                    B2B Solutions
                  </span>
                  <div className="h-1 w-1 bg-white/50 rounded-full hidden sm:block"></div>
                  <span className="text-white/70 text-[10px] sm:text-xs">
                    Wholesale Pricing
                  </span>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-1.5 leading-tight">
                  Need Bulk Packaging?
                  <span
                    className={`inline-block ml-1 sm:ml-2 transition-all duration-500 ${isHovered ? "translate-x-1" : ""}`}
                  >
                    📦
                  </span>
                </h3>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-red-200 shrink-0" />
                    <span className="text-white/90">
                      Save up to{" "}
                      <span className="font-bold text-white text-base sm:text-lg mx-0.5 sm:mx-1">
                        {discountValue}%
                      </span>{" "}
                      on bulk orders
                    </span>
                  </div>
                  <div className="hidden sm:block h-4 w-px bg-white/30"></div>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-white/80">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 text-red-200 shrink-0" />
                    <span className="whitespace-nowrap">
                      500+ Trusted Businesses
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - CTA Button */}
            <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => router.push("/wholesale")}
                  className="group relative bg-white hover:bg-gray-50 active:bg-gray-100 font-bold cursor-pointer w-full md:w-auto px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-3.5 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg flex items-center justify-center gap-2 sm:gap-2.5 overflow-hidden touch-manipulation"
                >
                  <span className="relative z-10 whitespace-nowrap block bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 bg-clip-text text-transparent text-sm sm:text-base">
                    Learn More
                  </span>
                  <ArrowRight
                    className={`relative z-10 w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 transition-transform duration-300 shrink-0 ${isHovered ? "translate-x-1" : ""}`}
                  />
                </button>
                <button
                  onClick={() => router.push("/b2b-request")}
                  className="group relative bg-white/90 hover:bg-white active:bg-gray-50 font-bold cursor-pointer w-full md:w-auto px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-3.5 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg flex items-center justify-center gap-2 sm:gap-2.5 overflow-hidden touch-manipulation"
                >
                  <span className="relative z-10 whitespace-nowrap block bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 bg-clip-text text-transparent text-sm sm:text-base">
                    Get Quote
                  </span>
                  <ArrowRight
                    className={`relative z-10 w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 transition-transform duration-300 shrink-0 ${isHovered ? "translate-x-1" : ""}`}
                  />
                </button>
              </div>

              <p className="text-center text-white/70 text-[10px] sm:text-xs mt-1.5 sm:mt-2">
                Min. order:{" "}
                <span className="font-semibold text-white">£500</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
