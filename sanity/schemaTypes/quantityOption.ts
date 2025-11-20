import { defineType, defineField } from "sanity";



/**
 * Quantity Option Schema
 * Used for products that are sold in packets/pouches (e.g., 50 pouches, 100 pouches)
 * This is optional and only used for specific products like bubble pouches
 */
export const quantityOption = defineType({
  name: "quantityOption",
  title: "Quantity Option",
  type: "object",
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
      description: 'Unit of measurement (e.g., "Pouches", "Packets", "Rolls")',
      initialValue: "Pouches",
      validation: (Rule) => Rule.required().min(1).max(20),
    }),
    defineField({
      name: "pricePerUnit",
      title: "Price Per Unit",
      type: "number",
      description: "Price per unit for this quantity option (overrides base pricing)",
      validation: (Rule) => Rule.required().min(0),
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
        subtitle: price ? `£${price.toFixed(2)} per unit` : "",
      };
    },
  },
});

