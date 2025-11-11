"use client";

import React from "react";
import { Hash, Zap, Gauge, TrendingUp, Calculator, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import LitecoinNavigation from "@/components/litecoin-navigation";

export default function LitecoinHomePageClientShimmer() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-pulse">
      <div className="container mx-auto px-4">
        <LitecoinNavigation />

        {/* Page Header */}
        <div className="w-full mb-4 pt-8">
          <div className="w-full flex items-center gap-4 mb-4">
            <Skeleton className="w-10 h-10 rounded" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-5 w-full max-w-3xl pl-14" />
          <Skeleton className="h-5 w-96 mt-1 pl-14" />
        </div>

        {/* Basic Info Table */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  {[...Array(14)].map((_, idx) => (
                    <TableRow key={idx} className="border-b border-border/50">
                      <TableCell className="font-medium text-muted-foreground w-1/2">
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

  
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <Skeleton className="h-6 w-56" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto mb-6">
              <Table>
                <TableBody>
                  {[...Array(5)].map((_, idx) => (
                    <TableRow key={idx} className="border-b border-border/50">
                      <TableCell className="font-medium text-muted-foreground">
                        <Skeleton className="h-5 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-28" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Skeleton className="h-5 w-full max-w-md mb-6" />
            <Button disabled size="lg" className="bg-litecoin/70">
              <Calculator className="mr-2 h-4 w-4" />
              <Skeleton className="h-5 w-48" />
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

 
        {[
          { title: "Litecoin Difficulty", icon: <Gauge className="h-5 w-5" /> },
          { title: "Litecoin Hashrate", icon: <Hash className="h-5 w-5" /> },
          { title: "Litecoin Price Chart", icon: <TrendingUp className="h-5 w-5" /> },
        ].map((chart, index) => (
          <Card key={index} className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {chart.icon}
                  <Skeleton className="h-6 w-48" />
                </div>
                <div className="flex gap-2">
                  {["1D", "1W", "1M", "1Y", "ALL"].map((range) => (
                    <Skeleton key={range} className="h-8 w-12 rounded-md" />
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
           
              <div className="h-80 w-full bg-muted/50 rounded-lg flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
        
              <div className="mt-4 flex justify-between text-sm">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}