import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { ChartDataPoint } from "@/types";
import { getApiUrl } from "@/lib/config";

export const useBitcoin = () => {

  const [difficultyChartData, setDifficultyChartData] = useState<ChartDataPoint[]>([]);
  const [hashrateChartData, setHashrateChartData] = useState<ChartDataPoint[]>([]);
  const [priceChartData, setPriceChartData] = useState<ChartDataPoint[]>([]);

  const [isDifficultyChartLoading, setIsDifficultyChartLoading] = useState(false);
  const [isHashrateChartLoading, setIsHashrateChartLoading] = useState(false);
  const [isPriceChartLoading, setIsPriceChartLoading] = useState(false);

  const [difficultyCurrentTimerange, setDiffcultyCurrentTimerange] = useState('all');
  const [hashrateCurrentTimerange, setHashrateCurrentTimerange] = useState('all');
  const [priceCurrentTimerange, setPriceCurrentTimerange] = useState('all');


  const fetchPriceChart = useCallback(async (timeRange: string = priceCurrentTimerange) => {
      setIsPriceChartLoading(true);
      try {
        const timestamp = new Date().getTime();
        const response = await axios.get(getApiUrl(`/bitcoin/chart/price?timespan=${timestamp}`));

        if (!response.status) {
          throw new Error(`Error fetching price chart data: ${response.status}`);
        }
        setPriceChartData(response.data.values);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setPriceChartData([]);
      } finally {
        setIsPriceChartLoading(false);
      }
    },
    [priceCurrentTimerange]
  );

    const fetchHashrateChart = useCallback(async (timeRange: string = hashrateCurrentTimerange) => {
      setIsHashrateChartLoading(true);
      try {
        const timestamp = new Date().getTime();
        const response = await axios.get(getApiUrl(`/bitcoin/chart/hashrate?timespan=${timestamp}`));

        if (!response.status) {
          throw new Error(`Error fetching hashrate chart data: ${response.status}`);
        }
        setHashrateChartData(response.data.values);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setHashrateChartData([]);
      } finally {
        setIsHashrateChartLoading(false);
      }
    },
    [hashrateCurrentTimerange]
  );

  useEffect(() => {
      fetchPriceChart("all")
      fetchHashrateChart("all")
  }, []);

  return {
    difficultyChartData,
    setDifficultyChartData,
    isDifficultyChartLoading,
    setIsDifficultyChartLoading,
    difficultyCurrentTimerange,
    setDiffcultyCurrentTimerange,
    fetchPriceChart,
    hashrateChartData,
    setHashrateChartData,
    isHashrateChartLoading,
    setIsHashrateChartLoading,
    hashrateCurrentTimerange,
    setHashrateCurrentTimerange,
    priceChartData,
    setPriceChartData,
    isPriceChartLoading,
    setIsPriceChartLoading,
    priceCurrentTimerange,
    setPriceCurrentTimerange
  };
};

export default useBitcoin;