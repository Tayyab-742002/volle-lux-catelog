import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SustainabilityBlock() {
  return (
    <section className="relative overflow-hidden bg-neutral-50 py-20 md:py-32 lg:py-40">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-0 lg:grid-cols-2">
          {/* Image Section - Full Bleed on Left */}
          <div className="relative -mx-6 h-[400px] md:h-[500px] lg:mx-0 lg:h-[600px]">
            <Image
              src="https://pub-20f982007aa54df4849bcd969b89a1bf.r2.dev/sustainibility-new.png"
              alt="Sustainable Packaging"
              fill
              className="object-cover"
              quality={95}
            />
          </div>

          {/* Content Section */}
          <div className="lg:pl-16 lg:pr-8 xl:pl-20 xl:pr-12">
            <div className="mx-auto max-w-xl py-12 lg:py-0">
              <h2 className="mb-6 text-3xl font-light text-neutral-900 md:text-4xl lg:text-5xl">
                Building a
                <span className="block font-normal">Sustainable Future</span>
              </h2>

              <p className="mb-6 text-base leading-relaxed text-neutral-600">
                We&apos;re committed to reducing environmental impact through
                eco-friendly materials, recyclable packaging, and sustainable
                manufacturing processes.
              </p>

              <p className="mb-10 text-base leading-relaxed text-neutral-600">
                Every product in our sustainable range meets strict
                environmental standards, ensuring quality without compromise.
              </p>

              <Link
                href="/sustainability"
                className="group inline-flex items-center gap-2 border-b-2 border-neutral-900 pb-1 text-sm font-normal text-neutral-900 transition-all hover:border-neutral-600 hover:text-neutral-600"
              >
                Learn More About Our Impact
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
