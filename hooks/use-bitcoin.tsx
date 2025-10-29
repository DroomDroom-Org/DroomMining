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
      const response = await axios.get(getApiUrl(`/bitcoin/chart/price?timespan=${timeRange}`));

      if (!response.status) {
        throw new Error(`Error fetching price chart data: ${response.status}`);
      }
      setPriceChartData(response.data.data);
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
      const response = await axios.get(getApiUrl(`/bitcoin/chart/hashrate?timespan=${timeRange}`));

      if (!response.status) {
        throw new Error(`Error fetching hashrate chart data: ${response.status}`);
      }
      setHashrateChartData(response.data.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setHashrateChartData([]);
    } finally {
      setIsHashrateChartLoading(false);
    }
  },
    [hashrateCurrentTimerange]
  );


  const fetchDifficultyChart = useCallback(async (timeRange: string = hashrateCurrentTimerange) => {
    setIsDifficultyChartLoading(true);
    try {
      const response = await axios.get(getApiUrl(`/bitcoin/chart/difficulty?timespan=${timeRange}`));
      console.log(response);
      if (!response.status) {
        throw new Error(`Error fetching difficulty chart data: ${response.status}`);
      }
      setDifficultyChartData(response.data.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setDifficultyChartData([]);
    } finally {
      setIsDifficultyChartLoading(false);
    }
  },
    [difficultyCurrentTimerange]
  );

  return {
    difficultyChartData,
    setDifficultyChartData,
    isDifficultyChartLoading,
    setIsDifficultyChartLoading,
    difficultyCurrentTimerange,
    setDiffcultyCurrentTimerange,
    fetchPriceChart,
    fetchHashrateChart,
    fetchDifficultyChart,
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