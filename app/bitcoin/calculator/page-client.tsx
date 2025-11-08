"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  DollarSign,
  Clock,
  TrendingUp,
  Settings,
  Calculator,
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
import BitcoinNavigation from "@/components/bitcoin-navigation";
import { BitcoinStats, BitcoinMiner, BitcoinCalculator } from "@/types";
import { formatDifficulty, formatHashrate } from "@/lib/format";
import { bitcoinCalculatorFaqs } from "@/constants/bitcoin";
import Breadcrumbs from "@/components/breadcrumbs";

interface BitcoinCalculatorPageClientProps {
  statsData: BitcoinStats;
  minersData: BitcoinMiner[];
}

const unitMultipliers: Record<string, number> = {
  "MH/s": 1e6,
  "GH/s": 1e9,
  "TH/s": 1e12,
  "PH/s": 1e15,
};

const toHashrate = (value: number, unit: string): number =>
  value * (unitMultipliers[unit] ?? 1e12);
const fromHashrate = (hashrate: number, unit: string): number =>
  hashrate / (unitMultipliers[unit] ?? 1e12);

export default function BitcoinCalculatorPageClient({
  statsData,
  minersData,
}: BitcoinCalculatorPageClientProps) {
  const [state, setState] = useState<BitcoinCalculator>({
    hashrate: 390_000_000_000_000,
    hashrateValue: 390,
    hashrateUnit: "TH/s",
    power: 7215,
    electricityCost: 0.05,
    poolFee: 1,
  });

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMiner, setSelectedMiner] = useState<BitcoinMiner | null>(null);
  const [showAllMiners, setShowAllMiners] = useState(false);

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

    const btcPrice = stats.price || 111_747;
    const blockReward = stats.blockReward || 3.125;
    const avgBlockTime = stats.blockTime || 600;

    const btcPerSecond =
      ((hashrate / stats.networkHashrate) * blockReward) / avgBlockTime;
    const secondsPerDay = 86_400;
    const btcPerDay = btcPerSecond * secondsPerDay;
    const revenuePerDay = btcPerDay * btcPrice;

    const kwhPerDay = (power * 24) / 1000;
    const electricityCostPerDay = kwhPerDay * electricityCost;
    const poolFeePerDay = revenuePerDay * (poolFee / 100);
    const profitPerDay = revenuePerDay - electricityCostPerDay - poolFeePerDay;

    const minerCost = selectedMiner?.cost ?? 0;
    const roiDays = profitPerDay > 0 ? minerCost / profitPerDay : Infinity;
    const daysTo1Btc = btcPerDay > 0 ? 1 / btcPerDay : Infinity;
    const profitMargin =
      revenuePerDay > 0 ? (profitPerDay / revenuePerDay) * 100 : 0;

    setResults({
      btcPerDay,
      revenuePerDay,
      elecPerDay: electricityCostPerDay,
      feesPerDay: poolFeePerDay,
      profitPerDay,
      roiDays: isFinite(roiDays) ? roiDays : 0,
      daysTo1Btc: isFinite(daysTo1Btc) ? daysTo1Btc : 0,
      profitMargin: profitMargin.toFixed(2),
      btcPerHour: btcPerDay / 24,
    });

    setTimeout(() => setLoading(false), 300);
  };

  const loadMiner = (miner: BitcoinMiner) => {
    setSelectedMiner(miner);
    setLoading(true);
    setTimeout(() => calculateProfit(), 150);
  };

  const per = (field: keyof typeof results, hours: number) =>
    results ? results[field] * (hours / 24) : 0;
  const btcPerPeriod = (h: number) => per("btcPerDay", h);
  const revenuePerPeriod = (h: number) => per("revenuePerDay", h);
  const costPerPeriod = (h: number) => per("elecPerDay", h);
  const feesPerPeriod = (h: number) => per("feesPerDay", h);
  const profitPerPeriod = (h: number) => per("profitPerDay", h);

  const displayedMiners =
    showAllMiners && minersData ? minersData : minersData.slice(0, 10);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Bitcoin Mining Calculator", href: "/bitcoin/calculator" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <BitcoinNavigation />

        {/*Page Header */}
        <div className="w-full mb-4 sm:mb-6 pt-6">
          <div className="w-full flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Breadcrumbs items={breadcrumbs} className="text-bitcoin" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex flex-col">
              <div className="flex items-center mb-3 sm:mb-4 gap-3 sm:gap-4">
                <img
                  src={getCmcImageUrl(1)}
                  alt="Bitcoin"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded flex-shrink-0"
                />
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Bitcoin Mining Calculator
                </h1>
              </div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl pl-11 sm:pl-14 text-muted-foreground leading-relaxed">
                Calculate BTC mining profitability in real time
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

        {/* Upper Calculator + Summary Card */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
              BTC Mining Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Left: Inputs */}
              <div className="space-y-4">
                {selectedMiner && (
                  <div className="flex items-center justify-between p-2 sm:p-3 rounded bg-muted/50 text-sm border-1 gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-xs sm:text-sm">
                        {selectedMiner.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
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
                      Buy
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {/* Hashrate */}
                <div className="space-y-2">
                  <Label htmlFor="hashrate" className="text-sm sm:text-base">
                    Hashrate
                  </Label>
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
                      className="flex-1 text-sm sm:text-base"
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
                      <SelectTrigger className="w-[80px] sm:w-[100px] text-sm">
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
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {formatHashrate(state.hashrate)} H/s
                  </p>
                </div>

                {/* Power */}
                <div className="space-y-2">
                  <Label htmlFor="power" className="text-sm sm:text-base">
                    Power Consumption (W)
                  </Label>
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
                    className="text-sm sm:text-base"
                  />
                </div>

                {/* Electricity */}
                <div className="space-y-2">
                  <Label htmlFor="elec-cost" className="text-sm sm:text-base">
                    Electricity Cost ($/kWh)
                  </Label>
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
                    className="text-sm sm:text-base"
                  />
                </div>

                {/* Pool Fee */}
                <div className="space-y-2">
                  <Label htmlFor="pool-fee" className="text-sm sm:text-base">
                    Pool Fee (%)
                  </Label>
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
                    className="text-sm sm:text-base"
                  />
                </div>

                <Button
                  onClick={calculateProfit}
                  className="w-full bg-bitcoin hover:bg-bitcoin/90 text-white text-sm sm:text-base"
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
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-bitcoin" />
                    Live BTC Stats
                  </div>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm mt-3">
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
                        {stats.blockReward} BTC
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
                      Bitcoin mined per hour
                    </span>
                    <span className="font-medium break-all">
                      {results ? results.btcPerHour.toFixed(8) : "0.00000000"}{" "}
                      BTC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Bitcoin mined per day
                    </span>
                    <span className="font-medium break-all">
                      {results ? results.btcPerDay.toFixed(8) : "0.00000000"}{" "}
                      BTC
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">
                      Bitcoin mining profit per day
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
          <Card className="mt-6 sm:mt-8">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl">
                Mining Reward Forecast
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Projected earnings over time
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-4 lg:px-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">
                        Period
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">BTC</TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Revenue
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                        Power Cost
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                        Fees
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Profit
                      </TableHead>
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
                        <TableCell className="text-xs sm:text-sm font-medium">
                          {p.label}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm font-mono">
                          {btcPerPeriod(p.h).toFixed(8)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          ${revenuePerPeriod(p.h).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          ${costPerPeriod(p.h).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          ${feesPerPeriod(p.h).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm font-semibold">
                          ${profitPerPeriod(p.h).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* KPI Cards */}
        {results && (
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="text-center pb-2 sm:pb-3 px-4">
                <CardTitle className="text-base sm:text-lg">
                  Profit Margin
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-4">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  +{results.profitMargin}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center pb-2 sm:pb-3 px-4">
                <CardTitle className="text-base sm:text-lg flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" /> Days to 1 BTC
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-4">
                <div className="text-2xl sm:text-3xl font-bold">
                  {results.daysTo1Btc.toFixed(1)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center pb-2 sm:pb-3 px-4">
                <CardTitle className="text-base sm:text-lg flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" /> ROI (Days)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-4">
                <div className="text-2xl sm:text-3xl font-bold">
                  {results.roiDays === Infinity
                    ? "Never"
                    : results.roiDays.toFixed(1)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Popular Miners Table with View All */}
        <div className="mt-6 sm:mt-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-bitcoin" />
              Popular Miners
            </h2>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              Click a card to auto-fill calculator
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {displayedMiners.map((miner) => {
              const minerHashrate = toHashrate(
                miner.hashrateValue,
                miner.hashrateUnit
              );
              const isSelected = selectedMiner?.name === miner.name;

              return (
                <Card
                  key={miner.id}
                  onClick={() => loadMiner(miner)}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected
                      ? "ring-2 ring-bitcoin shadow-lg"
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
                        <Badge className="absolute top-2 right-2 bg-bitcoin text-white text-xs">
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

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            Price
                          </p>
                          <p className="text-lg sm:text-xl font-bold text-bitcoin">
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

          {/* View All / Collapse Button */}
          {minersData.length > 5 && (
            <div className="mt-4 sm:mt-6 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllMiners(!showAllMiners)}
                className="min-w-[180px] sm:min-w-[200px] text-sm sm:text-base"
              >
                {showAllMiners ? (
                  <>
                    Show Less
                    <ChevronsDown className="ml-2 h-4 w-4 rotate-180" />
                  </>
                ) : (
                  <>
                    View All Miners ({minersData.length})
                    <ChevronsDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* FAQ */}
        <Card className="mt-6 sm:mt-8 mb-8 sm:mb-10 lg:mb-12">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">FAQs</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Accordion type="single" collapsible className="w-full">
              {bitcoinCalculatorFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-sm sm:text-base lg:text-lg text-left">
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
