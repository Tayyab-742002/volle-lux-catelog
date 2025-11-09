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
      description: "The main heading text displayed on the banner (optional)",
      type: "string",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "description",
      title: "Banner Description",
      description: "The subtitle or description text displayed below the title (optional)",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      description: "Choose between image or video for the banner background",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (Rule) => Rule.required(),
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
        }),
      ],
      hidden: ({ document }) => document?.mediaType !== "image",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mediaType = (context.document as any)?.mediaType;
          if (mediaType === "image" && !value) {
            return "Image is required when media type is set to image";
          }
          return true;
        }),
    }),
    defineField({
      name: "backgroundVideo",
      title: "Background Video",
      type: "file",
      description: "Video file for the banner (MP4, WebM recommended for best browser support)",
      options: {
        accept: "video/*",
      },
      hidden: ({ document }) => document?.mediaType !== "video",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mediaType = (context.document as any)?.mediaType;
          const videoUrl = (context.document as any)?.videoUrl;
          if (mediaType === "video" && !value && !videoUrl) {
            return "Either upload a video file or provide a video URL";
          }
          return true;
        }),
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (Alternative)",
      type: "url",
      description: "Or provide a direct URL to a hosted video file (e.g., from CDN)",
      hidden: ({ document }) => document?.mediaType !== "video",
    }),
    defineField({
      name: "videoPoster",
      title: "Video Poster Image",
      type: "image",
      description: "Thumbnail image shown before video loads/plays",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Alternative text for the poster image",
        }),
      ],
      hidden: ({ document }) => document?.mediaType !== "video",
    }),
    defineField({
      name: "videoSettings",
      title: "Video Settings",
      type: "object",
      description: "Control how the video behaves",
      fields: [
        defineField({
          name: "autoplay",
          title: "Autoplay",
          type: "boolean",
          description: "Start playing automatically when page loads",
          initialValue: true,
        }),
        defineField({
          name: "loop",
          title: "Loop",
          type: "boolean",
          description: "Replay video continuously",
          initialValue: true,
        }),
        defineField({
          name: "muted",
          title: "Muted",
          type: "boolean",
          description: "Play video without sound (required for autoplay in most browsers)",
          initialValue: true,
        }),
        defineField({
          name: "showControls",
          title: "Show Controls",
          type: "boolean",
          description: "Display play/pause and volume controls",
          initialValue: false,
        }),
      ],
      hidden: ({ document }) => document?.mediaType !== "video",
      initialValue: {
        autoplay: true,
        loop: true,
        muted: true,
        showControls: false,
      },
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
      posterImage: "videoPoster",
      mediaType: "mediaType",
      index: "index",
    },
    prepare({ title, subtitle, media, posterImage, mediaType, index }) {
      const isVideo = mediaType === "video";
      const displayMedia = isVideo ? posterImage : media;
      
      return {
        title: title || `Banner ${index ?? 0}`,
        subtitle: `${isVideo ? "🎥 Video" : "🖼️ Image"} | Order: ${index ?? 0}${subtitle ? ` | ${subtitle}` : ""}`,
        media: displayMedia,
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
