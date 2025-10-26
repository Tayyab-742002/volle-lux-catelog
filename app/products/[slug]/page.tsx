import {
  ProductGallery,
  ProductHeader,
  ProductPurchaseSection,
  ProductInfoAccordion,
} from "@/components/products";
import { Product } from "@/types/product";
import { getProductBySlug } from "@/services/products/product.service";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product from Sanity CMS using slug
  const product = await getProductBySlug(slug);

  // If product not found, show 404
  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Product Header */}
      <ProductHeader
        productName={product.name}
        productCode={product.product_code}
        category={product.category}
      />

      {/* Main Content: 2-Column Layout (40/60 split) */}
      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-5">
        {/* Left Column: Product Gallery (40%) */}
        <div className="lg:col-span-2">
          <ProductGallery
            images={product.images || [product.image]}
            productName={product.name}
          />
        </div>

        {/* Right Column: Product Info & Purchase (60%) */}
        <div className="lg:col-span-3 space-y-8">
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
  );
}
