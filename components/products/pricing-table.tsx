import { PricingTier } from "@/types/product";

interface PricingTableProps {
  tiers: PricingTier[];
  basePrice: number;
}

export function PricingTable({ tiers, basePrice }: PricingTableProps) {
  // If no tiers provided, create a default tier from basePrice
  const displayTiers =
    tiers && tiers.length > 0
      ? tiers
      : [{ minQuantity: 1, pricePerUnit: basePrice }];

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
          {displayTiers.map((tier, index) => {
            const quantityRange = tier.maxQuantity
              ? `${tier.minQuantity}–${tier.maxQuantity} units`
              : `${tier.minQuantity}+ units`;

            return (
              <tr
                key={index}
                className="border-b border-emerald-100 transition-colors hover:bg-emerald-50/50 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-gray-900">{quantityRange}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-700">
                      £{tier.pricePerUnit.toFixed(2)}
                    </span>
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
        </tbody>
      </table>
    </div>
  );
}
