"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Package } from "lucide-react";

interface StatusData {
  status: string;
  count: number;
  percentage: number;
}

const COLORS = {
  Pending: "#94a3b8",
  Processing: "#3b82f6",
  Shipped: "#f59e0b",
  Delivered: "#10b981",
  Cancelled: "#ef4444",
};

interface OrdersStatusChartProps {
  initialData?: StatusData[];
}

export function OrdersStatusChart({ initialData = [] }: OrdersStatusChartProps) {
  const [data, setData] = useState<StatusData[]>(initialData);
  const [loading, setLoading] = useState(!initialData.length);

  useEffect(() => {
    if (!initialData.length) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/analytics?type=ordersByStatus");

      if (!response.ok) {
        throw new Error("Failed to fetch status data");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching status data:", error);
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

  if (data.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No orders yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data as any}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => `${entry.status}: ${entry.percentage.toFixed(1)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={COLORS[entry.status as keyof typeof COLORS] || "#94a3b8"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            formatter={(value: number, name: string) => [
              value,
              name === "count" ? "Orders" : name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

