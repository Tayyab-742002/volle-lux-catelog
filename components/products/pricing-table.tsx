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
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="label-luxury px-4 py-3 text-left text-xs text-muted-foreground">
              Quantity
            </th>
            <th className="label-luxury px-4 py-3 text-left text-xs text-muted-foreground">
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
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="px-4 py-3 font-medium">{quantityRange}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      ${tier.pricePerUnit.toFixed(2)}
                    </span>
                    {tier.label && (
                      <span className="text-sm text-muted-foreground">
                        ({tier.label})
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
