// components/bitcoin-halving-shimmer.tsx
"use client";

import React from "react";
import {
  Bitcoin,
  Clock,
  Calendar,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BitcoinNavigation from "@/components/bitcoin-navigation";

export default function BitcoinHalvingPageShimmer() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-pulse">
      <div className="container mx-auto px-4">
        <BitcoinNavigation />

        {/* Header */}
        <div className="w-full mb-4 pt-8">
          <div className="w-full flex items-center gap-4 mb-4">
            <Skeleton className="w-10 h-10 rounded" />
            <Skeleton className="h-9 w-64 md:w-96" />
          </div>
          <Skeleton className="h-6 w-full max-w-2xl pl-14" />
        </div>

        {/* Live Countdown */}
        <Card className="mb-12">
          <CardContent className="pt-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="text-center space-y-2">
                  <Skeleton className="h-12 w-20 mx-auto rounded" />
                  <Skeleton className="h-4 w-12 mx-auto" />
                </div>
              ))}
            </div>

            <div className="text-center space-y-3">
              <Skeleton className="h-6 w-64 mx-auto" />
              <Progress value={0} className="h-3 max-w-md mx-auto opacity-50" />
              <Skeleton className="h-5 w-48 mx-auto" />
              <Skeleton className="h-5 w-56 mx-auto" />
              <Skeleton className="h-5 w-72 mx-auto" />
            </div>
          </CardContent>
        </Card>

        {/* 2024 Halving Summary */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <Skeleton className="h-6 w-56" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8 text-center">
              <div className="space-y-2">
                <Skeleton className="h-8 w-20 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
              <div className="text-3xl">→</div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-20 mx-auto bg-bitcoin/30" />
                <Skeleton className="h-4 w-28 mx-auto" />
              </div>
            </div>
            <Skeleton className="h-5 w-full max-w-lg mx-auto mt-4" />
          </CardContent>
        </Card>

        {/* 2028 Prediction */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-full mb-4" />
            <Skeleton className="h-5 w-full mb-4" />
            <div className="bg-muted/50 p-4 rounded-lg">
              <Skeleton className="h-4 w-48 mx-auto mb-2" />
              <Skeleton className="h-6 w-64 mx-auto" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="space-y-1">
                  <Skeleton className="h-7 w-20 mx-auto" />
                  <Skeleton className="h-3 w-12 mx-auto" />
                </div>
              ))}
            </div>
            <Skeleton className="h-4 w-32 mx-auto mt-4" />
          </CardContent>
        </Card>

        {/* Halving History Table */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Halving", "Year", "Block Height", "Block Reward", "Date"].map((head) => (
                      <TableHead key={head}>
                        <Skeleton className="h-5 w-20" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, rowIdx) => (
                    <TableRow key={rowIdx}>
                      <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-32" />
                          {rowIdx === 3 && <Skeleton className="h-5 w-16 rounded-full" />}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Expand Button */}
            <div className="mt-6 text-center">
              <Button variant="outline" size="sm" disabled className="inline-flex items-center gap-2">
                <ChevronDown className="h-4 w-4" />
                <Skeleton className="h-5 w-48" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Halving Chart */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-full max-w-2xl mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <Skeleton className="h-5 w-16" />
                  <div className="flex-1 h-12 bg-muted/20 rounded overflow-hidden">
                    <div
                      className={`h-full rounded ${idx === 3 ? "bg-bitcoin/30" : "bg-primary/10"}`}
                      style={{ width: `${100 - idx * 18}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-5 w-64 mx-auto mt-6" />
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-80" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="border-b pb-4">
                  <Skeleton className="h-6 w-full max-w-md mb-2" />
                  <div className="pl-6 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}