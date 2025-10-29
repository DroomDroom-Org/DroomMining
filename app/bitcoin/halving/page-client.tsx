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
import { bitcoinHalvingFaqs, bitcoinAllHalvings } from "@/constants/bitcoin";
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
  const [stats, setStats] = useState<BitcoinStats>({
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
    Date.now() +
    countdown.days * 86_400_000 +
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4">
        <BitcoinNavigation />

        {/* Header */}
        <section className="pt-8">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center mb-4 gap-4">
                <img
                  src={getCmcImageUrl(1)}
                  alt="Bitcoin"
                  className="w-10 h-10 rounded"
                />
                <h1 className="text-3xl font-bold">Bitcoin Halving Countdown</h1>
              </div>
              <p className="text-xl pl-14 text-muted-foreground">
                Live countdown to the next Bitcoin halving event
              </p>
            </div>
            <Badge variant="secondary" className="self-start">
              Updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </section>

        {/* Live Countdown  */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-bitcoin" />
              Next Halving Countdown
            </CardTitle>
            <CardDescription>
              Estimated time until block {nextHalvingBlock.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Minutes", value: countdown.minutes },
                { label: "Seconds", value: countdown.seconds },
                {
                  label: "MS",
                  value: String(countdown.milliseconds).padStart(3, "0").slice(0, 2) + "0",
                },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-bitcoin">
                    {String(item.value).padStart(item.label === "MS" ? 3 : 2, "0")}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Era {currentEra + 1} Progress</span>
                <span className="font-mono">
                  {blocksInEra.toLocaleString()} / 210,000
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-center text-sm text-muted-foreground">
                {progress.toFixed(2)}% complete • {nextHalvingBlock - stats.blockCount} blocks remaining
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2024 Halving Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Bitcoin Halving 2024
            </CardTitle>
            <CardDescription>Completed on April 20, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <p className="text-2xl font-bold">6.25 BTC</p>
                <p className="text-sm text-muted-foreground">Previous Reward</p>
              </div>
              <div className="text-3xl">→</div>
              <div>
                <p className="text-2xl font-bold text-bitcoin">3.125 BTC</p>
                <p className="text-sm text-muted-foreground">New Reward</p>
              </div>
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Occurred at block <strong>840,000</strong> — Reward halved from 6.25 to 3.125 BTC
            </p>
          </CardContent>
        </Card>

        {/* 2028 Prediction */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-bitcoin" />
              Next Halving Prediction (2028)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-6 rounded-lg text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">Estimated Date</p>
              <p className="text-2xl font-bold">
                {estimatedHalvingDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Block {nextHalvingBlock.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-mono text-lg">~9.8 min</p>
                <p className="text-muted-foreground">Avg Block Time</p>
              </div>
              <div>
                <p className="font-mono text-lg">3.125 → 1.5625</p>
                <p className="text-muted-foreground">Next Reward</p>
              </div>
              <div>
                <p className="font-mono text-lg">Era {currentEra + 2}</p>
                <p className="text-muted-foreground">Halving Cycle</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Halving Dates Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-bitcoin" />
              Bitcoin Halving History
            </CardTitle>
            <CardDescription>
              All past and future halving events
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Halving</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Block Height</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleHalvings.map((h) => (
                    <TableRow
                      key={h.era}
                      className={h.status === "present" ? "bg-muted/50" : ""}
                    >
                      <TableCell className="font-medium">
                        {h.era === 0 ? "Genesis" : `Halving ${h.era}`}
                      </TableCell>
                      <TableCell>{h.year}</TableCell>
                      <TableCell className="font-mono">
                        {h.height === 0 ? "0" : h.height.toLocaleString()}
                        {h.height === 0 && " (Genesis)"}
                      </TableCell>
                      <TableCell className="font-mono">
                        {h.reward.toFixed(8)} BTC
                      </TableCell>
                      <TableCell className="text-sm">
                        {h.date ? formatDateTime(h.date) : "Estimated"}
                      </TableCell>
                      <TableCell>
                        {h.status === "past" && (
                          <Badge variant="outline" className="text-green-600">
                            Completed
                          </Badge>
                        )}
                        {h.status === "present" && (
                          <Badge className="bg-bitcoin text-white">
                            Upcoming
                          </Badge>
                        )}
                        {h.status === "future" && (
                          <Badge variant="secondary">Future</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {hasMore && (
              <div className="px-6 pb-4 pt-2">
                <Button
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => setShowAllHalvings(!showAllHalvings)}
                >
                  {showAllHalvings ? (
                    <>Collapse Future Halvings</>
                  ) : (
                    <>
                      View All Halvings ({allHalvings.length - shownCount} future)
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Halving Reward Chart */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Bitcoin Reward Halving Chart</CardTitle>
            <CardDescription>
              Visual representation of block reward reduction over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allHalvings
                .filter((h) => h.status === "past" || h.status === "present")
                .map((h) => {
                  const maxReward = 50;
                  const barWidth = (h.reward / maxReward) * 100;
                  const isCurrent = h.status === "present";

                  return (
                    <div key={h.era} className="flex items-center gap-4">
                      <div className="w-24 text-right font-mono text-sm">
                        {h.reward} BTC
                      </div>
                      <div className="flex-1 relative h-12 bg-muted/20 rounded overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 h-full rounded transition-all ${
                            isCurrent ? "bg-orange-400" : "bg-bitcoin"
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-medium text-white drop-shadow">
                            {h.era === 0 ? "2009 Genesis" : `Halving ${h.year}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Current Block: {stats.blockCount.toLocaleString()} • Era {currentEra + 1}
            </p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mt-8 mb-12">
          <CardHeader>
            <CardTitle>Bitcoin Halving FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {bitcoinHalvingFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
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