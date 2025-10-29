import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const BLOCK_TIME_TARGET = 85;
const DIFFICULTY_RETARGET = 1;

const endpoints = {
  blockCount: 'https://go.getblock.io/bcc1538aba074eddb8fc0f7f4957610c/',
  minerstat: 'https://api.minerstat.com/v2/coins?list=ZEC',
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
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'getblockcount',
      params: [],
      id: 'getblock.io',
    }),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  if (typeof data.result !== 'number') throw new Error('Invalid block count');

  return data.result;
}

async function fetchMinerstat(): Promise<MinerstatResponse> {
  const res = await fetch(endpoints.minerstat, {
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data: MinerstatResponse[] = await res.json();
  const zec = data.find((c) => c.coin === 'ZEC');
  if (!zec) throw new Error('ZEC not found in minerstat response');

  return zec;
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
    console.error('Critical error in ZEC stats API:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Zcash statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
        data: results,
      },
      { status: 503 }
    );
  }
}