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
// import { Slider } from "@/components/ui/slider";
import { X, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useMemo,
  useCallback,
  useState,
  // useRef,
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
];

type CategoryOption = { value: string; label: string };

function FilterContent({
  categories,
  onClose,
}: {
  categories?: CategoryOption[];
  onClose?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [localPriceRange, setLocalPriceRange] = useState([0, 1000]);
  const [optimisticFilters, setOptimisticFilters] = useState<
    Record<string, string[]>
  >({});
  // const priceDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const filters: FilterGroup[] = useMemo(() => {
    if (categories && categories.length > 0) {
      return [
        { name: "Category", key: "category", options: categories },
        ...baseFilters.filter((f) => f.key !== "category"),
      ];
    }
    return baseFilters;
  }, [categories]);

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

  const priceRange = useMemo(() => {
    return {
      min: parseInt(searchParams.get("priceMin") || "0"),
      max: parseInt(searchParams.get("priceMax") || "1000"),
    };
  }, [searchParams]);

  useEffect(() => {
    const min = priceRange.min;
    const max = priceRange.max;
    if (localPriceRange[0] !== min || localPriceRange[1] !== max) {
      setLocalPriceRange([min, max]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange.min, priceRange.max]);

  const updateFilters = useCallback(
    (key: string, value: string, checked: boolean) => {
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

  // const updatePriceRange = useCallback(
  //   (values: number[]) => {
  //     setLocalPriceRange(values);
  //     if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
  //     priceDebounceRef.current = setTimeout(() => {
  //       const params = new URLSearchParams(searchParams.toString());
  //       params.set("priceMin", values[0].toString());
  //       params.set("priceMax", values[1].toString());
  //       startTransition(() => {
  //         router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  //       });
  //     }, 120);
  //   },
  //   [searchParams, pathname, router]
  // );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    const search = searchParams.get("search");
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);
    setLocalPriceRange([0, 1000]);
    setOptimisticFilters({});
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
    onClose?.();
  }, [searchParams, pathname, router, onClose]);

  useEffect(() => {
    setOptimisticFilters({});
  }, [searchParams]);

  const hasActiveFilters =
    Object.keys(activeFilters).length > 0 ||
    priceRange.min > 0 ||
    priceRange.max < 1000;

  const activeCategoryParam = searchParams.get("category");
  const activeCategoryName = activeCategoryParam
    ? activeCategoryParam
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
          <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-md"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Category Badge */}
      {activeCategoryName && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs font-medium text-emerald-700 uppercase tracking-wider">
                Browsing
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {activeCategoryName}
              </p>
            </div>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("category");
                startTransition(() => {
                  router.replace(`/products?${params.toString()}`, {
                    scroll: false,
                  });
                });
              }}
              className="text-emerald-600 transition-colors hover:text-emerald-700 hover:bg-emerald-100 rounded-full p-1.5"
              title="Clear category"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {/* Price Range */}
      {/* <div className="space-y-4 border-t border-gray-200 pt-6">
        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
          Price Range
        </Label>
        <div className="space-y-4">
          <Slider
            value={localPriceRange}
            min={0}
            max={1000}
            step={10}
            onValueChange={updatePriceRange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
            <span>${localPriceRange[0]}</span>
            <span>${localPriceRange[1]}</span>
          </div>
        </div>
      </div> */}

      {/* Filter Accordions */}
      <Accordion
        type="multiple"
        defaultValue={filters.map((f) => f.key)}
        className="w-full"
      >
        {filters.map((filter) => (
          <AccordionItem
            key={filter.key}
            value={filter.key}
            className="border-t border-gray-200"
          >
            <AccordionTrigger className="py-4 text-sm font-semibold text-gray-900 hover:text-emerald-700 transition-colors">
              <div className="flex items-center gap-2">
                <span>{filter.name}</span>
                {activeFilters[filter.key] &&
                  activeFilters[filter.key].length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-sm">
                      {activeFilters[filter.key].length}
                    </span>
                  )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-2">
              <div className="space-y-3">
                {filter.options.map((option) => {
                  const isChecked =
                    optimisticFilters[filter.key]?.includes(option.value) ||
                    activeFilters[filter.key]?.includes(option.value) ||
                    false;
                  return (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 group"
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
                        className="border-gray-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                      />
                      <Label
                        htmlFor={`${filter.key}-${option.value}`}
                        className="flex-1 cursor-pointer text-sm font-medium leading-none text-gray-700 group-hover:text-emerald-700 transition-colors"
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
  );
}

export function ProductFilters({
  categories,
}: {
  categories?: CategoryOption[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" strokeWidth={2} />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full overflow-y-auto sm:max-w-md bg-white border-gray-300"
          >
            <SheetHeader className="mb-6">
              <SheetTitle className="text-left text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Filter Products
              </SheetTitle>
            </SheetHeader>
            <FilterContent
              categories={categories}
              onClose={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <aside className="sticky top-24 hidden h-fit lg:block">
        <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-lg">
          <FilterContent categories={categories} />
        </div>
      </aside>
    </>
  );
}
