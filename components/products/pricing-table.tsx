import { PricingTier } from "@/types/product";

interface PricingTableProps {
  tiers: PricingTier[];
  basePrice: number;
  variantPriceAdjustment?: number;
}

export function PricingTable({ tiers, basePrice, variantPriceAdjustment = 0 }: PricingTableProps) {
  const adjustedBasePrice = basePrice + variantPriceAdjustment;

  // If no tiers provided, show base price only
  const displayTiers =
    tiers && tiers.length > 0
      ? tiers
      : [];

  // Calculate the actual price per unit for each tier using discount percentage
  const getTierPrice = (tier: PricingTier): number => {
    // Apply discount percentage to base price
    if (tier.discount > 0) {
      return adjustedBasePrice * (1 - tier.discount / 100);
    }
    
    // No discount, return base price
    return adjustedBasePrice;
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border-2 border-emerald-200 shadow-lg bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-emerald-300 bg-linear-to-r from-emerald-100 to-teal-100">
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-emerald-800">
              Quantity
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-emerald-800">
              Price per Unit
            </th>
          </tr>
        </thead>
        <tbody>
          {displayTiers.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                No pricing tiers configured
              </td>
            </tr>
          ) : (
            <>
              {/* Show base price row first */}
              <tr className="border-b border-emerald-100 bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900">1+ units</td>
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-gray-900">
                    £{adjustedBasePrice.toFixed(2)}
                  </span>
                </td>
              </tr>
              {/* Show tier rows */}
              {displayTiers.map((tier, index) => {
                const quantityRange = tier.maxQuantity
                  ? `${tier.minQuantity}–${tier.maxQuantity} units`
                  : `${tier.minQuantity}+ units`;

                const tierPrice = getTierPrice(tier);

                return (
                  <tr
                    key={index}
                    className="border-b border-emerald-100 transition-all hover:bg-emerald-50/70 hover:shadow-sm last:border-0"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">{quantityRange}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-lg font-bold text-emerald-700">
                          £{tierPrice.toFixed(2)}
                        </span>
                        {tier.discount > 0 && (
                          <span className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            {tier.discount}% Off
                          </span>
                        )}
                        {tier.label && (
                          <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-300">
                            {tier.label}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
