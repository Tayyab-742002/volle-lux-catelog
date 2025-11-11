// PERFORMANCE: Dynamic import for heavy ProductGallery component
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductGallerySkeleton } from "@/components/products/product-gallery-loader";
import {
  ProductHeader,
  ProductPurchaseSection,
  ProductInfoAccordion,
} from "@/components/products";
import { getProductBySlug } from "@/services/products/product.service";
import { getProductSlugs } from "@/sanity/lib/api";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

// PERFORMANCE: Code split ProductGallery (heavy image component)
const ProductGallery = dynamic(
  () => import("@/components/products").then((mod) => ({ default: mod.ProductGallery })),
  {
    loading: () => <ProductGallerySkeleton />,
    ssr: true,
  }
);

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-8 md:py-12 lg:py-16">
        {/* Back Button */}
        <Link href="/products">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={2} />
            Back to Products
          </Button>
        </Link>

        {/* Product Header */}
        <ProductHeader
          productName={product.name}
          productCode={product.product_code}
          category={product.category}
        />

        {/* Main Content: 2-Column Layout */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Product Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery
              images={product.images || [product.image]}
              productName={product.name}
            />
          </div>

          {/* Right Column: Product Info & Purchase */}
          <div className="space-y-8 md:space-y-12">
            {/* Purchase Section */}
            <ProductPurchaseSection product={product} />

            {/* Product Info Accordion */}
            <ProductInfoAccordion
              description={product.description}
              specifications={product.specifications}
              delivery={product.delivery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = (await getProductSlugs()) || [];
  return slugs.slice(0, 200).map((slug) => ({ slug }));
}
