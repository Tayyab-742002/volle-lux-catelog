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
    <div className="w-full overflow-hidden rounded-lg border border-emerald-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Quantity
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Price per Unit
            </th>
          </tr>
        </thead>
        <tbody>
          {displayTiers.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-4 py-3 text-center text-gray-500">
                No pricing tiers configured
              </td>
            </tr>
          ) : (
            <>
              {/* Show base price row first */}
              <tr className="border-b border-emerald-100 bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">1+ units</td>
                <td className="px-4 py-3">
                  <span className="font-bold text-gray-700">
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
                    className="border-b border-emerald-100 transition-colors hover:bg-emerald-50/50 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{quantityRange}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-emerald-700">
                          £{tierPrice.toFixed(2)}
                        </span>
                        {tier.discount > 0 && (
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {tier.discount}% Off
                          </span>
                        )}
                        {tier.label && (
                          <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
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
