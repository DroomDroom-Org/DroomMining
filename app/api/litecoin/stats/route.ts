import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const BLOCK_TIME_TARGET = 170;
const DIFFICULTY_RETARGET = 2016;

const endpoints = {
  blockCount: 'https://api.blockcypher.com/v1/ltc/main',
  minerstat: 'https://api.minerstat.com/v2/coins?list=LTC',
} as const;

interface MinerstatResponse {
  id: string;
  coin: string;
  name: string;
  type: string;
  algorithm: string;
  network_hashrate: number;
  difficulty: number;
  reward: number;
  reward_unit: string;
  reward_block: number;
  price: number;
  volume: number;
  updated: number;
}

async function fetchBlockCount(): Promise<number> {
  const res = await fetch(endpoints.blockCount, {
    method: 'GET',
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  if (typeof data.height !== 'number') throw new Error('Invalid block count');

  return data.height;
}


async function fetchMinerstat(): Promise<MinerstatResponse> {
  const res = await fetch(endpoints.minerstat, {
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data: MinerstatResponse[] = await res.json();
  const ltc = data.find((c) => c.coin === 'LTC');
  if (!ltc) throw new Error('LTC not found in minerstat response');

  return ltc;
}

export async function GET(request: NextRequest) {
  const results = {
    blockCount: null as number | null,
    difficulty: null as number | null,
    networkHashrate: null as number | null,
    blockReward: null as number | null,
    blockTime: BLOCK_TIME_TARGET,
    difficultyRetarget: DIFFICULTY_RETARGET,
    volume: null as number | null,
    price: null as number | null,
  };

  const errors: string[] = [];

  try {
    const [blockCountRes, minerstatRes] = await Promise.allSettled([
      fetchBlockCount(),
      fetchMinerstat(),
    ]);

    // Handle block count
    if (blockCountRes.status === 'fulfilled') {
      results.blockCount = blockCountRes.value;
    } else {
      errors.push(`blockCount: ${blockCountRes.reason?.message || 'Unknown error'}`);
      console.warn('Failed to fetch block count:', blockCountRes.reason);
    }

    let minerstatData: MinerstatResponse | null = null;
    if (minerstatRes.status === 'fulfilled') {
      minerstatData = minerstatRes.value;
      results.difficulty = minerstatData.difficulty;
      results.networkHashrate = minerstatData.network_hashrate;
      results.blockReward = minerstatData.reward_block;
      results.volume = minerstatData.volume;
      results.price = minerstatData.price;
    } else {
      errors.push(`minerstat: ${minerstatRes.reason?.message || 'Unknown error'}`);
      console.warn('Failed to fetch minerstat data:', minerstatRes.reason);
    }

    const hasAnyData = Object.values(results).some((v) => v !== null);
    const status = hasAnyData && errors.length > 0 ? 206 : hasAnyData ? 200 : 503;

    return NextResponse.json(
      {
        data: results,
        warnings: errors.length > 0 ? errors : undefined,
      },
      { status }
    );
  } catch (error) {
    console.error('Critical error in LTC stats API:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Litecoin statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
        data: results,
      },
      { status: 503 }
    );
  }
}