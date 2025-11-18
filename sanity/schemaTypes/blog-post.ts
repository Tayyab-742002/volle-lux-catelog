import { defineType, defineField } from "sanity";
import { BookOpen } from "lucide-react";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: BookOpen,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "The main title of the blog post",
      type: "string",
      validation: (Rule) => Rule.required().min(10).max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "URL-friendly version of the title",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Short description shown in blog listings",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(50).max(200),
    }),
    defineField({
      name: "content",
      title: "Content",
      description: "Main blog post content",
      type: "array",
      of: [
        {
          type: "block",
        },
        {
          type: "image",
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt Text",
              description:
                "Important for SEO and accessibility. Describe what's in the image.",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      description: "Main image for the blog post",
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
            "Important for SEO and accessibility. Describe what's in the image.",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      description: "Author of the blog post",
      type: "string",
      initialValue: "Bubble Wrap Shop",
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      description: "When the blog post was published",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "Blog post category",
      type: "string",
      options: {
        list: [
          { title: "Packaging Tips", value: "packaging-tips" },
          { title: "Product Guides", value: "product-guides" },
          { title: "Industry News", value: "industry-news" },
          { title: "Sustainability", value: "sustainability" },
          { title: "Buying Guides", value: "buying-guides" },
        ],
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description: "Tags for categorizing and searching",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      description: "Custom SEO title (if different from main title)",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      description: "Meta description for search engines",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      description: "Whether this blog post is published and visible",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "featuredImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString()
          : "Not published",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published Date, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date, Oldest",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
});

