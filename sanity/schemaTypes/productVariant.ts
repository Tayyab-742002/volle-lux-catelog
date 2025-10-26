import { defineType, defineField } from "sanity";

export const productVariant = defineType({
  name: "productVariant",
  title: "Product Variant",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Variant Name",
      type: "string",
      description: 'e.g., "Small", "Medium", "Large", "C4", "C5"',
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      description: "Stock Keeping Unit - unique identifier",
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: "priceAdjustment",
      title: "Price Adjustment",
      type: "number",
      description:
        "Additional cost (positive) or discount (negative) for this variant",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Whether this variant is available for purchase",
    }),
    defineField({
      name: "stockQuantity",
      title: "Stock Quantity",
      type: "number",
      description: "Available quantity in stock (optional)",
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      name: "name",
      sku: "sku",
      adjustment: "priceAdjustment",
    },
    prepare({ name, sku, adjustment }) {
      const priceText =
        adjustment !== 0 ? ` (${adjustment > 0 ? "+" : ""}$${adjustment})` : "";
      return {
        title: `${name} - ${sku}${priceText}`,
      };
    },
  },
});

