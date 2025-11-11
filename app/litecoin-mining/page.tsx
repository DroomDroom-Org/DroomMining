import React from "react";
import { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import LitecoinHomePageClient from "./page-client";
import LitecoinHomePageClientShimmer from "./page-client-shimmer";

async function fetchInitialData() {
  try {
    const [
      statsResponse,
      difficultyResponse,
       hashrateResponse,
       priceResponse
    ] = await Promise.all([
      axios.get(getApiUrl("/litecoin/stats")),
      axios.get(getApiUrl(`/litecoin/chart/difficulty?timespan=all`)),
      axios.get(getApiUrl(`/litecoin/chart/hashrate?timespan=all`)),
      axios.get(getApiUrl(`/litecoin/chart/price?timespan=all`)),
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

export default async function LitecoinHomePage() {
  const data = await fetchInitialData();
  const { statsData, difficultyData, hashrateData, priceData } = data;

  return (
    <Suspense fallback={<LitecoinHomePageClientShimmer />}>
      <LitecoinHomePageClient
        statsData={statsData}
        difficultyData={difficultyData}
        hashrateData={hashrateData}
        priceData={priceData}
      />
    </Suspense>
  );
}
