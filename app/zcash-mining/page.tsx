import React from "react";
import { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import ZcashHomePageClient from "./page-client";
import ZcashHomePageClientShimmer from "./page-client-shimmer";

async function fetchInitialData() {
  try {
    const [
      statsResponse,
      difficultyResponse,
       hashrateResponse,
       priceResponse
    ] = await Promise.all([
      axios.get(getApiUrl("/zcash/stats")),
      axios.get(getApiUrl(`/zcash/chart/difficulty?timespan=all`)),
      axios.get(getApiUrl(`/zcash/chart/hashrate?timespan=all`)),
      axios.get(getApiUrl(`/zcash/chart/price?timespan=all`)),
    ]);

    return {
      statsData: statsResponse.data.data,
      difficultyData: difficultyResponse.data.data,
      hashrateData: hashrateResponse.data.data,
      priceData: priceResponse.data.data,
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      statsData: null,
      difficultyData: [],
      hashrateData: [],
      priceData: [],
    };
  }
}

export default async function ZcashHomePage() {
  const data = await fetchInitialData();
  const { statsData, difficultyData, hashrateData, priceData } = data;

  return (
    <Suspense fallback={<ZcashHomePageClientShimmer />}>
      <ZcashHomePageClient
        statsData={statsData}
        difficultyData={difficultyData}
        hashrateData={hashrateData}
        priceData={priceData}
      />
    </Suspense>
  );
}
