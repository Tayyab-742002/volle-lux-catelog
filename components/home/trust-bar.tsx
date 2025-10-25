import { Package, Leaf, TrendingUp } from "lucide-react";

export function TrustBar() {
  return (
    <div className="bg-muted py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 text-center text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span className="label-luxury">Next Day Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span className="label-luxury">Eco-Friendly Options</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span className="label-luxury">Automatic Bulk Pricing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
