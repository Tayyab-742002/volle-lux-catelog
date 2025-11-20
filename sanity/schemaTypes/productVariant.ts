import { defineType, defineField, defineArrayMember } from "sanity";

export const productVariant = defineType({
  name: "productVariant",
  title: "Product Variant",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Variant Name",
      type: "string",
      description: 'e.g., "100mm x 135mm (BP1)", "180mm x 235mm (BP3)"',
      validation: (Rule) => Rule.required().min(1).max(100),
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
        "Additional cost (positive) or discount (negative) for this variant. This is the base price adjustment for this size.",
      initialValue: 0,
    }),
    defineField({
      name: "quantityOptions",
      title: "Quantity Options",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "quantityOption",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'e.g., "50 Pouches", "100 Pouches", "500 Pouches"',
              validation: (Rule) => Rule.required().min(1).max(50),
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              description: "The actual quantity number (e.g., 50, 100, 500)",
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "unit",
              title: "Unit",
              type: "string",
              description:
                'Unit of measurement (e.g., "Pouches", "Packets", "Rolls")',
              initialValue: "Pouches",
              validation: (Rule) => Rule.required().min(1).max(20),
            }),
            defineField({
              name: "pricePerUnit",
              title: "Price Per Unit",
              type: "number",
              description:
                "Price per unit for this quantity option. If not set, uses variant base price + pricing tiers.",
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: "isActive",
              title: "Active",
              type: "boolean",
              initialValue: true,
              description: "Whether this quantity option is available",
            }),
          ],
          preview: {
            select: {
              label: "label",
              quantity: "quantity",
              unit: "unit",
              price: "pricePerUnit",
            },
            prepare({ label, quantity, unit, price }) {
              return {
                title: label || `${quantity} ${unit}`,
                subtitle: price
                  ? `£${price.toFixed(2)} per unit`
                  : "Uses base pricing",
              };
            },
          },
        }),
      ],
      description:
        "Optional: Quantity options for this variant (e.g., 50 pouches, 100 pouches). Only use for products sold in packets/pouches. Leave empty for products without quantity options.",
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
      quantityOptions: "quantityOptions",
    },
    prepare({ name, sku, adjustment, quantityOptions }) {
      const priceText =
        adjustment !== 0 ? ` (${adjustment > 0 ? "+" : ""}£${adjustment})` : "";
      const qtyText =
        quantityOptions && quantityOptions.length > 0
          ? ` • ${quantityOptions.length} qty options`
          : "";
      return {
        title: `${name} - ${sku}${priceText}${qtyText}`,
      };
    },
  },
});
