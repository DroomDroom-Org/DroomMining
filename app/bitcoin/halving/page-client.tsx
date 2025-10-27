"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getCmcImageUrl } from "@/lib/config";
import BitcoinNavigation from "@/components/bitcoin-navigation";
import { bitcoinHalvingFaqs, bitcoinAllHalvings } from "@/lib/constant";
import { formatDateTime } from "@/lib/format";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BitcoinStats } from "@/types";

const HALVING_INTERVAL = 210_000;

interface BitcoinHalvingPageClientProps {
  statsData: BitcoinStats;
}

export default function BitcoinHalvingPageClient({
  statsData,
}: BitcoinHalvingPageClientProps) {
  const [stats] = useState<BitcoinStats>(statsData);
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
    let raf: number;

    const tick = () => {
      const era = Math.floor(stats.blockCount / HALVING_INTERVAL);
      const nextHalving = (era + 1) * HALVING_INTERVAL;
      const blocksLeft = nextHalving - stats.blockCount;

      const totalSec = blocksLeft * stats.blockTime;

      const now = Date.now();
      const msSinceEpoch = now % (stats.blockTime * 1_000);
      const frac = msSinceEpoch / (stats.blockTime * 1_000);
      const remainingSec = totalSec - frac * stats.blockTime;

      const days = Math.floor(remainingSec / 86_400);
      const hours = Math.floor((remainingSec % 86_400) / 3_600);
      const minutes = Math.floor((remainingSec % 3_600) / 60);
      const seconds = Math.floor(remainingSec % 60);
      const milliseconds = Math.floor((remainingSec % 1) * 1_000);

      setCountdown({ days, hours, minutes, seconds, milliseconds });

      raf = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(raf);
  }, [stats]);

  const currentEra = Math.floor(stats.blockCount / HALVING_INTERVAL);
  const nextHalvingBlock = (currentEra + 1) * HALVING_INTERVAL;
  const blocksInEra = stats.blockCount - currentEra * HALVING_INTERVAL;
  const progress = (blocksInEra / HALVING_INTERVAL) * 100;

  const estimatedHalvingMs =
    Date.now() + countdown.days * 86_400_000 +
    countdown.hours * 3_600_000 +
    countdown.minutes * 60_000 +
    countdown.seconds * 1_000 +
    countdown.milliseconds;

  const estimatedHalvingDate = new Date(estimatedHalvingMs);

  const visibleHalvings = showAllHalvings
    ? allHalvings
    : allHalvings.filter((h) => h.status !== "future");

  const lastPresentIndex = allHalvings.findIndex((h) => h.status === "future");
  const shownCount =
    lastPresentIndex === -1 ? allHalvings.length : lastPresentIndex;
  const hasMore = allHalvings.length > shownCount;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4">
        <BitcoinNavigation />

        {/* Header */}
        <div className="w-full mb-4 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={getCmcImageUrl(1)}
              alt="Bitcoin Logo"
              className="w-10 h-10 rounded"
            />
            <h1 className="font-bold animate-fade-in text-3xl md:text-4xl">
              Bitcoin Halving Countdown
            </h1>
          </div>
          <p className="text-xl pl-14 text-muted-foreground">
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
                  value:
                    String(countdown.milliseconds)
                      .padStart(3, "0")
                      .slice(0, 2) + "0",
                },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-bitcoin">
                    {String(item.value).padStart(
                      item.label === "MILLI" ? 3 : 2,
                      "0"
                    )}
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
              <Progress value={progress} className="h-3 max-w-md mx-auto" />
              <p className="text-sm text-muted-foreground">
                {progress.toFixed(2)}% Complete • {blocksInEra.toLocaleString()}{" "}
                / 210,000
              </p>
              <p className="text-sm">
                Next Bitcoin Halving at Block{" "}
                {nextHalvingBlock.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {nextHalvingBlock - stats.blockCount} Bitcoin blocks until the
                next BTC Halving Date
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2024 Halving Summary */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
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
              The Bitcoin halving event completed successfully at block
              840,000 on April 20, 2024
            </p>
          </CardContent>
        </Card>

        {/* 2028 Prediction */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Bitcoin Halving 2028
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              Bitcoin halving 2028 date prediction for the next Bitcoin halving
              at block {nextHalvingBlock.toLocaleString()}. It is estimated to
              occur in approximately **{countdown.days} days** on{" "}
              <strong>{estimatedHalvingDate.toLocaleDateString()}</strong>.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Predicted BTC Halving 2028 date
              </p>
              <p className="text-xl font-bold">
                {estimatedHalvingDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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
              <TrendingUp className="h-5 w-5" />
              Bitcoin Halving History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[10%]">Halving</TableHead>
                  <TableHead className="w-[15%]">Year</TableHead>
                  <TableHead className="w-[25%]">Block Height</TableHead>
                  <TableHead className="w-[25%]">Block Reward</TableHead>
                  <TableHead className="w-[25%]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleHalvings.map((h, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      {h.era === 0 ? "" : h.era}
                    </TableCell>
                    <TableCell>{h.year}</TableCell>
                    <TableCell className="text-sm">
                      {h.height.toLocaleString()}
                      {h.height === 0 && " (Genesis)"}
                    </TableCell>
                    <TableCell>{h.reward.toFixed(8)} BTC</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">
                          {h.date && formatDateTime(h.date)}
                        </span>
                        {h.status === "present" && (
                          <Badge className="bg-bitcoin text-white text-xs">
                            PROJECTED
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {hasMore && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllHalvings(!showAllHalvings)}
                  className="inline-flex items-center gap-2 border-bitcoin/20 text-bitcoin hover:bg-bitcoin/5 hover:text-bitcoin"
                >
                  {showAllHalvings ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      All Bitcoin Halving Dates (
                      {allHalvings.length - shownCount} more)
                    </>
                  )}
                </Button>
              </div>
            )}
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
              {allHalvings
                .filter((h) => h.status === "past" || h.status === "present")
                .map((h, idx) => {
                  const maxReward = 50;
                  const barWidth = (h.reward / maxReward) * 100;
                  const isPresent = h.status === "present";
                  const label =
                    h.era === 0 ? "Genesis 2009" : `Halving ${h.year}`;

                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-24 text-right font-mono text-sm text-foreground">
                        {h.reward} BTC
                      </div>

                      <div className="flex-1 relative h-12 bg-muted/20 rounded overflow-hidden">
                        <div
                          className={`
                            absolute inset-y-0 left-0 h-full rounded transition-all duration-700 ease-out
                            ${isPresent ? "bg-orange-300" : "bg-bitcoin"}
                            ${isPresent ? "ring-2 ring-bitcoin/50" : ""}
                          `}
                          style={{ width: `${barWidth}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className={`
                              text-sm font-medium
                              ${isPresent ? "drop-shadow-md" : "text-foreground"}
                            `}
                          >
                            {label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              NOW Block: {stats.blockCount.toLocaleString()} • Halving Cycle:{" "}
              {progress.toFixed(2)}% • {blocksInEra.toLocaleString()} / 210,000
            </p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>
              Bitcoin Halving Meaning & FAQs (Frequently Asked Questions)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {bitcoinHalvingFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
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