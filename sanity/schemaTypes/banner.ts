import { defineType, defineField } from "sanity";
import { ImageIcon } from "lucide-react";

export const banner = defineType({
  name: "banner",
  title: "Banner",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Banner Title",
      description: "The main heading text displayed on the banner",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(200),
    }),
    defineField({
      name: "description",
      title: "Banner Description",
      description: "The subtitle or description text displayed below the title",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().min(1).max(500),
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      description: "The background image for the banner carousel",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          description:
            "Important for SEO and accessibility. Describe what is shown in the image.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "index",
      title: "Display Order",
      description:
        "The order in which this banner appears in the carousel (lower numbers appear first)",
      type: "number",
      validation: (Rule) => Rule.required().min(0).integer(),
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      description: "Whether this banner should be displayed",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "backgroundImage",
      index: "index",
    },
    prepare({ title, subtitle, media, index }) {
      return {
        title: title || "Untitled Banner",
        subtitle: `Order: ${index ?? 0} • ${subtitle || "No description"}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Display Order (Low to High)",
      name: "indexAsc",
      by: [{ field: "index", direction: "asc" }],
    },
    {
      title: "Display Order (High to Low)",
      name: "indexDesc",
      by: [{ field: "index", direction: "desc" }],
    },
  ],
});

