export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageAlt?: string; // Alt text for category image (SEO)
  isActive?: boolean;
  sortOrder?: number;
}
