"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Package } from "lucide-react";

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface TopProductsListProps {
  initialData?: TopProduct[];
  limit?: number;
}

export function TopProductsList({ initialData = [], limit = 10 }: TopProductsListProps) {
  const [products, setProducts] = useState<TopProduct[]>(initialData);
  const [loading, setLoading] = useState(!initialData.length);

  useEffect(() => {
    if (!initialData.length) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?type=topProducts&limit=${limit}`);

      if (!response.ok) {
        throw new Error("Failed to fetch top products");
      }

      const result = await response.json();
      setProducts(result);
    } catch (error) {
      console.error("Error fetching top products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No products data</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Product analytics will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product, index) => (
        <div
          key={product.name}
          className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/30"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span className="font-bold text-primary">{index + 1}</span>
            </div>
            <div>
              <div className="font-semibold">{product.name}</div>
              <div className="text-sm text-muted-foreground">
                {product.quantity} sold
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-primary">
              {formatCurrency(product.revenue)}
            </div>
            <div className="text-xs text-muted-foreground">Total revenue</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function for currency formatting
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

