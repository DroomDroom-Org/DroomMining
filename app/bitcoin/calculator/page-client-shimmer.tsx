"use client";

import React from "react";
import {
  Bitcoin,
  Zap,
  DollarSign,
  Clock,
  TrendingUp,
  Settings,
  Calculator,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import BitcoinNavigation from "@/components/bitcoin-navigation";

export default function BitcoinCalculatorPageClientShimmer() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-pulse-theme">
      <div className="container mx-auto px-4">
        <BitcoinNavigation />

        {/* Page Header */}
        <section className="pt-8">
          <div className="">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="w-full flex items-center mb-4 gap-4">
                  <Skeleton className="w-10 h-10 rounded" />
                  <Skeleton className="h-8 w-64" />
                </div>
                <Skeleton className="h-5 w-full max-w-2xl pl-14" />
              </div>
              <Skeleton className="h-6 w-32 rounded-md" />
            </div>
          </div>
        </section>

        {/* Main Layout: Calculator + Sidebar */}
        <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                <Skeleton className="h-6 w-40" />
              </CardTitle>
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>

              {/* Calculate Button */}
              <Skeleton className="h-12 w-full rounded-md" />

              {/* Results Grid (simulated) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="text-center space-y-1">
                    <Skeleton className="h-8 w-20 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live BTC Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <Skeleton className="h-5 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="flex justify-between py-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Bitcoin Miners Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
                <Skeleton className="h-3 w-48" />
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {/* Miner List Items */}
                {[...Array(8)].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-2 rounded-md bg-muted/50"
                  >
                    <Skeleton className="w-4 h-4 mr-2 rounded" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-2.5 w-20" />
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-2.5 w-10" />
                    </div>
                  </div>
                ))}
                {/* View All Button */}
                <Skeleton className="h-10 w-full rounded-md" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Sections (conditionally rendered - show shimmer version) */}
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-64" />
          </CardHeader>
          <CardContent>
            {/* Rewards Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {[...Array(6)].map((_, idx) => (
                      <TableHead key={idx}>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, idx) => (
                    <TableRow key={idx} className="border-b border-border/50">
                      {[...Array(6)].map((_, cellIdx) => (
                        <TableCell key={cellIdx}>
                          <Skeleton className="h-4 w-full max-w-20" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Skeleton className="h-3 w-48 mt-2 mx-auto" />
          </CardContent>
        </Card>

        {/* Investment Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          {[...Array(3)].map((_, idx) => (
            <Card key={idx}>
              <CardHeader className="text-center">
                <Skeleton className="h-4 w-24 mx-auto flex items-center gap-2 justify-center">
                  <div className="w-5 h-5 rounded bg-muted/50" />
                  <Skeleton className="h-4 w-16" />
                </Skeleton>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer Card */}
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-6">
            <Skeleton className="h-4 w-full max-w-96" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}