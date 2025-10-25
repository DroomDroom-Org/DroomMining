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
import { getCmcImageUrl } from "@/lib/config";
import BitcoinNavigation from "@/components/bitcoin-navigation";
import useBitcoin from "@/hooks/use-bitcoin";
import BitcoinChart from "@/components/bitcoin-chart";
import { ChartDataPoint, BitcoinStats } from "@/types";
import { formatDifficulty, formatPrice, formatHashrate } from "@/lib/format";

interface BitcoinHomePageClientProps {
  statsData: BitcoinStats;
  difficultyData: ChartDataPoint[];
  hashrateData: ChartDataPoint[];
  priceData?: ChartDataPoint[];
}

export default function BitcoinHomePageClient({
  statsData,
  difficultyData,
  hashrateData,
  priceData,
}: BitcoinHomePageClientProps) {
  const {
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
    setPriceCurrentTimerange,
  } = useBitcoin();

  const [stats, setStats] = useState({
    blockCount: 0,
    difficulty: 0,
    networkHashrate: 0,
    blockReward: 0,
    blockTime: 0,
    difficultyRetarget: 0,
    volume: 0,
  });

  useEffect(() => {
    if (statsData) {
      setStats({
        blockCount: statsData.blockCount,
        difficulty: statsData.difficulty,
        networkHashrate: statsData.networkHashrate,
        blockReward: statsData.blockReward,
        blockTime: statsData.blockTime,
        difficultyRetarget: statsData.difficultyRetarget,
        volume: statsData.volume,
      });
    }
    if (difficultyData) {
      setDifficultyChartData(difficultyData);
    }
    if (hashrateData) {
      setHashrateChartData(hashrateData);
    }
    if (priceData) {
      setPriceChartData(priceData);
    }
  }, [statsData, difficultyData, hashrateData, priceData]);

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
        <Badge variant="default" className="bg-bitcoin hover:bg-bitcoin/80">
          Healthy
        </Badge>
      ),
    },
    { key: "Mining Algorithm", value: "SHA-256" },
    { key: "Consensus Scheme", value: "Proof-of-Work" },
    { key: "Coins to be Issued", value: "21,000,000" },
    { key: "Block Time", value: "10.00 minute(s)" },
    { key: "Block Reward", value: `${stats.blockReward} coins` },
    { key: "Block Count", value: stats.blockCount },
    { key: "Bitcoin Difficulty", value: formatDifficulty(stats.difficulty) },
    {
      key: "Difficulty Retarget",
      value: `${stats.difficultyRetarget} blocks`,
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
                      {stats.blockCount}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b border-border/50">
                    <TableCell className="font-medium text-muted-foreground">
                      Network Hashrate
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatHashrate(stats.networkHashrate)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">
                      Bitcoin Difficulty
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatDifficulty(stats.difficulty)}
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
          formatNumber={formatDifficulty}
          opening={
            difficultyChartData.length > 0 ? difficultyChartData[0]?.y : 0
          }
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
          formatNumber={formatHashrate}
          opening={hashrateChartData.length > 0 ? hashrateChartData[0]?.y : 0}
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
          formatNumber={formatPrice}
          opening={priceChartData.length > 0 ? priceChartData[0]?.y : 0}
          loading={isPriceChartLoading}
          timeRange={priceCurrentTimerange}
          onTimeRangeChange={handlePriceTimeRangeChange}
        />
      </div>
    </div>
  );
}
