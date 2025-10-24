"use client";

import React, { useState, useEffect } from "react";
import {
  Bitcoin,
  Zap,
  DollarSign,
  Clock,
  TrendingUp,
  Settings,
  Calculator,
  ChevronRight,
  ArrowRight,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
import { getCmcImageUrl } from "@/lib/config";
import BitcoinNavigation from "@/components/bitcoin-navigation";

interface Miner {
  name: string;
  manufacturer: string;
  hashrate: number; // TH/s
  power: number; // Watts
  efficiency: number; // J/TH
  cost: number; // USD
  url?: string;
}

interface CalculatorState {
  hashrate: string;
  power: string;
  electricityCost: string;
  poolFee: number;
}

const bitcoinMiners: Miner[] = [
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M63S Hydro 390T",
    hashrate: 390,
    power: 7215,
    efficiency: 18.5,
    cost: 13699,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M63 Hydro 366T",
    hashrate: 366,
    power: 7283,
    efficiency: 19.9,
    cost: 11799,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M63S Hydro 360T",
    hashrate: 360,
    power: 7215,
    efficiency: 20.04,
    cost: 12499,
  },
  {
    manufacturer: "Bitmain",
    name: "Antminer S21 Hydro",
    hashrate: 335,
    power: 5360,
    efficiency: 16,
    cost: 7599,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M63 Hydro 334T",
    hashrate: 334,
    power: 7283,
    efficiency: 21.81,
    cost: 10799,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M66S Hydro 298T",
    hashrate: 298,
    power: 5513,
    efficiency: 18.5,
    cost: 10799,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M66 Hydro 280T",
    hashrate: 280,
    power: 5572,
    efficiency: 19.9,
    cost: 9499,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M66S Hydro 270T",
    hashrate: 270,
    power: 5513,
    efficiency: 20.42,
    cost: 9699,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M53S Hydro",
    hashrate: 260,
    power: 6760,
    efficiency: 26,
    cost: 5999,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M33S++ Hydro",
    hashrate: 242,
    power: 7260,
    efficiency: 30,
    cost: 5599,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M66 Hydro 238T",
    hashrate: 238,
    power: 5572,
    efficiency: 23.41,
    cost: 7999,
  },
  {
    manufacturer: "Bitmain",
    name: "Antminer S21",
    hashrate: 200,
    power: 3500,
    efficiency: 17.5,
    cost: 5449,
  },
  {
    manufacturer: "Bitmain",
    name: "Antminer T21",
    hashrate: 190,
    power: 3610,
    efficiency: 19,
    cost: 4369,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M60S 186T",
    hashrate: 186,
    power: 3441,
    efficiency: 18.5,
    cost: 6299,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M60 172T",
    hashrate: 172,
    power: 3422,
    efficiency: 19.9,
    cost: 5499,
  },
  {
    manufacturer: "Canaan",
    name: "Avalon A1466I 170T",
    hashrate: 170,
    power: 3315,
    efficiency: 19.5,
    cost: 3699,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M60S 170T",
    hashrate: 170,
    power: 3441,
    efficiency: 20.24,
    cost: 5699,
  },
  {
    manufacturer: "MicroBT",
    name: "Whatsminer M60 156T",
    hashrate: 156,
    power: 3422,
    efficiency: 21.94,
    cost: 4799,
  },
  {
    manufacturer: "Bitmain",
    name: "Antminer S19j XP 151T",
    hashrate: 151,
    power: 3247,
    efficiency: 21.5,
    cost: 6299,
  },
  {
    manufacturer: "Canaan",
    name: "Avalon A1466 150T",
    hashrate: 150,
    power: 3230,
    efficiency: 21.53,
    cost: 3399,
  },
  {
    manufacturer: "Bitmain",
    name: "Antminer S19 XP",
    hashrate: 140,
    power: 3010,
    efficiency: 21.5,
    cost: 17999.99,
  },
];

