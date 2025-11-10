"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp } from "lucide-react";
import { ChartSkeleton } from "./chart-skeleton";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  initialData?: RevenueDataPoint[];
}

export function RevenueChart({ initialData = [] }: RevenueChartProps) {
  const [data, setData] = useState<RevenueDataPoint[]>(initialData);
  const [loading, setLoading] = useState(!initialData.length);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">(
    "30d"
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/analytics?type=revenue&timeRange=${timeRange}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch revenue data");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    if (!initialData.length) {
      fetchData();
    }
  }, [timeRange, initialData.length, fetchData]);

  // Format date for display
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Calculate totals
  const totalRevenue = data.reduce((sum, point) => sum + point.revenue, 0);
  const totalOrders = data.reduce((sum, point) => sum + point.orders, 0);

  // Prepare chart data
  const chartData = {
    labels: data.map((point) => formatDate(point.date)),
    datasets: [
      {
        label: "Revenue",
        data: data.map((point) => point.revenue),
        borderColor: "rgb(5, 150, 105)", // emerald-600
        backgroundColor: "rgba(5, 150, 105, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(5, 150, 105)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        yAxisID: "y",
      },
      {
        label: "Orders",
        data: data.map((point) => point.orders),
        borderColor: "rgb(20, 184, 166)", // teal-500
        backgroundColor: "rgba(20, 184, 166, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(20, 184, 166)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
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
          label: function (context: {
            dataset: { label?: string };
            parsed: { y: number | null };
          }) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (label.includes("Revenue")) {
                label += `£${context.parsed.y.toFixed(2)}`;
              } else {
                label += context.parsed.y.toFixed(0);
              }
            }
            return label;
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
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            family: "Inter, sans-serif",
            size: 11,
          },
          color: "rgb(148, 163, 184)",
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            family: "Inter, sans-serif",
            size: 11,
          },
          color: "rgb(148, 163, 184)",
          callback: function (value: number | string) {
            if (typeof value === "number") {
              return "£" + value.toFixed(0);
            }
            return value;
          },
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            family: "Inter, sans-serif",
            size: 11,
          },
          color: "rgb(148, 163, 184)",
        },
      },
    },
  };

  if (loading) {
    return <ChartSkeleton />;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-linear-to-br from-emerald-100 to-teal-100 p-4 border border-emerald-200">
              <TrendingUp
                className="mx-auto h-12 w-12 text-emerald-600"
                strokeWidth={2}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
            <p className="text-lg font-medium text-gray-900">No revenue data</p>
            <p className="mt-2 text-sm text-gray-600">
              Revenue data will appear here once orders are placed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-300 bg-linear-to-br from-emerald-50 to-teal-50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
            <DollarSign className="h-4 w-4" strokeWidth={2} />
            Total Revenue
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            £{totalRevenue.toFixed(2)}
          </div>
        </div>
        <div className="rounded-lg border border-gray-300 bg-linear-to-br from-teal-50 to-cyan-50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-teal-700">
            <TrendingUp className="h-4 w-4" strokeWidth={2} />
            Total Orders
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {totalOrders}
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={timeRange === "7d" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("7d")}
          className={`transition-all hover:scale-105 ${
            timeRange === "7d"
              ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
              : "border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
          }`}
        >
          7 Days
        </Button>
        <Button
          variant={timeRange === "30d" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("30d")}
          className={`transition-all hover:scale-105 ${
            timeRange === "30d"
              ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
              : "border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
          }`}
        >
          30 Days
        </Button>
        <Button
          variant={timeRange === "90d" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("90d")}
          className={`transition-all hover:scale-105 ${
            timeRange === "90d"
              ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
              : "border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
          }`}
        >
          90 Days
        </Button>
        <Button
          variant={timeRange === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("all")}
          className={`transition-all hover:scale-105 ${
            timeRange === "all"
              ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
              : "border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
          }`}
        >
          All Time
        </Button>
      </div>

      {/* Chart */}
      <div className="h-[400px] rounded-lg border border-gray-300 bg-white p-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
