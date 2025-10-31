"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Package } from "lucide-react";
import { DoughnutSkeleton } from "./chart-skeleton";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusData {
  status: string;
  count: number;
  percentage: number;
}

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

  // Prepare chart data
  const chartData = {
    labels: data.map((entry) => entry.status),
    datasets: [
      {
        data: data.map((entry) => entry.count),
        backgroundColor: [
          "rgba(148, 163, 184, 0.8)", // Pending - slate
          "rgba(59, 130, 246, 0.8)", // Processing - blue
          "rgba(245, 158, 11, 0.8)", // Shipped - amber
          "rgba(16, 185, 129, 0.8)", // Delivered - emerald
          "rgba(239, 68, 68, 0.8)", // Cancelled - red
        ],
        borderColor: [
          "rgb(148, 163, 184)",
          "rgb(59, 130, 246)",
          "rgb(245, 158, 11)",
          "rgb(16, 185, 129)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            family: "Inter, sans-serif",
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage = ((value / context.dataset.data.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
        titleFont: {
          family: "Inter, sans-serif",
          size: 13,
          weight: 600,
        },
        bodyFont: {
          family: "Inter, sans-serif",
          size: 12,
        },
      },
    },
  };

  if (loading) {
    return <DoughnutSkeleton />;
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

  // Calculate center text
  const totalOrders = data.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <div className="relative h-[400px]">
      <Doughnut data={chartData} options={chartOptions} />
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold">{totalOrders}</div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Orders
          </div>
        </div>
      </div>
    </div>
  );
}