export default function BitcoinCalculatorPage() {
  const [state, setState] = useState<CalculatorState>({
    hashrate: "390",
    power: "7215",
    electricityCost: "0.05",
    poolFee: 1,
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMiner, setSelectedMiner] = useState<Miner | null>(
    bitcoinMiners[0]
  );

  // Mock live data (in real app, fetch from API)
  const [liveData, setLiveData] = useState({
    btcPrice: 109600.83,
    difficulty: 146716052770110,
    blockReward: 3.125,
    globalHashrate: 1021.3, // EH/s
    blockHeight: 920410,
    blockTime: 10, // minutes
  });

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setLiveData({
        btcPrice: 109600.83,
        difficulty: 146716052770110,
        blockReward: 3.125,
        globalHashrate: 1021.3,
        blockHeight: 920410,
        blockTime: 10,
      });
    }, 500);
  }, []);

  const calculateProfit = () => {
    setLoading(true);
    const hashrate = parseFloat(state.hashrate) * 1e12; // TH/s to H/s
    const power = parseFloat(state.power);
    const elecCost = parseFloat(state.electricityCost);
    const poolFee = state.poolFee / 100;
    const btcPrice = liveData.btcPrice;
    const difficulty = liveData.difficulty;
    const blockReward = liveData.blockReward;
    const blockTime = liveData.blockTime * 60; // seconds

    // Simplified mining calc (expected BTC per second)
    const networkHashrate = liveData.globalHashrate * 1e18; // EH/s to H/s
    const expectedBtcPerSec =
      (hashrate / networkHashrate) *
      (blockReward / (difficulty / 2 ** 32)) *
      (600 / blockTime); // Approx
    const expectedBtcPerDay = expectedBtcPerSec * 86400;
    const revenuePerDay = expectedBtcPerDay * btcPrice;
    const elecPerDay = (power / 1000) * 24 * elecCost;
    const feesPerDay = revenuePerDay * poolFee;
    const profitPerDay = revenuePerDay - elecPerDay - feesPerDay;

    const roiDays =
      profitPerDay > 0 ? (selectedMiner?.cost ?? 0) / profitPerDay : 0;
    const daysTo1Btc = 1 / expectedBtcPerDay;
    const daysToBlock = difficulty / (hashrate / 600); // Approx

    setResults({
      btcPerHour: expectedBtcPerDay / 24,
      btcPerDay: expectedBtcPerDay,
      revenuePerDay: revenuePerDay,
      feesPerDay: feesPerDay,
      elecPerDay: elecPerDay,
      profitPerDay: profitPerDay,
      roiDays,
      daysTo1Btc,
      daysToBlock,
      profitMargin: ((profitPerDay / revenuePerDay) * 100).toFixed(2),
    });

    setTimeout(() => setLoading(false), 1000);
  };

  const loadMiner = (miner: Miner) => {
    setSelectedMiner(miner);
    setState({
      hashrate: miner.hashrate.toString(),
      power: miner.power.toString(),
      electricityCost: "0.05",
      poolFee: 1,
    });
  };

  const revenuePerPeriod = (period: number) =>
    results ? results.revenuePerDay * (period / 24) : 0;
  const costPerPeriod = (period: number) =>
    results ? results.elecPerDay * (period / 24) : 0;
  const feesPerPeriod = (period: number) =>
    results ? results.feesPerDay * (period / 24) : 0;
  const profitPerPeriod = (period: number) =>
    results ? results.profitPerDay * (period / 24) : 0;
  const btcPerPeriod = (period: number) =>
    results ? results.btcPerDay * (period / 24) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4">
        <BitcoinNavigation />

        {/* Page Header */}
        <section className="pt-8">
          <div className="">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="w-full flex items-center mb-4 gap-4">
                  <img
                    src={getCmcImageUrl(1)}
                    alt="Bitcoin Logo"
                    className="w-10 h-10 rounded"
                  />
                  <h1 className="font-bold animate-fade-in">
                    Bitcoin Mining Calculator
                  </h1>
                </div>
                <p className="text-xl pl-14">
                  Calculate BTC mining profitability
                </p>
              </div>
              <Badge variant="secondary" className="self-start sm:self-auto">
                Updated: {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </section>

        <div className=" py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                BTC Mining Calculator
              </CardTitle>
              <CardDescription>
                Enter your hashrate, power, and costs to see real-time
                profitability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hashrate" className="form-label">
                    Hashrate (TH/s)
                  </Label>
                  <Input
                    id="hashrate"
                    type="number"
                    placeholder="e.g. 390"
                    value={state.hashrate}
                    onChange={(e) =>
                      setState({ ...state, hashrate: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="power" className="form-label">
                    Power Consumption (Watts)
                  </Label>
                  <Input
                    id="power"
                    type="number"
                    placeholder="e.g. 7215"
                    value={state.power}
                    onChange={(e) =>
                      setState({ ...state, power: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="elec-cost" className="form-label">
                    Electricity Cost ($/kWh)
                  </Label>
                  <Input
                    id="elec-cost"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 0.05"
                    value={state.electricityCost}
                    onChange={(e) =>
                      setState({ ...state, electricityCost: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pool-fee" className="form-label">
                    Pool Fee (%)
                  </Label>
                  <Input
                    id="pool-fee"
                    type="number"
                    placeholder="e.g. 1"
                    value={state.poolFee}
                    onChange={(e) =>
                      setState({
                        ...state,
                        poolFee: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <Button
                onClick={calculateProfit}
                className="w-full interactive-element bg-bitcoin border-bitcoin hover:bg-bitcoin/90"
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
                    Calculate Mining Profit
                  </>
                )}
              </Button>

              {results && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold">
                      ${results.revenuePerDay.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Revenue (Daily)
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold">
                      ${results.elecPerDay.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Electricity
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold">
                      ${results.feesPerDay.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">Fees</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      ${results.profitPerDay.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Profit (Daily)
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar: Miners & Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-4 w-4 text-bitcoin" />
                  Live BTC Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold">
                      ${liveData.btcPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty</span>
                    <span className="font-mono text-xs">
                      {liveData.difficulty.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Block Reward</span>
                    <span className="font-semibold">
                      {liveData.blockReward} BTC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Global Hashrate
                    </span>
                    <span className="font-semibold">
                      {liveData.globalHashrate} EH/s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Block Height</span>
                    <span className="font-semibold">
                      {liveData.blockHeight.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Miners */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-bitcoin" />
                  Bitcoin Miners
                </CardTitle>
                <CardDescription>
                  Select to auto-fill calculator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {bitcoinMiners.slice(0, 8).map((miner, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className={`w-full justify-start text-left animate-fade-in ${selectedMiner?.name === miner.name ? "bg-orange-200" : ""
                      }`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    onClick={() => loadMiner(miner)}
                  >
                    <img
                      src={getCmcImageUrl(1)} 
                      alt={miner.manufacturer}
                      className="w-4 h-4 mr-2 rounded"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{miner.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {miner.manufacturer}
                      </div>
                    </div>
                    <div className="text-xs text-right">
                      <div>{miner.hashrate} TH/s</div>
                      <div className="text-muted-foreground">
                        {miner.power}W
                      </div>
                    </div>
                  </Button>
                ))}
                <Button variant="outline" className="w-full">
                  View All Miners <ChevronRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Sections */}
        {results && (
          <>
            {/* Rewards Forecast Table */}
            <Card className="page-container mx-auto max-w-4xl">
              <CardHeader>
                <CardTitle>Mining Reward Forecasts</CardTitle>
                <CardDescription>Based on current network data</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time Frame</TableHead>
                      <TableHead>BTC Reward</TableHead>
                      <TableHead>Revenue USD</TableHead>
                      <TableHead>Power Cost USD</TableHead>
                      <TableHead>Pool Fees USD</TableHead>
                      <TableHead>Profit USD</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { label: "Hourly", period: 1 },
                      { label: "Daily", period: 24 },
                      { label: "Weekly", period: 168 },
                      { label: "Monthly", period: 730 },
                      { label: "Annually", period: 8760 },
                    ].map((item) => (
                      <TableRow key={item.label}>
                        <TableCell>{item.label}</TableCell>
                        <TableCell>
                          {btcPerPeriod(item.period).toFixed(8)} BTC
                        </TableCell>
                        <TableCell>
                          ${revenuePerPeriod(item.period).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${costPerPeriod(item.period).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${feesPerPeriod(item.period).toFixed(2)}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${profitPerPeriod(item.period).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  * BTC Price: ${liveData.btcPrice.toLocaleString()} USD
                </p>
              </CardContent>
            </Card>

            {/* Investment & Stats */}
            <div className="page-container grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Profit Margin
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    +{results.profitMargin}%
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5" />
                    Days to 1 BTC
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold">
                    {results.daysTo1Btc.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Days</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Zap className="h-5 w-5" />
                    ROI
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold">
                    {results.roiDays.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Days</div>
                </CardContent>
              </Card>
            </div>

            {/* Disclaimer */}
            <Card className="page-container mx-auto max-w-2xl">
              <CardContent className="py-6 text-center text-sm text-muted-foreground">
                <p>
                  Disclaimer: Estimates are based on statistical calculations
                  and do not account for difficulty fluctuations, stale shares,
                  or pool luck.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
