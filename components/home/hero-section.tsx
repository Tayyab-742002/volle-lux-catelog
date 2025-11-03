"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      router.push("/products");
      return;
    }

    const encodedQuery = encodeURIComponent(trimmedQuery);
    router.push(`/products?search=${encodedQuery}`);
  };

  return (
    <section className="relative w-full bg-white">
      <div className="container mx-auto px-6 py-20 md:py-28 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* Content Section */}
          <div className="flex flex-col space-y-8 lg:pr-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-light tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
                Professional
                <span className="block font-normal">Packaging Solutions</span>
              </h1>
              <p className="text-lg text-neutral-600 md:text-xl lg:max-w-md">
                Premium quality for businesses that demand excellence
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full lg:max-w-md">
              <div className="group relative flex items-center">
                <label htmlFor="search" className="sr-only">
                  Search products
                </label>
                <Search className="absolute left-4 h-5 w-5 text-neutral-400 transition-colors group-focus-within:text-primary" />
                <Input
                  id="search"
                  type="search"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 border border-neutral-400 bg-transparent pl-12 pr-24 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-0 h-10 rounded-l-none bg-primary px-6 cursor-pointer text-sm font-medium hover:bg-primary/90"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="relative h-[400px] w-full overflow-hidden md:h-[500px] lg:h-[600px]">
            <div className="absolute inset-0 bg-linear-to-br from-neutral-100 to-neutral-50" />
            <Image
              src="https://pub-20f982007aa54df4849bcd969b89a1bf.r2.dev/hero-banner.png"
              alt="Professional packaging solutions"
              fill
              priority
              className="object-cover object-center"
              quality={95}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
