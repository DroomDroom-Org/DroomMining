import React from "react";
import { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import DogecoinCalculatorPageClientShimmer from "./page-client-shimmer";
import DogecoinCalculatorPageClient from "./page-client";

async function fetchInitialData() {
  try {
    const statsResponse = await axios.get(getApiUrl("/dogecoin/stats"));
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

export default async function DogecoinCalculatorPage() {
  const data = await fetchInitialData();
  const { statsData } = data;

  return (
    <Suspense fallback={<DogecoinCalculatorPageClientShimmer />}>
      <DogecoinCalculatorPageClient statsData={statsData} />
    </Suspense>
  );
}
