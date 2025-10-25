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
import { useTheme } from "next-themes";

type ChartDataPoint = {
  timestamp: number;
  price: number;
  priceVisual?: number;
};

type BitcoinPriceChartProps = {
  chartData: ChartDataPoint[];
  openingPrice?: number;
};

const BitcoinPriceChart: React.FC<BitcoinPriceChartProps> = ({
  chartData,
  openingPrice,
}) => {
  const { theme } = useTheme();
  const processedData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];

    const maxPoints = 800;
    const step = Math.max(1, Math.ceil(chartData.length / maxPoints));

    return chartData
      .filter((_, index) => index % step === 0)
      .map((item) => ({
        ...item,
        priceVisual: item.priceVisual || item.price,
        date: new Date(item.timestamp * 1000),
      }));
  }, [chartData]);

  const formatPrice = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  };

  const gridColor = theme === "light" ? "#f0f0f0" : "#333";
  const textColor = theme === "light" ? "#333" : "#ccc";
  const tooltipBg = theme === "light" ? "#ffffff" : "#1a1a1a";
  const tooltipBorder = theme === "light" ? "#e0e0e0" : "#333";

  return (
    <Card className="animate-slide-in-from-bottom animation-delay-800">
      <CardContent>
        <div className="h-96 pt-5">
          {processedData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No price data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={processedData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  strokeOpacity={0.6}
                />

                <XAxis
                  dataKey="date"
                  type="category"
                  tick={{ fill: textColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  //   @ts-ignore
                  ticks={processedData
                    .filter(
                      (_, i) =>
                        i %
                          Math.max(1, Math.floor(processedData.length / 6)) ===
                        0
                    )
                    .slice(0, 7)
                    .map((d) => d.date)}
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />

                <YAxis
                  tick={{ fill: textColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatPrice}
                  domain={["dataMin * 0.995", "dataMax * 1.005"]}
                  tickCount={7}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                  labelStyle={{ color: textColor, fontWeight: 500 }}
                  itemStyle={{ color: "#10b981" }}
                  formatter={(value: number) => [formatPrice(value), "Price"]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />

                {openingPrice !== undefined && (
                  <ReferenceLine
                    y={openingPrice}
                    stroke={textColor}
                    strokeDasharray="3 3"
                    strokeOpacity={0.5}
                  />
                )}

                <Line
                  type="monotone"
                  dataKey="priceVisual"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#10b981",
                    stroke: theme === "light" ? "#ffffff" : "#1a1a1a",
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

export default BitcoinPriceChart;
