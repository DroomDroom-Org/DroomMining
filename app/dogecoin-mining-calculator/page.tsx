import React from "react";
import { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import DogecoinCalculatorPageClientShimmer from "./page-client-shimmer";
import DogecoinCalculatorPageClient from "./page-client";

async function fetchInitialData() {
  try {
    const [statsResponse, faqsResponse] = await Promise.all([
      axios.get(getApiUrl("/dogecoin/stats")),
      // axios.get(getApiUrl(`/bitcoin/miners`)),
      axios.get(getApiUrl(`/dogecoin/faqs/calculator`)),
    ]);

    return {
      statsData: statsResponse.data.data,
      // minersData: minersResponse.data.data,
      faqsData: faqsResponse.data.data,
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      statsData: null,
      // minersData: [],
      faqsData: [],
    };
  }
}

export default async function BitcoinCalculatorPage() {
  const data = await fetchInitialData();
  const { statsData ,  faqsData } = data;

  return (
    <Suspense fallback={<DogecoinCalculatorPageClientShimmer />}>
      <DogecoinCalculatorPageClient
        statsData={statsData}
        // minersData={minersData}
        faqsData={faqsData}
      />
    </Suspense>
  );
}
