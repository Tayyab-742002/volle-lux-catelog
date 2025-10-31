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
import {
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
  startTransition,
} from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroup {
  name: string;
  key: string;
  options: FilterOption[];
}

// Packaging industry filters baseline
const baseFilters: FilterGroup[] = [
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

type CategoryOption = { value: string; label: string };

export function ProductFilters({
  categories,
}: {
  categories?: CategoryOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [localPriceRange, setLocalPriceRange] = useState([0, 1000]);
  const [optimisticFilters, setOptimisticFilters] = useState<
    Record<string, string[]>
  >({});
  const priceDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Compose filters with dynamic categories from server if provided
  const filters: FilterGroup[] = useMemo(() => {
    if (categories && categories.length > 0) {
      return [
        { name: "Category", key: "category", options: categories },
        ...baseFilters.filter((f) => f.key !== "category"),
      ];
    }
    return baseFilters;
  }, [categories]);

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

  // Derive price range directly from URL params (avoid setState in effect)
  const priceRange = useMemo(() => {
    return {
      min: parseInt(searchParams.get("priceMin") || "0"),
      max: parseInt(searchParams.get("priceMax") || "1000"),
    };
  }, [searchParams]);

  // Initialize local price range from URL params only when they change
  useEffect(() => {
    const min = priceRange.min;
    const max = priceRange.max;
    if (localPriceRange[0] !== min || localPriceRange[1] !== max) {
      setLocalPriceRange([min, max]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange.min, priceRange.max]);

  // INSTANT filter updates with optimistic UI (non-blocking with startTransition)
  const updateFilters = useCallback(
    (key: string, value: string, checked: boolean) => {
      // OPTIMISTIC: Update UI immediately
      setOptimisticFilters((prev) => {
        const newFilters = { ...prev };
        const currentValues = newFilters[key] || activeFilters[key] || [];
        const newValues = [...currentValues];

        if (checked) {
          if (!newValues.includes(value)) newValues.push(value);
        } else {
          const index = newValues.indexOf(value);
          if (index > -1) newValues.splice(index, 1);
        }

        if (newValues.length > 0) {
          newFilters[key] = newValues;
        } else {
          delete newFilters[key];
        }

        return newFilters;
      });

      // Update URL in background
      const params = new URLSearchParams(searchParams.toString());
      const currentValues = params.get(key)?.split(",").filter(Boolean) || [];
      const newValues = [...currentValues];

      if (checked) {
        if (!newValues.includes(value)) newValues.push(value);
      } else {
        const index = newValues.indexOf(value);
        if (index > -1) newValues.splice(index, 1);
      }

      if (newValues.length > 0) params.set(key, newValues.join(","));
      else params.delete(key);

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router, activeFilters]
  );

  // Debounced price range update
  const updatePriceRange = useCallback(
    (values: number[]) => {
      setLocalPriceRange(values);
      if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
      priceDebounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("priceMin", values[0].toString());
        params.set("priceMax", values[1].toString());
        startTransition(() => {
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
      }, 120);
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
    setOptimisticFilters({}); // Clear optimistic state
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [searchParams, pathname, router]);

  // Sync optimistic filters with URL params when they update
  useEffect(() => {
    setOptimisticFilters({});
  }, [searchParams]);

  const hasActiveFilters =
    Object.keys(activeFilters).length > 0 ||
    priceRange.min > 0 ||
    priceRange.max < 1000;

  // Get active category display name
  const activeCategoryParam = searchParams.get("category");
  const activeCategoryName = activeCategoryParam
    ? activeCategoryParam
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : null;

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

        {/* Active Category Badge */}
        {activeCategoryName && (
          <div className="mb-6 rounded-lg bg-primary/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Browsing
                </p>
                <p className="text-sm font-semibold text-primary">
                  {activeCategoryName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("category");
                  startTransition(() => {
                    router.replace(`/products?${params.toString()}`, {
                      scroll: false,
                    });
                  });
                }}
                className="h-8 w-8 p-0"
                title="Clear category"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

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
                    // Use optimistic filters for instant UI feedback
                    const isChecked =
                      optimisticFilters[filter.key]?.includes(option.value) ||
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
