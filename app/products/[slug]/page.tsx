import {
  ProductGallery,
  ProductHeader,
  VariantSelector,
  PricingTable,
  QuantityPriceSelector,
  AddToCartButton,
  ProductInfoAccordion,
} from "@/components/products";
import { Product } from "@/types/product";

// Mock product data - will be replaced with Sanity CMS data later
const mockProduct: Product = {
  id: "1",
  product_code: "BOX-001",
  name: "Heavy Duty Shipping Boxes",
  slug: "heavy-duty-shipping-boxes",
  description:
    "Premium heavy-duty shipping boxes designed to protect your products during transit. Made from high-quality corrugated cardboard with reinforced edges for maximum durability.",
  image:
    "https://images.unsplash.com/photo-1680034977375-3d83ee017e52?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
  images: [
    "https://images.unsplash.com/photo-1680034977375-3d83ee017e52?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1592829016842-156c305ecc7e?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1617912760778-f3a1b93192ad?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
  ],
  basePrice: 2.5,
  discount: 20,
  category: "Boxes",
  variants: [
    { id: "v1", name: "C4", sku: "BOX-001-C4", price_adjustment: 0 },
    { id: "v2", name: "C5", sku: "BOX-001-C5", price_adjustment: 0.5 },
    { id: "v3", name: "C6", sku: "BOX-001-C6", price_adjustment: 1.0 },
  ],
  pricingTiers: [
    {
      minQuantity: 1,
      maxQuantity: 49,
      pricePerUnit: 2.5,
    },
    {
      minQuantity: 50,
      maxQuantity: 99,
      pricePerUnit: 2.25,
      discount: 10,
      label: "10% Off",
    },
    {
      minQuantity: 100,
      pricePerUnit: 2.0,
      discount: 20,
      label: "Wholesale",
    },
  ],
  specifications: {
    Material: "Corrugated Cardboard",
    "Max Weight": "65 lbs",
    Dimensions: "Various Sizes",
    Certification: "FSC Certified",
  },
  delivery:
    "Standard delivery: 3-5 business days. Express delivery available. Free shipping on orders over $100.",
};

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // TODO: Fetch product from Sanity CMS using slug
  // const product = await getProductBySlug(slug);

  // For now, use mock data
  const product = mockProduct;

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
          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector variants={product.variants} label="Size" />
          )}

          {/* Pricing Table */}
          {product.pricingTiers && product.pricingTiers.length > 0 && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="label-luxury mb-4 text-sm font-medium">
                Pricing Tiers
              </h3>
              <PricingTable
                tiers={product.pricingTiers}
                basePrice={product.basePrice}
              />
            </div>
          )}

          {/* Quantity Selector & Price Display */}
          <QuantityPriceSelector
            pricingTiers={product.pricingTiers || []}
            basePrice={product.basePrice}
          />

          {/* Add to Cart Button */}
          <AddToCartButton
            productName={product.name}
            quantity={1}
            variantId={product.variants?.[0]?.id}
          />

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
