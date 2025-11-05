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
    <div className="space-y-6 pb-8 border-b border-neutral-200">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Product Title */}
      <div className="space-y-3">
        <h1 className="text-3xl font-light text-neutral-900 md:text-4xl lg:text-5xl">
          {productName}
        </h1>

        {/* Product Code / SKU */}
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <span>SKU:</span>
          <span className="font-normal text-neutral-900">{productCode}</span>
        </div>
      </div>
    </div>
  );
}
