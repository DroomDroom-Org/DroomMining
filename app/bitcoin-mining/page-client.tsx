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
import { ChartDataPoint, Stats } from "@/types";
import { formatDifficulty, formatPrice, formatHashrate } from "@/lib/format";
import Breadcrumbs from "@/components/breadcrumbs";
import CompoundCustomLink from "@/components/custom-link";

interface BitcoinHomePageClientProps {
  statsData: Stats;
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
    price: 0,
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
        price: statsData.price,
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
        <CompoundCustomLink
          href="https://bitcoin.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline inline-flex items-center gap-1 break-all"
        >
          <span>bitcoin.org</span>
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        </CompoundCustomLink>
      ),
    },
    {
      key: "Github / Source Code",
      value: (
        <CompoundCustomLink
          href="https://github.com/bitcoin/bitcoin"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>Github</span>
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        </CompoundCustomLink>
      ),
    },
    {
      key: "Forum",
      value: (
        <CompoundCustomLink
          href="https://bitcointalk.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>Bitcointalk</span>
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        </CompoundCustomLink>
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

  const breadcrumbs = [
    { name: "Home", href: "/mining" },
    { name: "Bitcoin Mining", href: "/bitcoin-mining" },
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
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <BitcoinNavigation />

        {/* Page Header */}
        <div className="w-full mb-4 sm:mb-6 pt-6">
          <div className="w-full flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Breadcrumbs items={breadcrumbs} className="text-bitcoin" />
          </div>
          <div className="w-full flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <img
              src={getCmcImageUrl(1)}
              alt="Bitcoin Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded flex-shrink-0"
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold animate-fade-in">
              Bitcoin Mining
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl pl-11 sm:pl-14 text-muted-foreground leading-relaxed">
            Bitcoin mining information - including a Bitcoin mining calculator,
            a list of Bitcoin mining hardware, Bitcoin difficulty with
            historical charts, Bitcoin hashrate charts, as well as the current
            Bitcoin price.
          </p>
        </div>

        {/* Basic Info Table */}
        <Card className="mb-8 sm:mb-10 lg:mb-12 animate-slide-in-from-bottom">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
              Bitcoin Information
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableBody>
                  {basicInfo.map((item, idx) => (
                    <TableRow key={idx} className="border-b border-border/50">
                      <TableCell className="font-medium text-muted-foreground w-[40%] sm:w-1/2 text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4">
                        {item.key}
                      </TableCell>
                      <TableCell className="font-semibold text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4 break-words">
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
        <Card className="mb-8 sm:mb-10 lg:mb-12 animate-slide-in-from-bottom animation-delay-200">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              Bitcoin Mining Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="overflow-x-auto mb-4 sm:mb-6 -mx-4 sm:mx-0">
              <Table>
                <TableBody>
                  <TableRow className="border-b border-border/50">
                    <TableCell className="font-medium text-muted-foreground text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4">
                      P2P Port
                    </TableCell>
                    <TableCell className="font-semibold text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4">
                      8333
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b border-border/50">
                    <TableCell className="font-medium text-muted-foreground text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4">
                      RPC Port
                    </TableCell>
                    <TableCell className="font-semibold text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4">
                      8332
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b border-border/50">
                    <TableCell className="font-medium text-muted-foreground text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4">
                      Blocks
                    </TableCell>
                    <TableCell className="font-semibold text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4">
                      {stats.blockCount}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b border-border/50">
                    <TableCell className="font-medium text-muted-foreground text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4">
                      Network Hashrate
                    </TableCell>
                    <TableCell className="font-semibold text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4 break-words">
                      {formatHashrate(stats.networkHashrate)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4">
                      Bitcoin Difficulty
                    </TableCell>
                    <TableCell className="font-semibold text-xs sm:text-sm py-3 sm:py-4 px-3 sm:px-4 break-words">
                      {formatDifficulty(stats.difficulty)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
              Calculate your Bitcoin mining profitability and daily Bitcoin
              mining rewards with our Bitcoin mining calculator
            </p>
            <Button
              asChild
              size="lg"
              className="interactive-element bg-bitcoin hover:bg-bitcoin-dark w-full sm:w-auto text-sm sm:text-base"
            >
              <CompoundCustomLink
                href="/bitcoin-mining-calculator"
                className="flex items-center justify-center"
              >
                <Calculator className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">
                  Bitcoin Mining Calculator
                </span>
                <span className="sm:hidden">Mining Calculator</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </CompoundCustomLink>
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
