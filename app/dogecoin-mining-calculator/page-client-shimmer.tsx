"use client";

import React from "react";
import {
  Calculator,
  TrendingUp,
  Settings,
  Clock,
  Zap,
  DollarSign,
  ChevronsDown,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import DogecoinNavigation from "@/components/dogecoin-navigation";

export default function DogecoinCalculatorShimmer() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4">
        <DogecoinNavigation />

        {/* Header */}
        <section className="pt-8">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center mb-4 gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-9 w-64" />
              </div>
              <Skeleton className="h-6 w-96 pl-14" />
            </div>
            <Badge variant="secondary" className="self-start">
              <Skeleton className="h-4 w-24" />
            </Badge>
          </div>
        </section>

        {/* Main Calculator Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Inputs */}
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2">
                      <Skeleton className="h-10 flex-1" />
                      {i === 0 && <Skeleton className="h-10 w-24" />}
                    </div>
                  </div>
                ))}
                <Skeleton className="h-12 w-full" />
              </div>

              {/* Live Stats + Summary */}
              <div className="space-y-6">
                <div className="border-b pb-2">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <TrendingUp className="h-5 w-5" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="mt-3 space-y-3 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Skeleton className="h-5 w-32 mb-3" />
                  <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forecast Table */}
        <Card className="mt-8">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {["Period", "DOGE", "Revenue", "Cost", "Fees", "Profit"].map(
                    (h) => (
                      <TableHead key={h}>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(6)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: DollarSign, title: "Profit Margin" },
            { icon: Clock, title: "Days to 1 DOGE" },
            { icon: Zap, title: "ROI (Days)" },
          ].map((kpi, i) => (
            <Card key={i}>
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <kpi.icon className="h-5 w-5" />
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Skeleton className="h-10 w-24 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Miners */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Miner", "Hashrate", "Power", "Cost"].map((h) => (
                      <TableHead
                        key={h}
                        className={h === "Miner" ? "" : "text-right"}
                      >
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex flex-col">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20 mt-1" />
                        </div>
                      </TableCell>
                      {[...Array(3)].map((_, j) => (
                        <TableCell key={j} className="text-right">
                          <Skeleton className="h-4 w-16 inline-block" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="px-6 py-3">
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mt-8 mb-12">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-5 w-full max-w-md" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
