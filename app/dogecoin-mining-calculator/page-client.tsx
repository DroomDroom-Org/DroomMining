"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  DollarSign,
  Clock,
  TrendingUp,
  Settings,
  Calculator as CalculatorIcon,
  ChevronRight,
  ChevronsDown,
  CircleCheckBig,
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
import DogecoinNavigation from "@/components/dogecoin-navigation";
import { Stats, Miner, Calculator, Faq } from "@/types";
import { formatDifficulty, formatHashrate } from "@/lib/format";

interface DogecoinCalculatorPageClientProps {
  statsData: Stats;
  minersData: Miner[];
  faqsData: Faq[];
}

const unitMultipliers: Record<string, number> = {
  "H/s": 1,
  "KH/s": 1e3,
  "MH/s": 1e6,
};

const toHashrate = (value: number, unit: string): number =>
  value * (unitMultipliers[unit] ?? 1e12);
const fromHashrate = (hashrate: number, unit: string): number =>
  hashrate / (unitMultipliers[unit] ?? 1e12);

export default function DogecoinCalculatorPageClient({
  statsData,
  minersData,
  faqsData,
}: DogecoinCalculatorPageClientProps) {
  const [state, setState] = useState<Calculator>({
    hashrate: 840_000,
    hashrateValue: 840_000,
    hashrateUnit: "H/s",
    power: 2780,
    electricityCost: 0.10,
    poolFee: 1,
  });

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMiner, setSelectedMiner] = useState<Miner | null>(null);
  const [showAllMiners, setShowAllMiners] = useState(false);
  const calculatorRef = useRef<HTMLDivElement>(null);

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
    if (statsData) {
      setStats(statsData);
    }
    if (minersData) {
      setSelectedMiner(minersData[0]);
    }
  }, [statsData]);

  useEffect(() => {
    if (stats) {
      calculateProfit();
    }
  }, [stats]);

  useEffect(() => {
    if (!selectedMiner) return;
    const minerHashrate = toHashrate(
      selectedMiner.hashrateValue,
      selectedMiner.hashrateUnit
    );
    const displayed = fromHashrate(minerHashrate, state.hashrateUnit);
    setState((prev) => ({
      ...prev,
      hashrate: minerHashrate,
      hashrateValue: displayed,
      power: selectedMiner.power,
    }));
  }, [selectedMiner, state.hashrateUnit]);

  const calculateProfit = () => {
    setLoading(true);
    const { hashrate, power, electricityCost, poolFee } = state;

    const dogePrice = stats.price || 111_747;
    const blockReward = stats.blockReward || 3.125;
    const avgBlockTime = stats.blockTime || 600;

    const dogePerSecond =
      ((hashrate / stats.networkHashrate) * blockReward) / avgBlockTime;
    const secondsPerDay = 86_400;
    const dogePerDay = dogePerSecond * secondsPerDay;
    const revenuePerDay = dogePerDay * dogePrice;

    const kwhPerDay = (power * 24) / 1000;
    const electricityCostPerDay = kwhPerDay * electricityCost;
    const poolFeePerDay = revenuePerDay * (poolFee / 100);
    const profitPerDay = revenuePerDay - electricityCostPerDay - poolFeePerDay;

    const minerCost = selectedMiner?.cost ?? 0;
    const roiDays = profitPerDay > 0 ? minerCost / profitPerDay : Infinity;
    const daysTo1Doge = dogePerDay > 0 ? 1 / dogePerDay : Infinity;
    const profitMargin =
      revenuePerDay > 0 ? (profitPerDay / revenuePerDay) * 100 : 0;

    setResults({
      dogePerDay,
      revenuePerDay,
      elecPerDay: electricityCostPerDay,
      feesPerDay: poolFeePerDay,
      profitPerDay,
      roiDays: isFinite(roiDays) ? roiDays : 0,
      daysTo1Doge: isFinite(daysTo1Doge) ? daysTo1Doge : 0,
      profitMargin: profitMargin.toFixed(2),
      dogePerHour: dogePerDay / 24,
    });

    setTimeout(() => setLoading(false), 300);
  };

  const loadMiner = (miner: Miner) => {
    setSelectedMiner(miner);
    setLoading(true);

    setTimeout(() => {
      calculateProfit();

      calculatorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  const per = (field: keyof typeof results, hours: number) =>
    results ? results[field] * (hours / 24) : 0;
  const dogePerPeriod = (h: number) => per("dogePerDay", h);
  const revenuePerPeriod = (h: number) => per("revenuePerDay", h);
  const costPerPeriod = (h: number) => per("elecPerDay", h);
  const feesPerPeriod = (h: number) => per("feesPerDay", h);
  const profitPerPeriod = (h: number) => per("profitPerDay", h);

  const displayedMiners =
    showAllMiners && minersData ? minersData : minersData.slice(0, 10);

 

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <DogecoinNavigation />

        {/* Page Header */}
        <div className="w-full mb-4 sm:mb-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex flex-col">
              <div className="flex items-center mb-3 sm:mb-4 gap-3 sm:gap-4">
                <img
                  src={getCmcImageUrl(74)}
                  alt="Dogecoin"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded flex-shrink-0"
                />
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Dogecoin Mining Calculator
                </h1>
              </div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl pl-11 sm:pl-14 text-muted-foreground leading-relaxed">
                Calculate DOGE mining profitability in real time
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

        {/* STEP 1: Select Miner */}
        <div className="mt-6 sm:mt-8">
          <div className="mb-2 flex items-center gap-3">
            <CircleCheckBig className="h-6 w-6 text-dogecoin" />
            <h2 className="text-xl font-bold">Select a Miner</h2>
          </div>
          <p className="text-muted-foreground mb-2 text-sm">
            Click any miner to auto-fill hashrate, power, and estimated profit
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {displayedMiners.map((miner) => {
              const minerHashrate = toHashrate(
                miner.hashrateValue,
                miner.hashrateUnit
              );
              const isSelected = selectedMiner?.name === miner.name;

              // Pre-calculate daily profit for display
              const dogePerSecond =
                ((minerHashrate / stats.networkHashrate) * stats.blockReward) /
                (stats.blockTime || 600);
              const dogePerDay = dogePerSecond * 86400;
              const revenuePerDay = dogePerDay * (stats.price || 111747);
              const kwhPerDay = (miner.power * 24) / 1000;
              const electricityCostPerDay =
                kwhPerDay * (state.electricityCost || 0.05);
              const poolFeePerDay = revenuePerDay * (state.poolFee / 100);
              const profitPerDay =
                revenuePerDay - electricityCostPerDay - poolFeePerDay;

              return (
                <Card
                  key={miner.id}
                  onClick={() => loadMiner(miner)}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected
                      ? "ring-2 ring-dogecoin shadow-lg"
                      : "hover:ring-1 hover:ring-muted"
                  }`}
                >
                  <CardContent className="p-0">
                    {/* Thumbnail */}
                    <div className="relative h-40 sm:h-48 bg-gradient-to-br from-muted to-muted/50 rounded-t-lg overflow-hidden">
                      {miner.thumbnail ? (
                        <img
                          src={miner.thumbnail}
                          alt={miner.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Zap className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/30" />
                        </div>
                      )}
                      {isSelected && (
                        <Badge className="absolute top-2 right-2 bg-dogecoin text-white text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>

                    {/* Card Details */}
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base lg:text-lg leading-tight line-clamp-1">
                          {miner.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {miner.manufacturer}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                        <div>
                          <p className="text-muted-foreground">Hashrate</p>
                          <p className="font-semibold font-mono text-xs sm:text-sm">
                            {formatHashrate(minerHashrate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Power</p>
                          <p className="font-semibold font-mono text-xs sm:text-sm">
                            {miner.power}W
                          </p>
                        </div>
                      </div>

                      {/* Daily Profit */}
                      <div className="bg-muted/50 rounded p-2 text-center">
                        <div className="flex items-center justify-between">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Est. Profit / Day
                          </p>
                          <p
                            className={`text-xs sm:text-sm font-bold ${
                              profitPerDay >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            ${profitPerDay.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            Price
                          </p>
                          <p className="text-lg sm:text-xl font-bold text-dogecoin">
                            ${miner.cost.toLocaleString()}
                          </p>
                        </div>
                        {miner.buyUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(miner.buyUrl, "_blank");
                            }}
                            className="gap-1 text-xs"
                          >
                            Buy
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* View All Button */}
          {minersData.length > 10 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllMiners(!showAllMiners)}
                className="min-w-[200px]"
              >
                {showAllMiners ? (
                  <>
                    Show Less{" "}
                    <ChevronsDown className="ml-2 h-4 w-4 rotate-180" />
                  </>
                ) : (
                  <>
                    View All Miners ({minersData.length}){" "}
                    <ChevronsDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* STEP 2: Calculator */}
        <div className="pt-32 md:pt-36" ref={calculatorRef}>
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CalculatorIcon className="h-6 w-6 text-dogecoin" />
                  Configure & Calculate
                </CardTitle>
              </div>
              <CardDescription>
                {selectedMiner
                  ? `Using: ${selectedMiner.name}`
                  : "Select a miner first or enter values manually"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {/* Left: Inputs */}
                <div className="space-y-4">
                  {selectedMiner && (
                    <div className="flex items-center justify-between p-3 rounded bg-muted/50 text-sm border">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {selectedMiner.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatHashrate(
                            toHashrate(
                              selectedMiner.hashrateValue,
                              selectedMiner.hashrateUnit
                            )
                          )}{" "}
                          • {selectedMiner.power}W
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(selectedMiner.buyUrl, "_blank");
                        }}
                        className="gap-1 text-xs"
                      >
                        Buy <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

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
                      />
                      <Select
                        value={state.hashrateUnit}
                        onValueChange={(newUnit) => {
                          const displayed = fromHashrate(
                            state.hashrate,
                            newUnit
                          );
                          setState((s) => ({
                            ...s,
                            hashrateUnit: newUnit,
                            hashrateValue: displayed,
                          }));
                        }}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
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
                    className="w-full bg-dogecoin hover:bg-dogecoin/90 text-white"
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
                    <div className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-dogecoin" />
                      Live DOGE Stats
                    </div>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm mt-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-semibold">
                          ${stats.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Difficulty
                        </span>
                        <span className="font-semibold">
                          {formatDifficulty(stats.difficulty)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Block Reward
                        </span>
                        <span className="font-semibold">
                          {stats.blockReward} DOGE
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Network Hashrate
                        </span>
                        <span className="font-semibold break-all">
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

                  <h3 className="font-semibold text-base sm:text-lg">
                    Mining Summary
                  </h3>
                  <div className="flex-1 grid gap-2 sm:gap-3 content-start text-xs sm:text-sm">
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
                        Dogecoin mined per hour
                      </span>
                      <span className="font-medium break-all">
                        {results ? results.dogePerHour.toFixed(8) : "0.00000000"}{" "}
                        DOGE
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Dogecoin mined per day
                      </span>
                      <span className="font-medium break-all">
                        {results ? results.dogePerDay.toFixed(8) : "0.00000000"}{" "}
                        DOGE
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">
                        Dogecoin mining profit per day
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
        </div>
        {/* Forecast Table, KPIs, FAQ - unchanged below */}
        {results && (
          <>
            {/* Forecast Table */}
            <Card className="mt-6 sm:mt-8">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">
                  Mining Reward Forecast
                </CardTitle>
                <CardDescription>Projected earnings over time</CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-4 lg:px-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>DOGE</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Power Cost
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Fees
                        </TableHead>
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
                          <TableCell className="font-medium">
                            {p.label}
                          </TableCell>
                          <TableCell className="font-mono">
                            {dogePerPeriod(p.h).toFixed(8)}
                          </TableCell>
                          <TableCell>
                            ${revenuePerPeriod(p.h).toFixed(2)}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            ${costPerPeriod(p.h).toFixed(2)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            ${feesPerPeriod(p.h).toFixed(2)}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${profitPerPeriod(p.h).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
                    <Clock className="h-5 w-5" /> Days to 1 DOGE
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold">
                    {results.daysTo1Doge.toFixed(1)}
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
          </>
        )}

        {/* FAQ */}
        <Card className="mt-8 mb-10 lg:mb-12">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Accordion
              type="multiple"
              defaultValue={faqsData.map((_, i) => `item-${i}`)}
            >
              {faqsData.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {faq.answer.map((point, j) => (
                        <li key={j}>{point}</li>
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
