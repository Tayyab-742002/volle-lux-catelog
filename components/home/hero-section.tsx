"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search:", searchQuery);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1595246135406-803418233494?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740"
          alt="Professional packaging and boxes"
          fill
          priority
          className="object-cover"
          quality={90}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        {/* Headline */}
        <h1 className="mb-12 max-w-4xl text-center text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
          The Standard in Professional Packaging
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="relative flex items-center rounded-lg bg-white/95 backdrop-blur shadow-2xl">
            <label htmlFor="search" className="sr-only">
              Search products
            </label>
            <Search
              className="absolute left-4 h-5 w-5 text-muted-foreground"
              strokeWidth={1.5}
            />
            <Input
              id="search"
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 border-0 bg-transparent pl-12 pr-24 text-base text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button type="submit" className="absolute right-2 h-10 px-6">
              Search
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
