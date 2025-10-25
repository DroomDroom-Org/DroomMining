"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bitcoin,
  Zap,
  TrendingUp,
  Clock,
  Hash,
  ExternalLink,
  Calculator,
  ChevronRight,
  DollarSign,
  Gauge,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { getCmcImageUrl } from "@/lib/config";
import BitcoinNavigation from "@/components/bitcoin-navigation";
import useBitcoin from "@/hooks/use-bitcoin";
import { chartTimeRanges } from "@/lib/constant";
import BitcoinChart from "@/components/bitcoin-chart";

export default function BitcoinMiningPage() {
  const {
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
    setPriceCurrentTimerange,
    fetchHashrateChart,
    fetchDifficultyChart,
  } = useBitcoin();

  const [liveData, setLiveData] = useState({
    blockCount: 920545,
    difficulty: 146716052770110,
    networkHashrate: 1145710.27, // PH/s
    blockReward: 3.125,
    blockTime: 10,
    difficultyRetarget: 2016,
    prices: {
      bitstamp: 111177.0,
      coingecko: 111195.0,
      coinbase: 111199.55,
    },
    volume: 1751.34282734,
  });

  const basicInfo = [
    { key: "Name", value: "Bitcoin" },
    { key: "Symbol / Tag", value: "BTC" },
    {
      key: "Logo",
      value: (
        <img
          src={getCmcImageUrl(1)}
          alt="Bitcoin Logo"
          className="w-8 h-8 rounded"
        />
      ),
    },
    {
      key: "Genesis Block Created",
      value: "Saturday, January 3, 2009 18:15:05 GMT",
    },
    {
      key: "Website",
      value: (
        <a
          href="https://bitcoin.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          bitcoin.org <ExternalLink className="h-4 w-4 inline ml-1" />
        </a>
      ),
    },
    {
      key: "Github / Source Code",
      value: (
        <a
          href="https://github.com/bitcoin/bitcoin"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Github <ExternalLink className="h-4 w-4 inline ml-1" />
        </a>
      ),
    },
    {
      key: "Forum",
      value: (
        <a
          href="https://bitcointalk.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Bitcointalk <ExternalLink className="h-4 w-4 inline ml-1" />
        </a>
      ),
    },
    {
      key: "Status",
      value: (
        <Badge
          variant="default"
          className="bg-bitcoin hover:bg-bitcoin/80"
        >
          Healthy
        </Badge>
      ),
    },
    { key: "Mining Algorithm", value: "SHA-256" },
    { key: "Consensus Scheme", value: "Proof-of-Work" },
    { key: "Coins to be Issued", value: "21,000,000" },
    { key: "Block Time", value: "10.00 minute(s)" },
    { key: "Block Reward", value: `${liveData.blockReward} coins` },
    { key: "Block Count", value: liveData.blockCount.toLocaleString() },
    { key: "Bitcoin Difficulty", value: liveData.difficulty.toLocaleString() },
    {
      key: "Difficulty Retarget",
      value: `${liveData.difficultyRetarget} blocks`,
    },
  ];

  const handleDifficultyTimeRangeChange = (newTimeRange: string) => {
    console.log(newTimeRange);
    setDiffcultyCurrentTimerange(newTimeRange);
    fetchDifficultyChart(newTimeRange);
  };

  const handleHashrateTimeRangeChange = (newTimeRange: string) => {
    setHashrateCurrentTimerange(newTimeRange);
    fetchHashrateChart(newTimeRange);
  };

  const handlePriceTimeRangeChange = (newTimeRange: string) => {
    setPriceCurrentTimerange(newTimeRange);
    fetchPriceChart(newTimeRange);
  };

  const formatChartPrice = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `${value.toFixed(2)}`;
  };

  const formatChartDifficulty = (value: number): string => {
    if (value >= 1e15) return `${(value / 1e15).toFixed(2)}Q`;
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(2);
  };

  const formatChartHashrate = (value: number): string => {
    if (value >= 1e18) return `${(value / 1e18).toFixed(2)}EH/s`;
    if (value >= 1e15) return `${(value / 1e15).toFixed(2)}PH/s`;
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}TH/s`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}GH/s`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}MH/s`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}KH/s`;
    return `${value.toFixed(2)}H/s`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4">
        <BitcoinNavigation />

        {/* Page Header */}
        <div className="w-full mb-4 pt-8">
          <div className="w-full flex items-center gap-4 mb-4">
            <img
              src={getCmcImageUrl(1)}
              alt="Bitcoin Logo"
              className="w-10 h-10 rounded"
            />
            <h1 className="font-bold animate-fade-in">Bitcoin Mining</h1>
          </div>
          <p className="text-xl pl-14">
            Bitcoin mining information - including a Bitcoin mining calculator,
            a list of Bitcoin mining hardware, Bitcoin difficulty with
            historical charts, Bitcoin hashrate charts, as well as the current
            Bitcoin price.
          </p>
        </div>

        {/* Basic Info Table */}
        <Card className="mb-12 animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Bitcoin Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  {basicInfo.map((item, idx) => (
                    <TableRow key={idx} className="border-b border-border/50">
                      <TableCell className="font-medium text-muted-foreground w-1/2">
                        {item.key}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {item.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Mining Summary */}
        <Card className="mb-12 animate-slide-in-from-bottom animation-delay-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Bitcoin Mining Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto mb-6">
              <Table>
                <TableBody>
                  <TableRow className="border-b border-border/50">
                    <TableCell className="font-medium text-muted-foreground">
                      P2P Port
                    </TableCell>
                    <TableCell className="font-semibold">8333</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-border/50">
                    <TableCell className="font-medium text-muted-foreground">
                      RPC Port
                    </TableCell>
                    <TableCell className="font-semibold">8332</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-border/50">
                    <TableCell className="font-medium text-muted-foreground">
                      Blocks
                    </TableCell>
                    <TableCell className="font-semibold">
                      {liveData.blockCount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b border-border/50">
                    <TableCell className="font-medium text-muted-foreground">
                      Network Hashrate
                    </TableCell>
                    <TableCell className="font-semibold">
                      {liveData.networkHashrate.toLocaleString()} PH/s
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">
                      Bitcoin Difficulty
                    </TableCell>
                    <TableCell className="font-semibold">
                      {liveData.difficulty.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-muted-foreground mb-6">
              Calculate your Bitcoin mining profitability and daily Bitcoin
              mining rewards with our Bitcoin mining calculator
            </p>
            <Button
              asChild
              size="lg"
              className="interactive-element bg-bitcoin hover:bg-bitcoin-dark"
            >
              <Link href="/bitcoin/calculator">
                <Calculator className="mr-2 h-4 w-4" />
                Bitcoin Mining Calculator
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <BitcoinChart
          title="Bitcoin Difficulty"
          icon={<Gauge className="h-5 w-5" />}
          xAxisLabel="Date"
          yAxisLabel="Difficulty"
          data={difficultyChartData}
          formatNumber={formatChartDifficulty}
          opening={difficultyChartData[0]?.y}
          loading={isDifficultyChartLoading}
          timeRange={difficultyCurrentTimerange}
          onTimeRangeChange={handleDifficultyTimeRangeChange}
        />

        <BitcoinChart
          title="Bitcoin Hashrate"
          icon={<Hash className="h-5 w-5" />}
          xAxisLabel="Date"
          yAxisLabel="Hashrate"
          data={hashrateChartData}
          formatNumber={formatChartHashrate}
          opening={hashrateChartData[0]?.y}
          loading={isHashrateChartLoading}
          timeRange={hashrateCurrentTimerange}
          onTimeRangeChange={handleHashrateTimeRangeChange}
        />

        <BitcoinChart
          title="Bitcoin Price Chart"
          icon={<TrendingUp className="h-5 w-5" />}
          xAxisLabel="Date"
          yAxisLabel="Price"
          data={priceChartData}
          formatNumber={formatChartPrice}
          opening={priceChartData[0]?.y}
          loading={isPriceChartLoading}
          timeRange={priceCurrentTimerange}
          onTimeRangeChange={handlePriceTimeRangeChange}
        />
      </div>
    </div>
  );
}
