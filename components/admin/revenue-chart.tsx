"use client";

import { useEffect, useState } from "react";
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
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    if (!initialData.length) {
      fetchData();
    }
  }, [timeRange]);

  const fetchData = async () => {
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
  };

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
        borderColor: "rgb(14, 165, 233)", // sky-500
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(14, 165, 233)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        yAxisID: "y",
      },
      {
        label: "Orders",
        data: data.map((point) => point.orders),
        borderColor: "rgb(245, 158, 11)", // amber-500
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(245, 158, 11)",
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
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (label.includes("Revenue")) {
                label += `$${context.parsed.y.toFixed(2)}`;
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
          callback: function (value: any) {
            return "$" + value.toFixed(0);
          },
        } as any,
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
        } as any,
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
          <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No revenue data</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Revenue data will appear here once orders are placed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-950 dark:to-blue-900">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
            <DollarSign className="h-4 w-4" />
            Total Revenue
          </div>
          <div className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-50">
            ${totalRevenue.toFixed(2)}
          </div>
        </div>
        <div className="rounded-lg border bg-gradient-to-br from-amber-50 to-amber-100 p-4 dark:from-amber-950 dark:to-amber-900">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300">
            <TrendingUp className="h-4 w-4" />
            Total Orders
          </div>
          <div className="mt-2 text-3xl font-bold text-amber-900 dark:text-amber-50">
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
          className="transition-all hover:scale-105"
        >
          7 Days
        </Button>
        <Button
          variant={timeRange === "30d" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("30d")}
          className="transition-all hover:scale-105"
        >
          30 Days
        </Button>
        <Button
          variant={timeRange === "90d" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("90d")}
          className="transition-all hover:scale-105"
        >
          90 Days
        </Button>
        <Button
          variant={timeRange === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("all")}
          className="transition-all hover:scale-105"
        >
          All Time
        </Button>
      </div>

      {/* Chart */}
      <div className="h-[400px] rounded-lg bg-gradient-to-br from-white to-slate-50 p-4 dark:from-slate-900 dark:to-slate-800">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
