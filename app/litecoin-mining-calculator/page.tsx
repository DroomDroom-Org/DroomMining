import React from "react";
import { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import LitecoinCalculatorPageClientShimmer from "./page-client-shimmer";
import LitecoinCalculatorPageClient from "./page-client";

async function fetchInitialData() {
  try {
    const [statsResponse, faqsResponse] = await Promise.all([
      axios.get(getApiUrl("/litecoin/stats")),
      axios.get(getApiUrl(`/litecoin/faqs/calculator`)),
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

export default async function LitecoinCalculatorPage() {
  const data = await fetchInitialData();
  const { statsData , faqsData } = data;

  return (
    <Suspense fallback={<LitecoinCalculatorPageClientShimmer />}>
      <LitecoinCalculatorPageClient statsData={statsData} faqsData={faqsData} />
    </Suspense>
  );
}
