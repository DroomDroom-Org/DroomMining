import React from "react";
import { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import LitecoinCalculatorPageClientShimmer from "./page-client-shimmer";
import LitecoinCalculatorPageClient from "./page-client";

async function fetchInitialData() {
  try {
    const statsResponse = await axios.get(getApiUrl("/litecoin/stats"));
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

export default async function LitecoinCalculatorPage() {
  const data = await fetchInitialData();
  const { statsData } = data;

  return (
    <Suspense fallback={<LitecoinCalculatorPageClientShimmer />}>
      <LitecoinCalculatorPageClient statsData={statsData} />
    </Suspense>
  );
}
