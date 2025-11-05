"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ReferenceLine,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartDataPoint } from "@/types";
import { useTheme } from "next-themes";
import { TrendingUp } from "lucide-react";
import { chartTimeRanges } from "@/constants/zcash";

type ZcashChartProps = {
  title: string;
  icon: React.ReactNode;
  xAxisLabel: string;
  yAxisLabel: string;
  data: ChartDataPoint[];
  formatNumber: (value: number) => string;
  opening?: number;
  loading?: boolean;
  timeRange: string;
  onTimeRangeChange: (timeRange: string) => void;
};

const ZcashChart: React.FC<ZcashChartProps> = ({
  title,
  icon,
  xAxisLabel,
  yAxisLabel,
  data,
  formatNumber,
  opening,
  loading,
  timeRange,
  onTimeRangeChange,
}) => {
  const { theme } = useTheme();

  const gridColor = theme === "light" ? "#ccc" : "#333";
  const textColor = theme === "light" ? "#333" : "#ccc";
  const tooltipBg = theme === "light" ? "#ffffff" : "#1a1a1a";
  const tooltipBorder = theme === "light" ? "#e0e0e0" : "#333";

  const chartData = data.map((p: any) => ({
    x: p.x * 1000,
    y: p.y,
  }));

  return (
    <Card className="mb-8 sm:mb-10 lg:mb-12 animate-slide-in-from-bottom animation-delay-800">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6">
        {/* Title */}
        <div className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl font-semibold leading-none tracking-tight">
          <span className="flex-shrink-0">{icon}</span>
          <span className="truncate">{title}</span>
        </div>

        {/* Time Range Buttons */}
        <div className="flex justify-start sm:justify-end items-center w-full sm:w-auto">
          <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 w-full sm:w-auto">
            <div className="flex gap-1 sm:gap-1.5 lg:gap-2 items-center min-w-max">
              {chartTimeRanges.map((range) => (
                <button
                  key={range.value}
                  className={`px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs lg:text-[13px] min-w-[32px] sm:min-w-[36px] text-center font-medium rounded cursor-pointer transition-all duration-200 whitespace-nowrap ${
                    timeRange === range.value
                      ? `bg-muted dark:text-white text-black font-semibold`
                      : `bg-transparent dark:text-gray-400 text-gray-600 hover:bg-muted/50`
                  }`}
                  onClick={() => onTimeRangeChange(range.value)}
                  disabled={loading}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <CardContent className="px-0 sm:px-4 lg:px-6 pb-4 sm:pb-5 lg:pb-6">
        <div className="h-64 sm:h-80 md:h-96 pt-2 sm:pt-3 lg:pt-5 w-full overflow-hidden">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                  <div className="absolute inset-0 border-3 sm:border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                  <div className="absolute inset-0 border-3 sm:border-4 border-transparent border-t-[#f7931a] rounded-full animate-spin"></div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Loading chart data...
                </p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs sm:text-sm text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 10 : 20,
                  left: window.innerWidth < 640 ? -20 : 10,
                  bottom: window.innerWidth < 640 ? 20 : 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  strokeOpacity={0.6}
                />

                <XAxis
                  dataKey="x"
                  type="category"
                  tick={{ fill: textColor, fontSize: window.innerWidth < 640 ? 10 : 12 }}
                  axisLine={false}
                  tickLine={false}
                  ticks={chartData
                    .filter(
                      (_, i) =>
                        i % Math.max(1, Math.floor(data.length / (window.innerWidth < 640 ? 4 : 6))) === 0
                    )
                    .slice(0, window.innerWidth < 640 ? 5 : 7)
                    .map((d) => d.x)}
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    if (window.innerWidth < 640) {
                      return d.toLocaleDateString("en-US", {
                        month: "short",
                      });
                    }
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  angle={window.innerWidth < 640 ? -45 : 0}
                  textAnchor={window.innerWidth < 640 ? "end" : "middle"}
                  height={window.innerWidth < 640 ? 50 : 30}
                />

                <YAxis
                  orientation="right"
                  dataKey="y"
                  tick={{ fill: textColor, fontSize: window.innerWidth < 640 ? 9 : 12 }}
                  axisLine={true}
                  tickLine={false}
                  tickFormatter={formatNumber}
                  domain={["dataMin * 0.995", "dataMax * 1.005"]}
                  tickCount={window.innerWidth < 640 ? 6 : 9}
                  width={window.innerWidth < 640 ? 60 : 80}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: "6px",
                    fontSize: window.innerWidth < 640 ? "11px" : "13px",
                    padding: window.innerWidth < 640 ? "6px 8px" : "8px 12px",
                  }}
                  labelStyle={{ 
                    color: textColor, 
                    fontWeight: 500,
                    fontSize: window.innerWidth < 640 ? "11px" : "13px",
                  }}
                  itemStyle={{ 
                    color: "#f7931a",
                    fontSize: window.innerWidth < 640 ? "11px" : "13px",
                  }}
                  formatter={(value: number) => [
                    formatNumber(value),
                    yAxisLabel,
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />

                {opening !== undefined && (
                  <ReferenceLine
                    y={opening}
                    stroke={textColor}
                    strokeDasharray="3 3"
                    strokeOpacity={0.5}
                  />
                )}

                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#f7931a"
                  strokeWidth={window.innerWidth < 640 ? 1.5 : 2}
                  dot={false}
                  activeDot={{
                    r: window.innerWidth < 640 ? 4 : 6,
                    fill: "#f7931a",
                    stroke: theme === "light" ? "#ffffff" : "#1a1a1a",
                    strokeWidth: window.innerWidth < 640 ? 1.5 : 2,
                  }}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ZcashChart;
