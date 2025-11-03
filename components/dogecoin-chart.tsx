"use client";

import React from "react";
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
import { chartTimeRanges } from "@/constants/dogecoin";

type DogecoinChartProps = {
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

const DogecoinChart: React.FC<DogecoinChartProps> = ({
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


  const dogecoinColor = "hsl(var(--accent-dogecoin))";
  const gridColor = theme === "light" ? "#ccc" : "#333";
  const textColor = theme === "light" ? "#333" : "#ccc";
  const tooltipBg = theme === "light" ? "#ffffff" : "#1a1a1a";
  const tooltipBorder = theme === "light" ? "#e0e0e0" : "#333";
  const dotStroke = theme === "light" ? "#ffffff" : "#1a1a1a";

  const chartData = data.map((p: any) => ({
    x: p.x * 1000,
    y: p.y,
  }));

  return (
    <Card className="mb-12 animate-slide-in-from-bottom animation-delay-800">
      <div className="flex justify-between space-y-1.5 p-6">
        <div className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
          {icon}
          <span className="">{title}</span>
        </div>
        <div className="flex justify-end items-center">
          <div className="flex gap-1 items-center md:overflow-x-auto md:pb-0 md:scrollbar-none">
            <div className="flex gap-2 items-center text-muted-foreground md:gap-3 md:w-auto md:justify-start">
              {chartTimeRanges.map((range) => (
                <button
                  key={range.value}
                  className={`px-2 py-1.5 text-xs min-w-[36px] text-center font-medium rounded cursor-pointer transition-all duration-200 md:px-3 md:min-w-[32px] md:text-[13px] ${
                    timeRange === range.value
                      ? `bg-dogecoin text-white md:font-semibold`
                      : `bg-transparent dark:text-gray-400 text-gray-600 md:font-normal hover:text-dogecoin`
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

      <CardContent>
        <div className="h-96 pt-5">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                  <div
                    className="absolute inset-0 border-4 border-transparent rounded-full animate-spin"
                    style={{
                      borderTopColor: dogecoinColor,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Loading chart data...
                </p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  strokeOpacity={0.6}
                />

                <XAxis
                  dataKey="x"
                  type="category"
                  tick={{ fill: textColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  ticks={chartData
                    .filter(
                      (_, i) =>
                        i % Math.max(1, Math.floor(data.length / 6)) === 0
                    )
                    .slice(0, 7)
                    .map((d) => d.x)}
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />

                <YAxis
                  orientation="right"
                  dataKey="y"
                  tick={{ fill: textColor, fontSize: 12 }}
                  axisLine={true}
                  tickLine={false}
                  tickFormatter={formatNumber}
                  domain={["dataMin * 0.995", "dataMax * 1.005"]}
                  tickCount={9}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                  labelStyle={{ color: textColor, fontWeight: 500 }}
                  itemStyle={{ color: dogecoinColor }}
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
                  stroke={dogecoinColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: dogecoinColor,
                    stroke: dotStroke,
                    strokeWidth: 2,
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

export default DogecoinChart;