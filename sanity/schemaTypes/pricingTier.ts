import { defineType, defineField } from "sanity";

export const pricingTier = defineType({
  name: "pricingTier",
  title: "Pricing Tier",
  type: "object",
  fields: [
    defineField({
      name: "minQuantity",
      title: "Minimum Quantity",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "maxQuantity",
      title: "Maximum Quantity",
      type: "number",
      description: "Leave empty for unlimited quantity",
    }),
    defineField({
      name: "discount",
      title: "Discount Percentage",
      type: "number",
      validation: (Rule) => Rule.required().min(0).max(100),
      description: "Discount percentage applied to the product base price (0-100)",
    }),
    defineField({
      name: "label",
      title: "Tier Label",
      type: "string",
      description: 'e.g., "Wholesale", "10% Off", "Bulk Discount"',
    }),
  ],
  preview: {
    select: {
      minQty: "minQuantity",
      maxQty: "maxQuantity",
      discount: "discount",
      label: "label",
    },
    prepare({ minQty, maxQty, discount, label }) {
      const quantityRange = maxQty ? `${minQty}-${maxQty}` : `${minQty}+`;
      const discountText = discount ? `${discount}% off` : "";
      const displayLabel = label ? ` (${label})` : "";
      return {
        title: `${quantityRange} units: ${discountText}${displayLabel}`,
      };
    },
  },
});

