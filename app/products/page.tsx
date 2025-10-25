import { ProductFilters } from "@/components/products/product-filters";
import { ProductCard } from "@/components/products/product-card";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Product } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - will be replaced with Sanity CMS data later
const products: Product[] = [
  {
    id: "1",
    product_code: "BOX-001",
    name: "Heavy Duty Shipping Boxes",
    slug: "heavy-duty-shipping-boxes",
    image:
      "https://images.unsplash.com/photo-1680034977375-3d83ee017e52?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    basePrice: 1.99,
    discount: 20,
    variants: [
      { id: "v1", name: "C4", sku: "BOX-001-C4", price_adjustment: 0 },
      { id: "v2", name: "C5", sku: "BOX-001-C5", price_adjustment: 0.5 },
      { id: "v3", name: "C6", sku: "BOX-001-C6", price_adjustment: 1.0 },
    ],
  },
  {
    id: "2",
    product_code: "WRAP-001",
    name: "Premium Bubble Wrap",
    slug: "premium-bubble-wrap",
    image:
      "https://images.unsplash.com/photo-1592829016842-156c305ecc7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    basePrice: 2.49,
    discount: 15,
    variants: [
      { id: "v1", name: "Small", sku: "WRAP-001-S", price_adjustment: 0 },
      { id: "v2", name: "Medium", sku: "WRAP-001-M", price_adjustment: 0.5 },
      { id: "v3", name: "Large", sku: "WRAP-001-L", price_adjustment: 1.0 },
    ],
  },
  {
    id: "3",
    product_code: "ENV-001",
    name: "Bubble Mailers",
    slug: "bubble-mailers",
    image:
      "https://images.unsplash.com/photo-1617912760778-f3a1b93192ad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    basePrice: 0.99,
    variants: [
      { id: "v1", name: "6x10", sku: "ENV-001-6x10", price_adjustment: 0 },
      { id: "v2", name: "9x12", sku: "ENV-001-9x12", price_adjustment: 0.3 },
      { id: "v3", name: "12x15", sku: "ENV-001-12x15", price_adjustment: 0.6 },
    ],
  },
  {
    id: "4",
    product_code: "PKG-001",
    name: "Eco-Friendly Packaging Tape",
    slug: "eco-friendly-packaging-tape",
    image:
      "https://images.unsplash.com/photo-1617912760717-06f3976cf18c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    basePrice: 3.99,
    discount: 10,
    variants: [
      { id: "v1", name: '1"', sku: "PKG-001-1", price_adjustment: 0 },
      { id: "v2", name: '2"', sku: "PKG-001-2", price_adjustment: 1.0 },
      { id: "v3", name: '3"', sku: "PKG-001-3", price_adjustment: 2.0 },
    ],
  },
  {
    id: "5",
    product_code: "BOX-002",
    name: "Custom Printed Boxes",
    slug: "custom-printed-boxes",
    image:
      "https://images.unsplash.com/photo-1577702312706-e23ff063064f?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    basePrice: 4.99,
    discount: 25,
    variants: [
      { id: "v1", name: "S", sku: "BOX-002-S", price_adjustment: 0 },
      { id: "v2", name: "M", sku: "BOX-002-M", price_adjustment: 1.5 },
      { id: "v3", name: "L", sku: "BOX-002-L", price_adjustment: 3.0 },
    ],
  },
  {
    id: "6",
    product_code: "ECO-001",
    name: "Compostable Poly Mailers",
    slug: "compostable-poly-mailers",
    image:
      "https://images.unsplash.com/photo-1513004132127-ade5a645d3e0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1548",
    basePrice: 1.49,
    discount: 20,
    variants: [
      { id: "v1", name: "A6", sku: "ECO-001-A6", price_adjustment: 0 },
      { id: "v2", name: "A7", sku: "ECO-001-A7", price_adjustment: 0.2 },
      { id: "v3", name: "A8", sku: "ECO-001-A8", price_adjustment: 0.4 },
    ],
  },
  {
    id: "7",
    product_code: "STUFF-001",
    name: "Peanuts Loose Fill",
    slug: "peanuts-loose-fill",
    image:
      "https://images.unsplash.com/photo-1595246135406-803418233494?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    basePrice: 2.99,
    discount: 15,
    variants: [
      { id: "v1", name: "1 cu ft", sku: "STUFF-001-1", price_adjustment: 0 },
      { id: "v2", name: "3 cu ft", sku: "STUFF-001-3", price_adjustment: 1.5 },
      { id: "v3", name: "5 cu ft", sku: "STUFF-001-5", price_adjustment: 2.5 },
    ],
  },
  {
    id: "8",
    product_code: "TUBE-001",
    name: "Shipping Tubes",
    slug: "shipping-tubes",
    image:
      "https://images.unsplash.com/photo-1717323788190-315b59cc7607?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    basePrice: 0.79,
    variants: [
      { id: "v1", name: "6x24", sku: "TUBE-001-6x24", price_adjustment: 0 },
      { id: "v2", name: "6x36", sku: "TUBE-001-6x36", price_adjustment: 0.3 },
      { id: "v3", name: "8x36", sku: "TUBE-001-8x36", price_adjustment: 0.6 },
    ],
  },
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Products", href: "/products" }]} />

      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">All Products</h1>
          <p className="text-muted-foreground">
            Showing {products.length} products
          </p>
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content: 2-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
