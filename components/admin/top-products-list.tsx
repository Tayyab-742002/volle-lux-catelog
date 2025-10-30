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
      {products.map((product, index) => {
        // Medal colors for top 3
        const getRankColor = (rank: number) => {
          if (rank === 0) return "from-yellow-400 to-yellow-600 text-white";
          if (rank === 1) return "from-gray-300 to-gray-500 text-white";
          if (rank === 2) return "from-orange-300 to-orange-600 text-white";
          return "from-slate-100 to-slate-200 text-slate-700";
        };

        return (
          <div
            key={product.name}
            className="group flex items-center justify-between rounded-xl border bg-gradient-to-r from-white to-slate-50 p-5 transition-all hover:shadow-md dark:from-slate-900 dark:to-slate-800"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getRankColor(
                  index
                )} shadow-lg`}
              >
                <span className="text-lg font-bold">#{index + 1}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold transition-colors group-hover:text-primary">
                  {product.name}
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {product.quantity} sold
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(product.revenue)}
              </div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
          </div>
        );
      })}
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

