"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bitcoin, Clock, Calendar, TrendingUp } from "lucide-react";
import { getCmcImageUrl } from "@/lib/config";
import BitcoinNavigation from "@/components/bitcoin-navigation";

interface HalvingData {
  blockHeight: number;
  blockReward: number;
  blockTime: number; // seconds
}

const HALVING_INTERVAL = 210000;

export default function BitcoinHalvingPage() {
  const [data, setData] = useState<HalvingData>({
    blockHeight: 920548,
    blockReward: 3.125,
    blockTime: 589,
  });
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch live data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/bitcoin/stats");
        const apiData = await res.json();
        setData((prev) => ({
          ...prev,
          blockHeight: apiData.blockHeight ?? prev.blockHeight,
          blockReward: apiData.blockReward ?? prev.blockReward,
          blockTime: apiData.blockTime ?? prev.blockTime,
        }));
      } catch (err) {
        console.error("Failed to fetch halving data");
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate countdown
  useEffect(() => {
    const calculateCountdown = () => {
      const currentEra = Math.floor(data.blockHeight / HALVING_INTERVAL);
      const nextHalvingBlock = (currentEra + 1) * HALVING_INTERVAL;
      const blocksRemaining = nextHalvingBlock - data.blockHeight;
      const secondsRemaining = blocksRemaining * data.blockTime;

      const days = Math.floor(secondsRemaining / 86400);
      const hours = Math.floor((secondsRemaining % 86400) / 3600);
      const minutes = Math.floor((secondsRemaining % 3600) / 60);
      const seconds = Math.floor(secondsRemaining % 60);

      setCountdown({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data.blockHeight, data.blockTime]);

  const currentEra = Math.floor(data.blockHeight / HALVING_INTERVAL);
  const nextHalvingBlock = (currentEra + 1) * HALVING_INTERVAL;
  const blocksInEra = data.blockHeight - currentEra * HALVING_INTERVAL;
  const progress = (blocksInEra / HALVING_INTERVAL) * 100;

  const halvings = [
    {
      era: 0,
      height: 0,
      reward: 50,
      date: "January 3, 2009 6:15:05 PM UTC",
      projected: false,
    },
    {
      era: 1,
      height: 210000,
      reward: 25,
      date: "November 28, 2012 03:24:38 PM UTC",
      projected: false,
    },
    {
      era: 2,
      height: 420000,
      reward: 12.5,
      date: "July 9, 2016 4:46:13 PM UTC",
      projected: false,
    },
    {
      era: 3,
      height: 630000,
      reward: 6.25,
      date: "May 11, 2020 7:23:43 PM UTC",
      projected: false,
    },
    {
      era: 4,
      height: 840000,
      reward: 3.125,
      date: "April 20, 2024",
      projected: false,
    },
    {
      era: 5,
      height: 1050000,
      reward: 1.5625,
      date: "Mar 24, 2028 11:42:02 PM UTC (PROJECTED)",
      projected: true,
    },
  ];

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
            <h1 className="font-bold animate-fade-in">
              Bitcoin Halving Countdown
            </h1>
          </div>
          <p className="text-xl pl-14">
            BTC Halving Countdown showing Days until the Next Bitcoin Halving
            Date.
          </p>
        </div>

        {/* Live Countdown */}
        <Card className="mb-12 animate-fade-in">
          <CardContent className="pt-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: "DAYS", value: countdown.days },
                { label: "HOURS", value: countdown.hours },
                { label: "MINUTES", value: countdown.minutes },
                { label: "SECONDS", value: countdown.seconds },
                {
                  label: "MILLI",
                  value: Math.floor((Date.now() % 1000) / 100) * 100,
                },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-bitcoin">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">
                Bitcoin Halving Cycle {currentEra + 1} - 210,000 Blocks
              </p>
              <Progress value={progress} className="h-3 max-w-md mx-auto " />
              <p className="text-sm text-muted-foreground">
                {progress.toFixed(2)}% Complete • {blocksInEra.toLocaleString()}{" "}
                / 210,000
              </p>
              <p className="text-sm">
                Next Bitcoin Halving at Block{" "}
                {nextHalvingBlock.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {nextHalvingBlock - data.blockHeight} Bitcoin blocks until the
                next BTC Halving Date
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2024 Halving Summary */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-bitcoin" />
              Bitcoin Halving 2024 Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <p className="text-2xl font-bold">6.25 BTC</p>
                <p className="text-sm text-muted-foreground">
                  Previous Block Reward
                </p>
              </div>
              <div className="text-3xl">→</div>
              <div>
                <p className="text-2xl font-bold text-bitcoin">3.125 BTC</p>
                <p className="text-sm text-muted-foreground">
                  New Block Reward
                </p>
              </div>
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              The Bitcoin halving event completed successfully at block 840,000
              on April 20, 2024
            </p>
          </CardContent>
        </Card>

        {/* 2028 Prediction */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-bitcoin" />
              Bitcoin Halving 2028
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              Bitcoin halving 2028 date prediction for the next Bitcoin halving
              date at block {nextHalvingBlock.toLocaleString()}. Halving 2028 is
              estimated to occur in {countdown.days} days sometime on March 24,
              2028.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                BTC Halving 2028 date is predicted to transpire on
              </p>
              <p className="text-xl font-bold">
                Friday Mar 24, 2028 at 11:42:02 PM UTC
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div>
                <p className="text-2xl font-bold">Mar 10</p>
                <p className="text-xs text-muted-foreground">579 s</p>
              </div>
              <div>
                <p className="text-2xl font-bold">Mar 24</p>
                <p className="text-xs text-muted-foreground">589 s</p>
              </div>
              <div>
                <p className="text-2xl font-bold">Apr 08</p>
                <p className="text-xs text-muted-foreground">599 s</p>
              </div>
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              BITCOIN BLOCK TIME
            </p>
          </CardContent>
        </Card>

        {/* All Halving Dates Table */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-bitcoin" />
              All Bitcoin Halving Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Halving</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Block Height</TableHead>
                    <TableHead>Block Reward</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {halvings.map((h, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{h.era === 0 ? "" : h.era}</TableCell>
                      <TableCell>
                        {h.era === 0 ? "" : new Date(h.date).getFullYear()}
                      </TableCell>
                      <TableCell className="font-mono">
                        {h.height.toLocaleString()}
                        {h.projected && (
                          <Badge className="ml-2 bg-bitcoin text-white text-xs">
                            PROJECTED
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{h.reward.toFixed(8)} BTC</TableCell>
                      <TableCell className="text-sm">
                        {h.date.split("(")[0].trim()}
                        {h.projected && (
                          <span className="text-muted-foreground">
                            {" "}
                            (PROJECTED)
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Halving Chart */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Bitcoin Halving Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Bitcoin halving cycle is a pre-programmed, algorithmic reduction
              in BTC rewards. The mining rewards given to Bitcoin miners is cut
              in half every 210,000 blocks or approximately every four years.
            </p>
            <div className="space-y-4">
              {halvings.slice(0, 6).map((h, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-24 text-right font-mono text-sm">
                    {h.reward} BTC
                  </div>
                  <div className="flex-1 h-12 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {h.era === 0
                        ? "Genesis 2009"
                        : `Halving ${
                            h.date.split(" ")[3] || h.date.split(" ")[0]
                          }`}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4">
                <div className="w-24 text-right font-mono text-sm">
                  1.5625 BTC
                </div>
                <div className="flex-1 h-12 bg-bitcoin rounded flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    Halving 2028
                  </span>
                </div>
              </div>
            </div>
            <p className="text-center mt-6 text-sm text-muted-foreground">
              NOW Block: {data.blockHeight.toLocaleString()} • Halving Cycle:{" "}
              {progress.toFixed(2)}% • {blocksInEra.toLocaleString()} / 210,000
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
