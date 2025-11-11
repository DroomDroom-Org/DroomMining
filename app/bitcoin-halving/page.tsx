import React from "react";
import { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import BitcoinHalvingPageShimmer from "./page-client-shimmer";
import BitcoinHalvingPageClient from "./page-client";

async function fetchInitialData() {
  try {
    const [statsResponse, faqsResponse] =
      await Promise.all([
        axios.get(getApiUrl("/bitcoin/stats")),
        axios.get(getApiUrl(`/bitcoin/faqs/halving`)),
      ]);

    return {
      statsData: statsResponse.data.data,
      faqsData: faqsResponse.data.data
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      statsData: null,
      faqsData: []
    };
  }
}

export default async function BitcoinHomePage() {
  const data = await fetchInitialData();
  const { statsData , faqsData } = data;

  return (
    <Suspense fallback={<BitcoinHalvingPageShimmer />}>
      <BitcoinHalvingPageClient statsData={statsData} faqsData={faqsData} />
    </Suspense>
  );
}
