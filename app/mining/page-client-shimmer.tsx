"use client";

import React from "react";
import { ChevronRight, Calculator } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const shimmerAnimation = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-shimmer {
    position: relative;
    overflow: hidden;
  }
  .animate-shimmer::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: shimmer 1.5s infinite;
    transform: translateX(-100%);
  }
`.trim();

function Shimmer({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-shimmer bg-muted/50 rounded-md ${className}`}
      {...props}
    />
  );
}

export default function MiningPageShimmer() {
  return (
    <>
      <style jsx>{shimmerAnimation}</style>

      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="py-16 md:py-24 lg:py-32">
            <div className="page-container">
              <div className="text-center max-w-4xl mx-auto space-y-6">
                <Shimmer className="h-12 md:h-14 lg:h-16 w-96 mx-auto" />
                <Shimmer className="h-6 w-80 mx-auto" />
                <Shimmer className="h-6 w-72 mx-auto" />

                <div className="mt-8 flex justify-center">
                  <Shimmer className="h-12 w-64 rounded-lg" />
                </div>
              </div>
            </div>
          </section>

          {/* Calculators Grid */}
          <section className="py-4">
            <div className="page-container">
              <Shimmer className="h-8 w-48 mx-auto mb-12" />

              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className="h-48 w-36 sm:w-40 md:w-44 lg:w-48"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <Card className="h-full flex flex-col justify-between border border-border/50 bg-card/95 backdrop-blur-sm overflow-hidden">
                      <CardHeader className="pb-3 pt-4 px-3">
                        <div className="flex justify-center">
                          <Shimmer className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4 px-3 text-center">
                        <Shimmer className="h-5 w-32 mx-auto" />
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Shimmer className="h-5 w-80 mx-auto" />
              </div>
            </div>
          </section>

          {/* Statistics Grid */}
          <section className="py-12">
            <div className="page-container">
              <Shimmer className="h-8 w-48 mx-auto mb-12" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className="group"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <Card className="h-full flex flex-col border border-border/30 bg-card/80 backdrop-blur-sm overflow-hidden">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex justify-center">
                          <Shimmer className="w-14 h-14 rounded-full" />
                        </div>
                        <Shimmer className="h-4 w-20 mx-auto mt-2" />
                      </CardHeader>

                      <CardContent className="px-4 pb-4 pt-0 flex-grow">
                        <dl className="space-y-2 text-xs">
                          {/* Price */}
                          <div className="flex justify-between">
                            <Shimmer className="h-3 w-12" />
                            <Shimmer className="h-3 w-16" />
                          </div>
                          {/* Difficulty */}
                          <div className="flex justify-between">
                            <Shimmer className="h-3 w-16" />
                            <Shimmer className="h-3 w-20" />
                          </div>
                          {/* Reward */}
                          <div className="flex justify-between">
                            <Shimmer className="h-3 w-14" />
                            <Shimmer className="h-3 w-12" />
                          </div>
                          {/* Hashrate */}
                          <div className="flex justify-between">
                            <Shimmer className="h-3 w-16" />
                            <Shimmer className="h-3 w-24" />
                          </div>
                          {/* Height */}
                          <div className="flex justify-between">
                            <Shimmer className="h-3 w-12" />
                            <Shimmer className="h-3 w-18" />
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Shimmer className="h-5 w-96 mx-auto" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
