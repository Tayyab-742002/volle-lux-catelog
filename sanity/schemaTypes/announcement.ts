import { defineType, defineField } from "sanity";
import { Megaphone } from "lucide-react";

export const announcement = defineType({
  name: "announcement",
  title: "Announcement Banner",
  type: "document",
  icon: Megaphone,
  fields: [
    defineField({
      name: "message",
      title: "Announcement Message",
      description: "The main text to display in the announcement banner",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(200),
    }),
    defineField({
      name: "link",
      title: "Link URL",
      description: "Optional: URL to link to when clicking the announcement",
      type: "url",
    }),
    defineField({
      name: "linkText",
      title: "Link Text",
      description: "Optional: Text for the link/CTA button (e.g., 'Shop Now', 'Learn More')",
      type: "string",
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      description: "Whether this announcement should be displayed",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "dismissible",
      title: "Dismissible",
      description: "Whether users can dismiss this announcement",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "message",
      subtitle: "linkText",
      isActive: "isActive",
      dismissible: "dismissible",
    },
    prepare({ title, subtitle, isActive, dismissible }) {
      return {
        title: title || "Untitled Announcement",
        subtitle: `${isActive ? "Active" : "Inactive"}${subtitle ? ` • ${subtitle}` : ""}${dismissible ? " • Dismissible" : ""}`,
      };
    },
  },
});

