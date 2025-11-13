import React, { Suspense } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";
import MiningPageClient from "./page-client";
import { Coin } from "@/types";
import { getCmcImageUrl } from "@/lib/config";
import MiningPageShimmer from "./page-client-shimmer";

async function fetchInitialData() {
  try {
    const [
      bitcoinStatsResponse,
      litecoinStatsResponse,
      zcashStatsResponse,
      dogecoinStatsResponse,
    ] = await Promise.all([
      axios.get(getApiUrl("/bitcoin/stats")),
      axios.get(getApiUrl("/litecoin/stats")),
      axios.get(getApiUrl("/zcash/stats")),
      axios.get(getApiUrl("/dogecoin/stats")),
    ]);

    return {
      bitcoinStatsData: bitcoinStatsResponse.data.data,
      litecoinStatsData: litecoinStatsResponse.data.data,
      zcashStatsData: zcashStatsResponse.data.data,
      dogecoinStatsData: dogecoinStatsResponse.data.data,
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      bitcoinStatsData: null,
      litecoinStatsData: null,
      zcashStatsData: null,
      dogecoinStatsData: null,
    };
  }
}

const baseCoins: Coin[] = [
  {
    id: "1",
    cmcId: 1,
    name: "Bitcoin",
    symbol: "BTC",
    blockCount: 0,
    difficulty: 0,
    networkHashrate: 0,
    blockReward: 0,
    blockTime: 0,
    difficultyRetarget: 0,
    volume: 0,
    price: 0,
    logo: getCmcImageUrl(1),
    calculatorHref: "https://droomdroom.com/bitcoin-mining-calculator",
    miningHref: "https://droomdroom.com/bitcoin-mining",
  },
  {
    id: "2",
    cmcId: 2,
    name: "Litecoin",
    symbol: "LTC",
    blockCount: 0,
    difficulty: 0,
    networkHashrate: 0,
    blockReward: 0,
    blockTime: 0,
    difficultyRetarget: 0,
    volume: 0,
    price: 0,
    logo: getCmcImageUrl(2),
    calculatorHref: "https://droomdroom.com/litecoin-mining-calculator",
    miningHref: "https://droomdroom.com/litecoin-mining",
  },
  {
    id: "3",
    cmcId: 74,
    name: "Dogecoin",
    symbol: "DOGE",
    blockCount: 0,
    difficulty: 0,
    networkHashrate: 0,
    blockReward: 0,
    blockTime: 0,
    difficultyRetarget: 0,
    volume: 0,
    price: 0,
    logo: getCmcImageUrl(74),
    calculatorHref: "https://droomdroom.com/dogecoin-mining-calculator",
    miningHref: "https://droomdroom.com/dogecoin-mining",
  },
  {
    id: "4",
    cmcId: 1437,
    name: "Zcash",
    symbol: "ZEC",
    blockCount: 0,
    difficulty: 0,
    networkHashrate: 0,
    blockReward: 0,
    blockTime: 0,
    difficultyRetarget: 0,
    volume: 0,
    price: 0,
    logo: getCmcImageUrl(1437),
    calculatorHref: "https://droomdroom.com/zcash-mining-calculator",
    miningHref: "https://droomdroom.com/zcash-mining",
  },
];

export default async function ZcashHomePage() {
  const data = await fetchInitialData();
  const {
    bitcoinStatsData,
    litecoinStatsData,
    zcashStatsData,
    dogecoinStatsData,
  } = data;

  const coins: Coin[] = baseCoins.map((coin) => ({ ...coin }));

  for (const coin of coins) {
    if (coin.name === "Bitcoin" && bitcoinStatsData) {
      Object.assign(coin, {
        blockCount: bitcoinStatsData.blockCount ?? 0,
        difficulty: bitcoinStatsData.difficulty ?? 0,
        networkHashrate: bitcoinStatsData.networkHashrate ?? 0,
        blockReward: bitcoinStatsData.blockReward ?? 0,
        blockTime: bitcoinStatsData.blockTime ?? 0,
        difficultyRetarget: bitcoinStatsData.difficultyRetarget ?? 0,
        volume: bitcoinStatsData.volume ?? 0,
        price: bitcoinStatsData.price ?? 0,
      });
    }

    if (coin.name === "Litecoin" && litecoinStatsData) {
      Object.assign(coin, {
        blockCount: litecoinStatsData.blockCount ?? 0,
        difficulty: litecoinStatsData.difficulty ?? 0,
        networkHashrate: litecoinStatsData.networkHashrate ?? 0,
        blockReward: litecoinStatsData.blockReward ?? 0,
        blockTime: litecoinStatsData.blockTime ?? 0,
        difficultyRetarget: litecoinStatsData.difficultyRetarget ?? 0,
        volume: litecoinStatsData.volume ?? 0,
        price: litecoinStatsData.price ?? 0,
      });
    }

    if (coin.name === "Zcash" && zcashStatsData) {
      Object.assign(coin, {
        blockCount: zcashStatsData.blockCount ?? 0,
        difficulty: zcashStatsData.difficulty ?? 0,
        networkHashrate: zcashStatsData.networkHashrate ?? 0,
        blockReward: zcashStatsData.blockReward ?? 0,
        blockTime: zcashStatsData.blockTime ?? 0,
        difficultyRetarget: zcashStatsData.difficultyRetarget ?? 0,
        volume: zcashStatsData.volume ?? 0,
        price: zcashStatsData.price ?? 0,
      });
    }

    if (coin.name === "Dogecoin" && dogecoinStatsData) {
      Object.assign(coin, {
        blockCount: dogecoinStatsData.blockCount ?? 0,
        difficulty: dogecoinStatsData.difficulty ?? 0,
        networkHashrate: dogecoinStatsData.networkHashrate ?? 0,
        blockReward: dogecoinStatsData.blockReward ?? 0,
        blockTime: dogecoinStatsData.blockTime ?? 0,
        difficultyRetarget: dogecoinStatsData.difficultyRetarget ?? 0,
        volume: dogecoinStatsData.volume ?? 0,
        price: dogecoinStatsData.price ?? 0,
      });
    }
  }

  return (
    <Suspense fallback={<MiningPageShimmer />}>
      <MiningPageClient coins={coins} />
    </Suspense>
  );
}
