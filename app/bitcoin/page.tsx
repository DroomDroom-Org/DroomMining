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
import BitcoinPriceChart from "@/components/bitcoin-price-chart";

export default function BitcoinMiningPage() {
  const {
    chartData,
    isChartLoading,
    chartTimeRange,
    setChartTimeRange,
    fetchChart,
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

  const difficultyChartData = Array.from({ length: 30 }, (_, i) => ({
    date: `${i} days ago`,
    value: 146000000000000 + Math.random() * 10000000000000,
  }));

  const hashrateChartData = Array.from({ length: 30 }, (_, i) => ({
    date: `${i} days ago`,
    value: 1000000 + Math.random() * 50000,
  }));

  const priceChartData = Array.from({ length: 30 }, (_, i) => ({
    date: `${i} days ago`,
    value: 110000 + Math.random() * 2000,
  }));

  // useEffect(() => {
  //   // Fetch from your API: /api/bitcoin/stats
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch("/api/bitcoin/stats");
  //       const data = await res.json();
  //       setLiveData((prev) => ({ ...prev, ...data }));
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  //   const interval = setInterval(fetchData, 300000); // 5 min
  //   return () => clearInterval(interval);
  // }, []);

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
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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

  const handleTimeRangeChange = (newTimeRange: string) => {
    setChartTimeRange(newTimeRange);
    fetchChart(newTimeRange);
  };

  console.log("Chart Data", chartData);

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
            <Button asChild size="lg" className="interactive-element">
              <Link href="/bitcoin/calculator">
                <Calculator className="mr-2 h-4 w-4" />
                Bitcoin Mining Calculator
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Difficulty Chart */}
        <Card className="mb-12 animate-slide-in-from-bottom animation-delay-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Bitcoin Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={difficultyChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={liveData ? "#f0f0f0" : "#333"}
                  />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hashrate Chart */}
        <Card className="mb-12 animate-slide-in-from-bottom animation-delay-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Bitcoin Hashrate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hashrateChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={liveData ? "#f0f0f0" : "#333"}
                  />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Price and Exchange Rate */}
        <Card className="mb-12 animate-slide-in-from-bottom animation-delay-800">
          <div className="flex justify-between space-y-1.5 p-6">
            <div className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
              <TrendingUp className="h-5 w-5" />
              Bitcoin Price Chart
            </div>
            <div className="flex justify-end items-center">
              <div className="flex gap-1 items-center md:overflow-x-auto md:pb-0 md:scrollbar-none">
                <div className="flex gap-2 items-center text-muted-foreground md:gap-3 md:w-auto md:justify-start">
                  {chartTimeRanges.map((range) => (
                    <button
                      key={range.value}
                      className={`px-2 py-1.5 text-xs min-w-[36px] text-center font-medium rounded cursor-pointer transition-all duration-200 md:px-3 md:min-w-[32px] md:text-[13px] ${
                        chartTimeRange === range.value
                          ? `bg-muted dark:text-white text-black md:font-semibold`
                          : `bg-transparent dark:text-gray-400 text-gray-600 md:font-normal`
                      }`}
                      onClick={() => handleTimeRangeChange(range.value)}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <CardContent>
            <BitcoinPriceChart
              chartData={chartData}
              openingPrice={chartData[0]?.price}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
