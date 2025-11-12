"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  Bitcoin,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getCmcImageUrl } from "@/lib/config";
import BitcoinNavigation from "@/components/bitcoin-navigation";
import { bitcoinAllHalvings } from "@/constants/bitcoin";
import { formatDateTime } from "@/lib/format";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Stats, Faq } from "@/types";

const HALVING_INTERVAL = 210_000;
const SECONDS_PER_DAY = 86_400;

interface BitcoinHalvingPageClientProps {
  statsData: Stats;
  faqsData: Faq[];
}

export default function BitcoinHalvingPageClient({
  statsData,
  faqsData,
}: BitcoinHalvingPageClientProps) {
  const [stats, setStats] = useState<Stats>({
    blockCount: 0,
    difficulty: 0,
    networkHashrate: 0,
    blockReward: 0,
    blockTime: 0,
    difficultyRetarget: 0,
    volume: 0,
    price: 0,
  });

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const [showAllHalvings, setShowAllHalvings] = useState(false);
  const [allHalvings] = useState(bitcoinAllHalvings);

  useEffect(() => {
    if (statsData) {
      setStats(statsData);
    }
  }, [statsData]);

  useEffect(() => {
    let raf: number;

    const tick = () => {
      const era = Math.floor(stats.blockCount / HALVING_INTERVAL);
      const nextHalving = (era + 1) * HALVING_INTERVAL;
      const blocksLeft = nextHalving - stats.blockCount;
      const totalSec = blocksLeft * (stats.blockTime || 600);

      const now = Date.now();
      const msSinceEpoch = now % ((stats.blockTime || 600) * 1_000);
      const frac = msSinceEpoch / ((stats.blockTime || 600) * 1_000);
      const remainingSec = totalSec - frac * (stats.blockTime || 600);

      const days = Math.floor(remainingSec / SECONDS_PER_DAY);
      const hours = Math.floor((remainingSec % SECONDS_PER_DAY) / 3_600);
      const minutes = Math.floor((remainingSec % 3_600) / 60);
      const seconds = Math.floor(remainingSec % 60);
      const milliseconds = Math.floor((remainingSec % 1) * 1_000);

      setCountdown({ days, hours, minutes, seconds, milliseconds });

      raf = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(raf);
  }, [stats.blockCount, stats.blockTime]);

  const currentEra = Math.floor(stats.blockCount / HALVING_INTERVAL);
  const nextHalvingBlock = (currentEra + 1) * HALVING_INTERVAL;
  const blocksInEra = stats.blockCount - currentEra * HALVING_INTERVAL;
  const progress = (blocksInEra / HALVING_INTERVAL) * 100;

  const estimatedHalvingMs =
    Date.now() +
    countdown.days * SECONDS_PER_DAY * 1_000 +
    countdown.hours * 3_600_000 +
    countdown.minutes * 60_000 +
    countdown.seconds * 1_000 +
    countdown.milliseconds;

  const estimatedHalvingDate = new Date(estimatedHalvingMs);

  const visibleHalvings = showAllHalvings
    ? allHalvings
    : allHalvings.filter((h) => h.status !== "future");

  const lastPastIndex = allHalvings.findIndex((h) => h.status === "future");
  const shownCount = lastPastIndex === -1 ? allHalvings.length : lastPastIndex;
  const hasMore = allHalvings.length > shownCount;

  const breadcrumbs = [
    { name: "Home", href: "/mining" },
    { name: "Bitcoin Halving", href: "/bitcoin-halving" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <BitcoinNavigation />

        {/* Page Header */}
        <div className="w-full mb-4 sm:mb-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex flex-col">
              <div className="flex items-center mb-3 sm:mb-4 gap-3 sm:gap-4">
                <img
                  src={getCmcImageUrl(1)}
                  alt="Bitcoin"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded flex-shrink-0"
                />
                <h1 className="text-2xl sm:text-3xl font-bold animate-fade-in">
                  Bitcoin Halving Countdown
                </h1>
              </div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl pl-11 sm:pl-14 text-muted-foreground leading-relaxed">
                Live countdown to the next Bitcoin halving event
              </p>
            </div>
            <Badge
              variant="secondary"
              className="self-start text-xs sm:text-sm whitespace-nowrap"
            >
              Updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>

        {/* Live Countdown */}
        <Card className="mb-8 sm:mb-10 lg:mb-12 animate-slide-in-from-bottom">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-bitcoin" />
              Next Halving Countdown
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Estimated time until block {nextHalvingBlock.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-5 sm:mb-6">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Minutes", value: countdown.minutes },
                { label: "Seconds", value: countdown.seconds },
                {
                  label: "MS",
                  value:
                    String(countdown.milliseconds)
                      .padStart(3, "0")
                      .slice(0, 2) + "0",
                },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-bitcoin font-mono">
                    {String(item.value).padStart(
                      item.label === "MS" ? 3 : 2,
                      "0"
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Era {currentEra + 1} Progress</span>
                <span className="font-mono">
                  {blocksInEra.toLocaleString()} / 210,000
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-center text-xs sm:text-sm text-muted-foreground">
                {progress.toFixed(2)}% complete •{" "}
                {nextHalvingBlock - stats.blockCount} blocks remaining
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2024 Halving Summary */}
        <Card className="mb-8 sm:mb-10 lg:mb-12 animate-slide-in-from-bottom animation-delay-200">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              Bitcoin Halving 2024
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Completed on April 20, 2024
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 text-center">
            <div className="flex items-center justify-center gap-6 sm:gap-8 text-center py-4">
              <div>
                <p className="text-xl sm:text-2xl font-bold">6.25 BTC</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Previous Reward
                </p>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-bitcoin">
                →
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-bitcoin">
                  3.125 BTC
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  New Reward
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3">
              Occurred at block <strong>840,000</strong> — Reward halved from
              6.25 to 3.125 BTC
            </p>
          </CardContent>
        </Card>

        {/* 2028 Prediction */}
        <Card className="mb-8 sm:mb-10 lg:mb-12 animate-slide-in-from-bottom animation-delay-300">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-bitcoin" />
              Next Halving Prediction (2028)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="bg-muted/50 p-4 sm:p-6 rounded-lg text-center mb-5 sm:mb-6">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Estimated Date
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {estimatedHalvingDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Block {nextHalvingBlock.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center text-xs sm:text-sm">
              <div>
                <p className="font-mono text-base sm:text-lg">
                  ~{(stats.blockTime / 60).toFixed(1)} min
                </p>
                <p className="text-muted-foreground">Avg Block Time</p>
              </div>
              <div>
                <p className="font-mono text-base sm:text-lg">3.125 → 1.5625</p>
                <p className="text-muted-foreground">Next Reward</p>
              </div>
              <div>
                <p className="font-mono text-base sm:text-lg">
                  Era {currentEra + 2}
                </p>
                <p className="text-muted-foreground">Halving Cycle</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Halving Dates Table */}
        {/* All Halving Dates Table */}
        <Card className="mb-8 sm:mb-10 lg:mb-12 animate-slide-in-from-bottom animation-delay-400">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-bitcoin" />
              Bitcoin Halving History
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              All past and future halving events
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {/* Scrollable area – stays INSIDE the card */}
            <div className="overflow-x-auto">
              <div className="px-4 sm:px-6">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                        Halving
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                        Year
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                        Block Height
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                        Reward
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                        Date
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {visibleHalvings.map((h) => (
                      <TableRow
                        key={h.era}
                        className={h.status === "present" ? "bg-muted/50" : ""}
                      >
                        <TableCell className="font-medium text-xs sm:text-sm whitespace-nowrap">
                          {h.era === 0 ? "Genesis" : `Halving ${h.era}`}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                          {h.year}
                        </TableCell>
                        <TableCell className="font-mono text-xs sm:text-sm whitespace-nowrap">
                          {h.height === 0 ? "0" : h.height.toLocaleString()}
                          {h.height === 0 && " (Genesis)"}
                        </TableCell>
                        <TableCell className="font-mono text-xs sm:text-sm whitespace-nowrap">
                          {h.reward.toFixed(8)} BTC
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                          {h.date ? formatDateTime(h.date) : "Estimated"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {h.status === "past" && (
                            <Badge
                              variant="outline"
                              className="text-green-600 text-xs"
                            >
                              Completed
                            </Badge>
                          )}
                          {h.status === "present" && (
                            <Badge className="bg-bitcoin text-white text-xs">
                              Upcoming
                            </Badge>
                          )}
                          {h.status === "future" && (
                            <Badge variant="secondary" className="text-xs">
                              Future
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* View All Button */}
            {hasMore && (
              <div className="px-4 sm:px-6 pb-4 pt-2 border-t">
                <Button
                  variant="ghost"
                  className="w-full text-xs sm:text-sm"
                  onClick={() => setShowAllHalvings(!showAllHalvings)}
                >
                  {showAllHalvings ? (
                    <>Collapse Future Halvings</>
                  ) : (
                    <>
                      View All Halvings ({allHalvings.length - shownCount}{" "}
                      future)
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Halving Reward Chart */}
        <Card className="mb-8 sm:mb-10 lg:mb-12 animate-slide-in-from-bottom animation-delay-500">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">
              Bitcoin Reward Halving Chart
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Visual representation of block reward reduction over time
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3 sm:space-y-4">
              {allHalvings
                .filter((h) => h.status === "past" || h.status === "present")
                .map((h) => {
                  const maxReward = 50;
                  const barWidth = (h.reward / maxReward) * 100;
                  const isCurrent = h.status === "present";

                  return (
                    <div
                      key={h.era}
                      className="flex items-center gap-3 sm:gap-4"
                    >
                      <div className="w-16 sm:w-20 text-right font-mono text-xs sm:text-sm">
                        {h.reward} BTC
                      </div>
                      <div className="flex-1 relative h-10 sm:h-12 bg-muted/20 rounded overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 h-full rounded transition-all ${
                            isCurrent ? "bg-orange-400" : "bg-bitcoin"
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center px-2">
                          <span className="text-xs sm:text-sm font-medium text-white drop-shadow truncate">
                            {h.era === 0 ? "2009 Genesis" : `Halving ${h.year}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <p className="text-center mt-5 sm:mt-6 text-xs sm:text-sm text-muted-foreground">
              Current Block: {stats.blockCount.toLocaleString()} • Era{" "}
              {currentEra + 1}
            </p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-8 sm:mb-10 lg:mb-12 animate-slide-in-from-bottom animation-delay-600">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">
              Bitcoin Halving Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Accordion
              type="multiple"
              defaultValue={faqsData.map((_, index) => `item-${index}`)}
              className="w-full"
            >
              {faqsData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-sm sm:text-base lg:text-lg text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-muted-foreground">
                      {faq.answer.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
