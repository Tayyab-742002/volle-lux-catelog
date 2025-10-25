import { Breadcrumbs } from "@/components/common/breadcrumbs";

interface ProductHeaderProps {
  productName: string;
  productCode: string;
  category?: string;
  categorySlug?: string;
}

export function ProductHeader({
  productName,
  productCode,
  category,
  categorySlug,
}: ProductHeaderProps) {
  const breadcrumbItems = [
    { label: "Products", href: "/products" },
    ...(category && categorySlug
      ? [{ label: category, href: `/products/${categorySlug}` }]
      : []),
    { label: productName },
  ];

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Product Title */}
      <h1 className="text-4xl font-bold md:text-5xl">{productName}</h1>

      {/* Product Code / SKU */}
      <div className="flex items-center gap-2">
        <span className="label-luxury text-muted-foreground">SKU:</span>
        <span className="label-luxury font-medium">{productCode}</span>
      </div>
    </div>
  );
}
