import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { ChartDataPoint } from "@/types";

export const useBitcoin = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartTimeRange, setChartTimeRange] = useState<string>("3m");
  const [isChartLoading, setIsChartLoading] = useState(false);

  const fetchChart = useCallback(
    async (timeRange: string = chartTimeRange) => {
      setIsChartLoading(true);
      try {
        const timestamp = new Date().getTime();
        const densityParam =
          timeRange === "1d"
            ? "&interval=5m"
            : timeRange === "7d"
              ? "&interval=30m"
              : timeRange === "30d" || timeRange === "1m"
                ? "&interval=1h"
                : timeRange === "90d" || timeRange === "3m"
                  ? "&interval=4h"
                  : "&interval=1d";

        const response = await axios.get(`https://droomdroom.com/price/api/coin/chart/1?timeRange=${timeRange}${densityParam}&_t=${timestamp}`)
        const data = response.data;
        const processedData = data.map((item: any, index: number) => ({
          timestamp: item.time || item.timestamp || item[0],
          price: item.price || item[1],
          volume: item.volume || Math.random() * 1000000 + 500000,
          percent_change_24h: item.percent_change_24h || 0,
        }));
        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setChartData([]);
      } finally {
        setIsChartLoading(false);
      }
    },
    [chartTimeRange]
  );

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  return {
    chartData,
    isChartLoading,
    chartTimeRange,
    setChartTimeRange,
    fetchChart,
  };
};

export default useBitcoin;