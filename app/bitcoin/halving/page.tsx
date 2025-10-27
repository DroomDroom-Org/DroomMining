import React from "react";
import { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import BitcoinHalvingPageShimmer from "./page-client-shimmer";
import BitcoinHalvingPageClient from "./page-client";

async function fetchInitialData() {
  try {
    const statsResponse = await axios.get(getApiUrl("/bitcoin/stats"));
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

export default async function BitcoinHomePage() {
  const data = await fetchInitialData();
  const { statsData } = data;

  return (
    <Suspense fallback={<BitcoinHalvingPageShimmer />}>
      <BitcoinHalvingPageClient statsData={statsData} />
    </Suspense>
  );
}
