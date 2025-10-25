import { PricingTier } from "@/types/product";

/**
 * Pricing Service
 * Handles all pricing calculations and tiered pricing logic
 * TODO: Integrate with Sanity CMS for dynamic pricing tiers
 * Reference: Architecture.md Section 4.2
 */

/**
 * Calculate the active pricing tier based on quantity
 * TODO: Fetch pricing tiers from Sanity CMS
 */
export function getActivePricingTier(
  quantity: number,
  tiers: PricingTier[]
): PricingTier | null {
  if (!tiers || tiers.length === 0) {
    return null;
  }

  return (
    tiers.find((tier) => {
      const minMatch = quantity >= tier.minQuantity;
      const maxMatch = tier.maxQuantity ? quantity <= tier.maxQuantity : true;
      return minMatch && maxMatch;
    }) || null
  );
}

/**
 * Calculate price per unit based on quantity and tiers
 * TODO: Use Sanity CMS pricing tiers
 */
export function calculatePricePerUnit(
  quantity: number,
  basePrice: number,
  tiers: PricingTier[],
  variantAdjustment: number = 0
): number {
  const adjustedBasePrice = basePrice + variantAdjustment;

  if (!tiers || tiers.length === 0) {
    return adjustedBasePrice;
  }

  const activeTier = getActivePricingTier(quantity, tiers);
  return activeTier?.pricePerUnit || adjustedBasePrice;
}

/**
 * Calculate total price for a given quantity
 * TODO: Integrate with Sanity CMS pricing tiers
 */
export function calculateTotalPrice(
  quantity: number,
  basePrice: number,
  tiers: PricingTier[],
  variantAdjustment: number = 0
): number {
  const pricePerUnit = calculatePricePerUnit(
    quantity,
    basePrice,
    tiers,
    variantAdjustment
  );
  return pricePerUnit * quantity;
}

/**
 * Get all pricing tiers for a product
 * TODO: Fetch from Sanity CMS
 */
export async function getPricingTiers(
  productId: string
): Promise<PricingTier[]> {
  // TODO: Fetch pricing tiers from Sanity CMS
  // TODO: Use GROQ query to get product pricing tiers
  return Promise.resolve([]);
}

/**
 * Calculate discount percentage for a tier
 */
export function calculateDiscountPercentage(
  tier: PricingTier,
  basePrice: number
): number {
  if (!tier.pricePerUnit || tier.pricePerUnit >= basePrice) {
    return 0;
  }
  return Math.round(((basePrice - tier.pricePerUnit) / basePrice) * 100);
}
