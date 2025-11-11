"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  DollarSign,
  Clock,
  TrendingUp,
  Settings,
  Calculator as CalculatorIcon,
  ChevronRight,
  ChevronsDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCmcImageUrl } from "@/lib/config";
import LitecoinNavigation from "@/components/litecoin-navigation";
import { Stats, Calculator, Faq } from "@/types";
import { formatDifficulty, formatHashrate } from "@/lib/format";
import { litecoinCalculatorFaqs } from "@/constants/litecoin";
import Breadcrumbs from "@/components/breadcrumbs";

interface LitecoinCalculatorPageClientProps {
  statsData: Stats;
  faqsData: Faq[];
}

const unitMultipliers: Record<string, number> = {
  "KH/s": 1e3,
  "MH/s": 1e6,
  "GH/s": 1e9,
};

const toHashrate = (value: number, unit: string): number =>
  value * (unitMultipliers[unit] ?? 1e12);
const fromHashrate = (hashrate: number, unit: string): number =>
  hashrate / (unitMultipliers[unit] ?? 1e12);

export default function LitecoinCalculatorPageClient({
  statsData,
  faqsData,
}: LitecoinCalculatorPageClientProps) {
  const [state, setState] = useState<Calculator>({
    hashrate: 170_000_000,
    hashrateValue: 170_000_000,
    hashrateUnit: "KH/s",
    power: 3450,
    electricityCost: 0.1,
    poolFee: 1,
  });

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (statsData) setStats(statsData);
  }, [statsData]);

  useEffect(() => {
    if (stats.networkHashrate) calculateProfit();
  }, [stats]);

  const calculateProfit = () => {
    setLoading(true);

    const { hashrate, power, electricityCost, poolFee } = state;

    const ltcPrice = stats.price;
    const blockReward = stats.blockReward;
    const avgBlockTime = stats.blockTime;
    const networkHashrate = stats.networkHashrate;

    const ltcPerSecond =
      (hashrate / networkHashrate) * (blockReward / avgBlockTime);

    const secondsPerDay = 86400;
    const ltcPerDay = ltcPerSecond * secondsPerDay;
    const revenuePerDay = ltcPerDay * ltcPrice;

    const kwhPerDay = (power * 24) / 1000;
    const electricityCostPerDay = kwhPerDay * electricityCost;

    const poolFeePerDay = revenuePerDay * (poolFee / 100);

    const profitPerDay = revenuePerDay - electricityCostPerDay - poolFeePerDay;

    const minerCost = 2629;
    const roiDays =
      minerCost > 0 && profitPerDay > 0 ? minerCost / profitPerDay : Infinity;

    const daysTo1Ltc = ltcPerDay > 0 ? 1 / ltcPerDay : Infinity;

    const profitMargin =
      revenuePerDay > 0
        ? ((profitPerDay / revenuePerDay) * 100).toFixed(2)
        : "0.00";

    setResults({
      ltcPerDay: Number(ltcPerDay.toFixed(10)),
      revenuePerDay: Number(revenuePerDay.toFixed(2)),
      elecPerDay: Number(electricityCostPerDay.toFixed(2)),
      feesPerDay: Number(poolFeePerDay.toFixed(2)),
      profitPerDay: Number(profitPerDay.toFixed(2)),
      roiDays: isFinite(roiDays) ? Number(roiDays.toFixed(1)) : Infinity,
      daysTo1Ltc: isFinite(daysTo1Ltc)
        ? Number(daysTo1Ltc.toFixed(1))
        : Infinity,
      profitMargin,
      ltcPerHour: Number((ltcPerDay / 24).toFixed(10)),
    });

    setTimeout(() => setLoading(false), 300);
  };

  const per = (field: keyof typeof results, hours: number) =>
    results ? results[field] * (hours / 24) : 0;
  const ltcPerPeriod = (h: number) => per("ltcPerDay", h);
  const revenuePerPeriod = (h: number) => per("revenuePerDay", h);
  const costPerPeriod = (h: number) => per("elecPerDay", h);
  const feesPerPeriod = (h: number) => per("feesPerDay", h);
  const profitPerPeriod = (h: number) => per("profitPerDay", h);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Litecoin Mining Calculator", href: "/litecoin/calculator" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4">
        <LitecoinNavigation />

        {/* Page Header */}
        <div className="w-full mb-4 pt-6">
          <div className="w-full flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Breadcrumbs items={breadcrumbs} className="text-litecoin" />
          </div>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center mb-4 gap-4">
                <img
                  src={getCmcImageUrl(2)}
                  alt="Litecoin"
                  className="w-10 h-10 rounded"
                />
                <h1 className="text-3xl font-bold">
                  Litecoin Mining Calculator
                </h1>
              </div>
              <p className="text-xl pl-14 text-muted-foreground">
                Calculate LTC mining profitability in real time
              </p>
            </div>
            <Badge variant="secondary" className="self-start">
              Updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>

        {/* Upper Calculator + Summary Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalculatorIcon className="h-5 w-5" />
              LTC Mining Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Inputs */}
              <div className="space-y-6">
                {/* Hashrate */}
                <div className="space-y-2">
                  <Label htmlFor="hashrate">Hashrate</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hashrate"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 390"
                      value={state.hashrateValue}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setState((s) => ({
                          ...s,
                          hashrateValue: val,
                          hashrate: toHashrate(val, s.hashrateUnit),
                        }));
                      }}
                      className="flex-1"
                    />
                    <Select
                      value={state.hashrateUnit}
                      onValueChange={(newUnit) => {
                        const displayed = fromHashrate(state.hashrate, newUnit);
                        setState((s) => ({
                          ...s,
                          hashrateUnit: newUnit,
                          hashrateValue: displayed,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(unitMultipliers).map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatHashrate(state.hashrate)} H/s
                  </p>
                </div>

                {/* Power */}
                <div className="space-y-2">
                  <Label htmlFor="power">Power Consumption (W)</Label>
                  <Input
                    id="power"
                    type="number"
                    placeholder="e.g. 7215"
                    value={state.power}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        power: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                {/* Electricity */}
                <div className="space-y-2">
                  <Label htmlFor="elec-cost">Electricity Cost ($/kWh)</Label>
                  <Input
                    id="elec-cost"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 0.05"
                    value={state.electricityCost}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        electricityCost: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                {/* Pool Fee */}
                <div className="space-y-2">
                  <Label htmlFor="pool-fee">Pool Fee (%)</Label>
                  <Input
                    id="pool-fee"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 1"
                    value={state.poolFee}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        poolFee: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <Button
                  onClick={calculateProfit}
                  className="w-full bg-litecoin hover:bg-litecoin/90 text-white"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Calculate Profit
                    </>
                  )}
                </Button>
              </div>

              {/* Right: Live Stats + Summary */}
              <div className="flex flex-col justify-start space-y-4 min-h-full">
                <div className="border-b pb-2">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    Live LTC Stats
                  </div>
                  <div className="space-y-3 text-sm mt-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold">
                        ${stats.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty</span>
                      <span className="font-semibold">
                        {formatDifficulty(stats.difficulty)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Block Reward
                      </span>
                      <span className="font-semibold">
                        {stats.blockReward} LTC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Network Hashrate
                      </span>
                      <span className="font-semibold">
                        {formatHashrate(stats.networkHashrate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Block Height
                      </span>
                      <span className="font-semibold">
                        {stats.blockCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-lg">Mining Summary</h3>
                <div className="flex-1 grid gap-3 content-start">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Mining Revenue
                    </span>
                    <span className="font-medium">
                      ${results ? results.revenuePerDay.toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mining Fees</span>
                    <span className="font-medium">
                      ${results ? results.feesPerDay.toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Electricity Costs
                    </span>
                    <span className="font-medium">
                      ${results ? results.elecPerDay.toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Litecoin mined per hour
                    </span>
                    <span className="font-medium">
                      {results ? results.ltcPerHour.toFixed(8) : "0.00000000"}{" "}
                      LTC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Litecoin mined per day
                    </span>
                    <span className="font-medium">
                      {results ? results.ltcPerDay.toFixed(8) : "0.00000000"}{" "}
                      LTC
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">
                      Litecoin mining profit per day
                    </span>
                    <span className="font-semibold text-green-600">
                      ${results ? results.profitPerDay.toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forecast Table */}
        {results && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Mining Reward Forecast</CardTitle>
              <CardDescription>Projected earnings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>LTC</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Power Cost</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { label: "Hourly", h: 1 },
                    { label: "Daily", h: 24 },
                    { label: "Weekly", h: 168 },
                    { label: "Monthly", h: 730 },
                    { label: "Yearly", h: 8760 },
                  ].map((p) => (
                    <TableRow key={p.label}>
                      <TableCell>{p.label}</TableCell>
                      <TableCell>{ltcPerPeriod(p.h).toFixed(8)}</TableCell>
                      <TableCell>${revenuePerPeriod(p.h).toFixed(2)}</TableCell>
                      <TableCell>${costPerPeriod(p.h).toFixed(2)}</TableCell>
                      <TableCell>${feesPerPeriod(p.h).toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">
                        ${profitPerPeriod(p.h).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* KPI Cards – fixed keys */}
        {results && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  +{results.profitMargin}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5" /> Days to 1 LTC
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold">
                  {results.daysTo1Ltc.toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5" /> ROI (Days)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold">
                  {results.roiDays === Infinity
                    ? "Never"
                    : results.roiDays.toFixed(1)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ */}
        <Card className="mt-8 mb-12">
          <CardHeader>
            <CardTitle>Litecoin Mining Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="multiple"
              defaultValue={faqsData.map((_, index) => `item-${index}`)}
              className="w-full"
            >
              {faqsData.map((faq, index) => (
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
