// ===== TRUST BAR =====
import { Package, Leaf, TrendingUp } from "lucide-react";

export function TrustBar() {
  return (
    <div className="border-b border-neutral-400 bg-white py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-12 text-center md:gap-16 lg:gap-20">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-neutral-600" strokeWidth={1.5} />
            <span className="text-sm font-normal text-neutral-700">
              Next Day Delivery
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Leaf className="h-5 w-5 text-neutral-600" strokeWidth={1.5} />
            <span className="text-sm font-normal text-neutral-700">
              Eco-Friendly Options
            </span>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp
              className="h-5 w-5 text-neutral-600"
              strokeWidth={1.5}
            />
            <span className="text-sm font-normal text-neutral-700">
              Automatic Bulk Pricing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
