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
      ? [{ label: category, href: `/products?category=${categorySlug}` }]
      : []),
    { label: productName },
  ];

  return (
    <div className="space-y-6 pb-8 border-b-2 border-emerald-200">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Product Title */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
          {productName}
        </h1>

        {/* Product Code / SKU */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">SKU:</span>
          <span className="px-3 py-1.5 bg-linear-to-r from-emerald-100 to-teal-100 rounded-lg text-sm font-semibold text-emerald-700 border border-emerald-400">
            {productCode}
          </span>
        </div>
      </div>
    </div>
  );
}
