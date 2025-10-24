import React from 'react';
import {
  Bitcoin,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCmcImageUrl } from '@/lib/config';

interface CryptoData {
  id: string;
  cmcId: number;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  blockReward: number;
  blockTime: number;
  difficulty: string;
  hashrate: string;
  profitability: number;
  algorithm: string;
  logo: string;
}

const cryptoList: CryptoData[] = [
  {
    id: '1',
    cmcId: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 45234.56,
    change24h: 2.34,
    blockReward: 6.25,
    blockTime: 10,
    difficulty: '83.72T',
    hashrate: '583.47 EH/s',
    profitability: 0.00001234,
    algorithm: 'SHA-256',
    logo: getCmcImageUrl(1),
  },
  {
    id: '2',
    cmcId: 1027,
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2345.67,
    change24h: -1.23,
    blockReward: 2,
    blockTime: 12,
    difficulty: '12.34P',
    hashrate: '945.23 TH/s',
    profitability: 0.00004567,
    algorithm: 'Ethash',
    logo: getCmcImageUrl(1027),
  },
  {
    id: '3',
    cmcId: 2,
    name: 'Litecoin',
    symbol: 'LTC',
    price: 89.45,
    change24h: 3.45,
    blockReward: 12.5,
    blockTime: 2.5,
    difficulty: '28.45M',
    hashrate: '845.23 TH/s',
    profitability: 0.00023456,
    algorithm: 'Scrypt',
    logo: getCmcImageUrl(2),
  },
  {
    id: '4',
    cmcId: 74,
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: 0.089,
    change24h: 5.67,
    blockReward: 10000,
    blockTime: 1,
    difficulty: '12.34M',
    hashrate: '645.23 TH/s',
    profitability: 0.00123456,
    algorithm: 'Scrypt',
    logo: getCmcImageUrl(74),
  },
  {
    id: '5',
    cmcId: 2575,
    name: 'Ravencoin',
    symbol: 'RVN',
    price: 0.032,
    change24h: -0.8,
    blockReward: 2500,
    blockTime: 1,
    difficulty: '98.12K',
    hashrate: '7.34 TH/s',
    profitability: 0.000987,
    algorithm: 'KawPow',
    logo: getCmcImageUrl(2575),
  },
  {
    id: '6',
    cmcId: 1437,
    name: 'Zcash',
    symbol: 'ZEC',
    price: 28.45,
    change24h: 1.2,
    blockReward: 3.125,
    blockTime: 75,
    difficulty: '78.45M',
    hashrate: '9.12 GS/s',
    profitability: 0.000056,
    algorithm: 'Equihash',
    logo: getCmcImageUrl(1437),
  },
  {
    id: '7',
    cmcId: 328,
    name: 'Monero',
    symbol: 'XMR',
    price: 148.9,
    change24h: -2.1,
    blockReward: 0.6,
    blockTime: 120,
    difficulty: '298.45G',
    hashrate: '2.48 GH/s',
    profitability: 0.000123,
    algorithm: 'RandomX',
    logo: getCmcImageUrl(328),
  },
  {
    id: '8',
    cmcId: 1698,
    name: 'Horizen',
    symbol: 'ZEN',
    price: 12.34,
    change24h: 0.9,
    blockReward: 3.75,
    blockTime: 150,
    difficulty: '45.23M',
    hashrate: '1.23 GH/s',
    profitability: 0.000078,
    algorithm: 'Equihash',
    logo: getCmcImageUrl(1698),
  },
];

export default function MiningCalculatorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="page-container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="section-title text-4xl md:text-5xl lg:text-6xl animate-fade-in">
              Calculate Bitcoin mining profits accurately.
            </h1>
            <p className="section-subtitle mt-4 text-lg md:text-xl text-muted-foreground animate-slide-in-from-bottom animation-delay-200">
              Calculate mining profits with real-time data. Analyze rewards, difficulty, and hashrate for top PoW coins.
            </p>
            <div className="mt-8 animate-slide-in-from-bottom animation-delay-400">
              <Button
                size="lg"
                className="card-hover interactive-element bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg group"
              >
                <Bitcoin className="mr-2 h-5 w-5" />
                Bitcoin Mining Calculator
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="py-16">
        <div className="page-container">
          <h2 className="section-title text-center mb-12 animate-fade-in">
            Mining Calculators
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {cryptoList.map((coin, idx) => (
              <Card
                key={coin.id}
                className="card-hover interactive-element group cursor-pointer overflow-hidden border border-border/50 bg-card/95 backdrop-blur-sm"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <CardHeader className="pb-3 pt-4 px-3">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      <img
                        src={coin.logo}
                        alt={coin.name}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3 px-3 text-center">
                  <p className="text-base font-semibold">
                    {coin.name} Mining Calculator
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
              Calculate profitability for Bitcoin, Ethereum, Litecoin, Dogecoin, Monero, Zcash, Ravencoin, and more.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="interactive-element card-hover group"
            >
              View All Calculators
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}