import { type SchemaTypeDefinition } from "sanity";
import { category } from "./category";
import { product } from "./product";
import { productVariant } from "./productVariant";
import { pricingTier } from "./pricingTier";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Core content types
    category,
    product,

    // Embedded types
    productVariant,
    pricingTier,
  ],
};
