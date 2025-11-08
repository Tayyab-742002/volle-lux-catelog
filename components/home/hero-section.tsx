import { HeroCarousel } from "./hero-carousel";
import { getBanners } from "@/services/banners/banner.service";
import { BicepsFlexed, Sprout, Truck } from "lucide-react";

export default async function HeroSection() {
  // Fetch banners from Sanity CMS
  const banners = await getBanners();

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel Component */}
      <HeroCarousel banners={banners} />

      {/* Features Grid - Responsive stacking */}
      <div className="relative z-10 mx-auto max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-10 md:pb-12 lg:pb-16 xl:pb-20">
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

          <div className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-2xl transition-all duration-300 border border-gray-300">
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
