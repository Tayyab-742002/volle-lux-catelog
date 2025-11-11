import { PricingTier } from "@/types/product";
import { VAT_RATE, type ShippingCalculation } from "@/types/shipping";

/**
 * Pricing Service
 * Handles all pricing calculations, tiered pricing logic, and VAT
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

/**
 * Calculate VAT amount
 * VAT is calculated on (subtotal + shipping cost)
 */
export function calculateVAT(subtotal: number, shippingCost: number, vatRate: number = VAT_RATE): number {
  const taxableAmount = subtotal + shippingCost
  return Number((taxableAmount * vatRate).toFixed(2))
}

/**
 * Calculate order total with shipping and VAT
 */
export function calculateOrderTotal(
  subtotal: number,
  shippingCost: number,
  vatRate: number = VAT_RATE
): ShippingCalculation {
  const vatAmount = calculateVAT(subtotal, shippingCost, vatRate)
  const total = subtotal + shippingCost + vatAmount

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shippingCost: Number(shippingCost.toFixed(2)),
    vatAmount: Number(vatAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
    shippingMethod: '' // Will be set by caller
  }
}

/**
 * Format price for display (GBP)
 */
export function formatPrice(amount: number): string {
  return `£${amount.toFixed(2)}`
}

/**
 * Calculate VAT-exclusive amount (reverse VAT calculation)
 * Used when you have a VAT-inclusive price and need to extract the VAT
 */
export function calculateVATExclusive(vatInclusiveAmount: number, vatRate: number = VAT_RATE): {
  exclusive: number
  vat: number
} {
  const exclusive = vatInclusiveAmount / (1 + vatRate)
  const vat = vatInclusiveAmount - exclusive

  return {
    exclusive: Number(exclusive.toFixed(2)),
    vat: Number(vat.toFixed(2))
  }
}
