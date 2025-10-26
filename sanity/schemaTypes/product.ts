import { defineType, defineField } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(200),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "productCode",
      title: "Product Code",
      type: "string",
      description: "Internal product code/SKU",
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Main product description",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
      description: "Brief description for product cards",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for SEO and accessibility.",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
            },
          ],
        },
      ],
      description: "Additional images for product gallery",
    }),
    defineField({
      name: "basePrice",
      title: "Base Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      description: "Base price per unit",
    }),
    defineField({
      name: "discount",
      title: "Discount Percentage",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
      description: "Overall discount percentage (0-100)",
    }),
    defineField({
      name: "variants",
      title: "Product Variants",
      type: "array",
      of: [{ type: "productVariant" }],
      description: "Different sizes, colors, or options for this product",
    }),
    defineField({
      name: "pricingTiers",
      title: "Pricing Tiers",
      type: "array",
      of: [{ type: "pricingTier" }],
      description: "Bulk pricing tiers for different quantities",
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              type: "string",
              title: "Specification Name",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "value",
              type: "string",
              title: "Specification Value",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              name: "name",
              value: "value",
            },
            prepare({ name, value }) {
              return {
                title: `${name}: ${value}`,
              };
            },
          },
        },
      ],
      description: "Product specifications and details",
    }),
    defineField({
      name: "delivery",
      title: "Delivery Information",
      type: "text",
      rows: 3,
      description: "Delivery time, shipping info, etc.",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Whether this product is visible on the website",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
      description: "Whether this product appears in featured sections",
    }),
    defineField({
      name: "isNewArrival",
      title: "New Arrival",
      type: "boolean",
      initialValue: false,
      description: "Whether this product is marked as new",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Tags for filtering and organization",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Custom title for search engines",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Custom description for search engines",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "productCode",
      media: "mainImage",
      category: "category.name",
    },
    prepare({ title, subtitle, media, category }) {
      return {
        title,
        subtitle: `${subtitle}${category ? ` • ${category}` : ""}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Price Low-High",
      name: "priceAsc",
      by: [{ field: "basePrice", direction: "asc" }],
    },
    {
      title: "Price High-Low",
      name: "priceDesc",
      by: [{ field: "basePrice", direction: "desc" }],
    },
    {
      title: "Featured First",
      name: "featuredFirst",
      by: [
        { field: "isFeatured", direction: "desc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
});

