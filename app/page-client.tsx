import React from "react";
import { ChevronRight, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Coin } from "@/types";
import { formatHashrate, formatDifficulty } from "@/lib/format";

export default function MiningPageClient({ coins }: { coins: Coin[] }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4">
        <section className="py-16 md:py-24 lg:py-32">
          <div className="page-container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="section-title text-4xl md:text-5xl lg:text-6xl animate-fade-in">
                Calculate mining profits accurately.
              </h1>
              <p className="section-subtitle mt-4 text-lg md:text-xl text-muted-foreground animate-slide-in-from-bottom animation-delay-200">
                Calculate mining profits with real-time data. Analyze rewards,
                difficulty, and hashrate for top PoW coins.
              </p>
              <div className="mt-8 animate-slide-in-from-bottom animation-delay-400">
                <Button
                  asChild
                  size="lg"
                  className="interactive-element bg-bitcoin hover:bg-bitcoin-dark"
                >
                  <Link href="https://droomdroom.com/bitcoin-mining-calculator">
                    <Calculator className="mr-2 h-4 w-4" />
                    Bitcoin Mining Calculator
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Calculators Grid */}
        <section className="py-4">
          <div className="page-container">
            <h2 className="section-title text-center mb-12 animate-fade-in">
              Mining Calculators
            </h2>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {coins.map((coin, idx) => (
                <Link key={coin.id} href={`${coin.calculatorHref}`}>
                  <Card
                    className="
              card-hover interactive-element group cursor-pointer
              overflow-hidden border border-border/50 bg-card/95 backdrop-blur-sm
              h-48 w-36 sm:w-40 md:w-44 lg:w-48
              flex flex-col justify-between
            "
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <CardHeader className="pb-3 pt-4 px-3 flex-shrink-0">
                      <div className="flex justify-center">
                        <div className="relative">
                          <img
                            src={coin.logo}
                            alt={coin.name}
                            className="
                      w-12 h-12 md:w-16 md:h-16 object-contain rounded-full
                      ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all
                    "
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 pb-4 px-3 text-center flex-grow flex items-center justify-center">
                      <p className="text-base font-semibold leading-tight">
                        {coin.name} Mining Calculator
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
                Calculate profitability for Bitcoin, Litecoin, Dogecoin, Zcash.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Grid*/}
        <section className="py-12">
          <div className="page-container">
            <h2 className="section-title text-center mb-12 animate-fade-in">
              Mining Statistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coins.map((coin, idx) => (
                <Link key={coin.id} href={coin.miningHref} className="group">
                  <Card
                    className="
              card-hover interactive-element group
              overflow-hidden border border-border/30
              bg-card/80 backdrop-blur-sm
              flex flex-col h-full
              transition-all duration-300
            "
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <CardHeader className="pb-2 pt-4 px-4 flex-shrink-0">
                      <div className="flex justify-center">
                        <img
                          src={coin.logo}
                          alt={coin.name}
                          className="
                    w-14 h-14 object-contain rounded-full
                    ring-2 ring-primary/20 group-hover:ring-primary/40
                    transition-all duration-300
                  "
                          loading="lazy"
                        />
                      </div>
                      <p className="mt-2 text-center text-sm font-medium text-foreground">
                        {coin.name}
                      </p>
                    </CardHeader>

                    <CardContent className="px-4 pb-4 pt-0 flex-grow">
                      <dl className="space-y-2 text-xs">
                        {/* Price */}
                        <div className="flex justify-between items-center">
                          <dt className="text-muted-foreground">Price</dt>
                          <dd className="font-medium text-green-600 dark:text-green-400">
                            ${coin.price?.toLocaleString() ?? "—"}
                          </dd>
                        </div>

                        {/* Difficulty */}
                        <div className="flex justify-between items-center">
                          <dt className="text-muted-foreground">Difficulty</dt>
                          <dd className="font-medium text-amber-600 dark:text-amber-400">
                            {formatDifficulty(coin.difficulty)}
                          </dd>
                        </div>

                        {/* Block Reward */}
                        <div className="flex justify-between items-center">
                          <dt className="text-muted-foreground">Reward</dt>
                          <dd className="font-medium text-foreground">
                            {coin.blockReward}
                          </dd>
                        </div>

                        {/* Network Hashrate */}
                        <div className="flex justify-between items-center">
                          <dt className="text-muted-foreground">Hashrate</dt>
                          <dd className="font-medium text-blue-600 dark:text-blue-400">
                            {formatHashrate(coin.networkHashrate)}
                          </dd>
                        </div>

                        {/* Block Height */}
                        <div className="flex justify-between items-center">
                          <dt className="text-muted-foreground">Height</dt>
                          <dd className="font-medium text-foreground">
                            {coin.blockCount?.toLocaleString() ?? "—"}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Real‑time profitability data for Bitcoin, Litecoin, Dogecoin,
                Zcash.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
