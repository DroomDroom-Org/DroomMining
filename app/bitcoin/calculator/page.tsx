import React from "react";
import { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import BitcoinCalculatorPageClientShimmer from "./page-client-shimmer";
import BitcoinCalculatorPageClient from "./page-client";

async function fetchInitialData() {
  try {
    const [statsResponse, minersResponse , faqsResponse] =
      await Promise.all([
        axios.get(getApiUrl("/bitcoin/stats")),
        axios.get(getApiUrl(`/bitcoin/miners`)),
        axios.get(getApiUrl(`/bitcoin/faqs/calculator`)),

      ]);

    return {
      statsData: statsResponse.data.data,
      minersData: minersResponse.data.data,
      faqsData: faqsResponse.data.data
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      statsData: null,
      minersData:[],
    };
  }
}

export default async function BitcoinCalculatorPage() {
  const data = await fetchInitialData();
  const { statsData  , minersData } = data;

  return (
    <Suspense fallback={<BitcoinCalculatorPageClientShimmer />}>
      <BitcoinCalculatorPageClient statsData={statsData} minersData={minersData} faqsData={data.faqsData} />
    </Suspense>
  );
}
