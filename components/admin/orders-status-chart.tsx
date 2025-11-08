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
          "rgba(203, 213, 225, 0.8)", // Pending - slate-300
          "rgba(94, 234, 212, 0.8)", // Processing - teal-300
          "rgba(52, 211, 153, 0.8)", // Shipped - emerald-400
          "rgba(5, 150, 105, 0.8)", // Delivered - emerald-600
          "rgba(239, 68, 68, 0.8)", // Cancelled - red-500
        ],
        borderColor: [
          "rgb(203, 213, 225)", // slate-300
          "rgb(94, 234, 212)", // teal-300
          "rgb(52, 211, 153)", // emerald-400
          "rgb(5, 150, 105)", // emerald-600
          "rgb(239, 68, 68)", // red-500
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
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-linear-to-br from-emerald-100 to-teal-100 p-4 border border-emerald-200">
              <Package className="mx-auto h-12 w-12 text-emerald-600" strokeWidth={2} />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
            <p className="mt-4 text-lg font-medium text-gray-900">No orders yet</p>
            <p className="mt-2 text-sm text-gray-600">
              Order status data will appear here once orders are placed
            </p>
          </div>
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
          <div className="text-3xl font-bold text-gray-900">{totalOrders}</div>
          <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
            Total Orders
          </div>
        </div>
      </div>
    </div>
  );
}
