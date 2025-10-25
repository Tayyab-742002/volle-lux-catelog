"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  name: string;
  options: FilterOption[];
}

// Mock filter data - will be replaced with Sanity CMS data later
const filters: FilterGroup[] = [
  {
    name: "SIZE",
    options: [
      { value: "small", label: "Small", count: 42 },
      { value: "medium", label: "Medium", count: 68 },
      { value: "large", label: "Large", count: 35 },
      { value: "extra-large", label: "Extra Large", count: 18 },
    ],
  },
  {
    name: "MATERIAL",
    options: [
      { value: "cardboard", label: "Cardboard", count: 95 },
      { value: "plastic", label: "Plastic", count: 45 },
      { value: "paper", label: "Paper", count: 78 },
      { value: "bubble-wrap", label: "Bubble Wrap", count: 23 },
      { value: "foam", label: "Foam", count: 12 },
    ],
  },
  {
    name: "COLOR",
    options: [
      { value: "brown", label: "Brown", count: 82 },
      { value: "white", label: "White", count: 56 },
      { value: "black", label: "Black", count: 31 },
      { value: "clear", label: "Clear", count: 28 },
    ],
  },
  {
    name: "ECO-FRIENDLY",
    options: [
      { value: "recyclable", label: "Recyclable", count: 120 },
      { value: "biodegradable", label: "Biodegradable", count: 45 },
      { value: "compostable", label: "Compostable", count: 18 },
    ],
  },
];

export function ProductFilters() {
  return (
    <aside className="sticky top-24 h-fit">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-6 text-lg font-semibold">Filters</h3>
        <Accordion
          type="multiple"
          defaultValue={["SIZE", "MATERIAL"]}
          className="w-full"
        >
          {filters.map((filter) => (
            <AccordionItem key={filter.name} value={filter.name}>
              <AccordionTrigger className="label-luxury py-4">
                {filter.name}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {filter.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox id={option.value} className="border-primary/30 "  />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                        {option.count !== undefined && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({option.count})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
}
