"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { useMemo, useCallback, useState, useRef, useEffect } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroup {
  name: string;
  key: string;
  options: FilterOption[];
}

// Packaging industry filters
const filters: FilterGroup[] = [
  {
    name: "Category",
    key: "category",
    options: [
      { value: "boxes", label: "Boxes" },
      { value: "bubble-wrap", label: "Bubble Wrap" },
      { value: "packing-tape", label: "Packing Tape" },
      { value: "envelopes", label: "Envelopes" },
      { value: "containers", label: "Containers" },
    ],
  },
  {
    name: "Size",
    key: "size",
    options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
      { value: "extra-large", label: "Extra Large" },
    ],
  },
  {
    name: "Material",
    key: "material",
    options: [
      { value: "cardboard", label: "Cardboard" },
      { value: "plastic", label: "Plastic" },
      { value: "paper", label: "Paper" },
      { value: "foam", label: "Foam" },
      { value: "metal", label: "Metal" },
    ],
  },
  {
    name: "Eco-Friendly",
    key: "ecoFriendly",
    options: [
      { value: "recyclable", label: "Recyclable" },
      { value: "biodegradable", label: "Biodegradable" },
      { value: "compostable", label: "Compostable" },
      { value: "recycled-content", label: "Recycled Content" },
    ],
  },
];

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [localPriceRange, setLocalPriceRange] = useState([0, 1000]);
  const priceDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Parse current filters from URL
  const activeFilters = useMemo(() => {
    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (
        key !== "sort" &&
        key !== "search" &&
        key !== "priceMin" &&
        key !== "priceMax"
      ) {
        filters[key] = value.split(",");
      }
    });
    return filters;
  }, [searchParams]);

  // Initialize local price range from URL
  useEffect(() => {
    const min = parseInt(searchParams.get("priceMin") || "0");
    const max = parseInt(searchParams.get("priceMax") || "1000");
    setLocalPriceRange([min, max]);
  }, [searchParams]);

  const priceRange = useMemo(() => {
    return {
      min: parseInt(searchParams.get("priceMin") || "0"),
      max: parseInt(searchParams.get("priceMax") || "1000"),
    };
  }, [searchParams]);

  // INSTANT filter updates (no transition)
  const updateFilters = useCallback(
    (key: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValues = params.get(key)?.split(",").filter(Boolean) || [];

      if (checked) {
        if (!currentValues.includes(value)) {
          currentValues.push(value);
        }
      } else {
        const index = currentValues.indexOf(value);
        if (index > -1) {
          currentValues.splice(index, 1);
        }
      }

      if (currentValues.length > 0) {
        params.set(key, currentValues.join(","));
      } else {
        params.delete(key);
      }

      // INSTANT update - no transition
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Debounced price range update
  const updatePriceRange = useCallback(
    (values: number[]) => {
      setLocalPriceRange(values);

      // Clear existing timeout
      if (priceDebounceRef.current) {
        clearTimeout(priceDebounceRef.current);
      }

      // Debounce for 150ms
      priceDebounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("priceMin", values[0].toString());
        params.set("priceMax", values[1].toString());
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }, 150);
    },
    [searchParams, pathname, router]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    const search = searchParams.get("search");
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);
    setLocalPriceRange([0, 1000]);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const hasActiveFilters =
    Object.keys(activeFilters).length > 0 ||
    priceRange.min > 0 ||
    priceRange.max < 1000;

  return (
    <aside className="sticky top-24 h-fit">
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              <X className="mr-1 h-3 w-3" />
              Clear All
            </Button>
          )}
        </div>

        {/* Price Range */}
        <div className="mb-6 space-y-4 border-b pb-6">
          <Label className="text-sm font-semibold">Price Range</Label>
          <div className="space-y-4">
            <Slider
              value={localPriceRange}
              min={0}
              max={1000}
              step={10}
              onValueChange={updatePriceRange}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${localPriceRange[0]}</span>
              <span>${localPriceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Filter Accordions */}
        <Accordion
          type="multiple"
          defaultValue={filters.map((f) => f.key)}
          className="w-full"
        >
          {filters.map((filter) => (
            <AccordionItem key={filter.key} value={filter.key}>
              <AccordionTrigger className="py-4 text-sm font-semibold">
                {filter.name}
                {activeFilters[filter.key] &&
                  activeFilters[filter.key].length > 0 && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {activeFilters[filter.key].length}
                    </span>
                  )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {filter.options.map((option) => {
                    const isChecked =
                      activeFilters[filter.key]?.includes(option.value) ||
                      false;
                    return (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`${filter.key}-${option.value}`}
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            updateFilters(
                              filter.key,
                              option.value,
                              checked as boolean
                            )
                          }
                          className="border-primary/30"
                        />
                        <Label
                          htmlFor={`${filter.key}-${option.value}`}
                          className="flex-1 cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
}
