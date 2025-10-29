import React from "react";
import { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import ZcashCalculatorPageClientShimmer from "./page-client-shimmer";
import ZcashCalculatorPageClient from "./page-client";

async function fetchInitialData() {
  try {
    const statsResponse = await axios.get(getApiUrl("/zcash/stats"));
    return {
      statsData: statsResponse.data.data,
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      statsData: null,
    };
  }
}

export default async function ZcashCalculatorPage() {
  const data = await fetchInitialData();
  const { statsData } = data;

  return (
    <Suspense fallback={<ZcashCalculatorPageClientShimmer />}>
      <ZcashCalculatorPageClient statsData={statsData} />
    </Suspense>
  );
}
