import React from "react";
import { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import ZcashCalculatorPageClientShimmer from "./page-client-shimmer";
import ZcashCalculatorPageClient from "./page-client";

async function fetchInitialData() {
  try {
    const [statsResponse, faqsResponse] = await Promise.all([
      axios.get(getApiUrl("/zcash/stats")),
      axios.get(getApiUrl(`/zcash/faqs/calculator`)),
    ]);

    return {
      statsData: statsResponse.data.data,
      faqsData: faqsResponse.data.data,
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      statsData: null,
      faqsData: [],
    };
  }
}

export default async function ZcashCalculatorPage() {
  const data = await fetchInitialData();
  const { statsData , faqsData} = data;

  return (
    <Suspense fallback={<ZcashCalculatorPageClientShimmer />}>
      <ZcashCalculatorPageClient statsData={statsData} faqsData={faqsData} />
    </Suspense>
  );
}
