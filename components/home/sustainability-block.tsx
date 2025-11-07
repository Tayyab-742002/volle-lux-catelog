import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Recycle, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SustainabilityBlock() {
  return (
    <section className="relative bg-linear-to-br from-emerald-600  to-teal-600 py-20 md:py-32 lg:py-40 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Section */}
          <div className="relative group order-2 lg:order-1">
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
              <Image
                src="https://pub-20f982007aa54df4849bcd969b89a1bf.r2.dev/sustainability.png"
                alt="Sustainable Packaging"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                quality={95}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-emerald-900/20 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2 lg:pl-8 xl:pl-12">
            <div className="max-w-xl">
              <h2 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
                Building a
                <span className="block text-white mt-2">
                  Sustainable Future
                </span>
              </h2>

              <p className="mb-6 text-lg sm:text-xl text-gray-300 leading-relaxed">
                We&apos;re committed to reducing environmental impact through
                eco-friendly materials, recyclable packaging, and sustainable
                manufacturing processes.
              </p>

              <p className="mb-8 text-lg sm:text-xl text-gray-300 leading-relaxed">
                Every product in our sustainable range meets strict
                environmental standards, ensuring quality without compromise.
              </p>

              {/* Sustainability Features */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-3 shadow-lg">
                    <Leaf className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    Eco-Friendly
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-teal-100 hover:bg-teal-50/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-3 shadow-lg">
                    <Recycle className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    Recyclable
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-cyan-100 hover:bg-cyan-50/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-3 shadow-lg">
                    <Sprout className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    Sustainable
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Button asChild variant="ghost" className="w-fit group">
                <Link
                  href="/sustainability"
                  className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold border border-white/20 text-white bg-white/20 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Learn More About Our Impact
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
