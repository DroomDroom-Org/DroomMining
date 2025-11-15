import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const BLOCK_TIME_TARGET = 60;
const DIFFICULTY_RETARGET = 1;

const GETBLOCK_RPC_URL = 'https://go.getblock.io/a398275bd313417cbbc04dab6e85b9bf';
const MINERSTAT_URL = 'https://api.minerstat.com/v2/coins?list=DOGE';

interface GetMiningInfoResult {
  blocks: number;
  difficulty: number;
  networkhashps: number;
  chain?: string;
}
interface MinerstatCoin {
  coin: string;
  price: number;
  volume: number;
}
interface Results {
  blockCount: number | null;
  difficulty: number | null;
  networkHashrate: number | null;   
  blockReward: number;            
  blockTime: number;
  difficultyRetarget: number;
  volume: number | null;
  price: number | null;
}

async function fetchGetBlockMiningInfo(): Promise<GetMiningInfoResult> {
  const res = await fetch(GETBLOCK_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'getmininginfo',
      params: [],
      id: 'dogestats-api',
    }),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`GetBlock HTTP ${res.status}`);

  const payload = await res.json();
  if (payload.error) throw new Error(`RPC error: ${payload.error.message ?? JSON.stringify(payload.error)}`);
  if (!payload.result) throw new Error('No result from GetBlock');

  return payload.result;
}

async function fetchMinerstatPriceVolume(): Promise<{ price: number; volume: number }> {
  const res = await fetch(MINERSTAT_URL, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Minerstat HTTP ${res.status}`);

  const list: MinerstatCoin[] = await res.json();
  const doge = list.find((c) => c.coin === 'DOGE');
  if (!doge) throw new Error('DOGE entry missing in Minerstat response');

  return { price: doge.price, volume: doge.volume };
}

export async function GET(_req: NextRequest) {
  const results: Results = {
    blockCount: null,
    difficulty: null,
    networkHashrate: null,
    blockReward: 10_000,             
    blockTime: BLOCK_TIME_TARGET,
    difficultyRetarget: DIFFICULTY_RETARGET,
    volume: null,
    price: null,
  };

  const warnings: string[] = [];

  const [rpcRes, minerstatRes] = await Promise.allSettled([
    fetchGetBlockMiningInfo(),
    fetchMinerstatPriceVolume(),
  ]);

  if (rpcRes.status === 'fulfilled') {
    const info = rpcRes.value;
    results.blockCount = info.blocks;
    results.difficulty = info.difficulty;
    results.networkHashrate = info.networkhashps;

    if (info.chain && info.chain !== 'main') {
      warnings.push(`Connected to ${info.chain} chain (expected main)`);
    }
  } else {
    const msg = rpcRes.reason?.message ?? 'unknown';
    warnings.push(`GetBlock RPC failed: ${msg}`);
    console.warn('GetBlock RPC error →', rpcRes.reason);
  }

  if (minerstatRes.status === 'fulfilled') {
    results.price = minerstatRes.value.price;
    results.volume = minerstatRes.value.volume;
  } else {
    const msg = minerstatRes.reason?.message ?? 'unknown';
    warnings.push(`Minerstat price/volume failed: ${msg}`);
    console.warn('Minerstat error →', minerstatRes.reason);
  }

  const hasCoreData = results.blockCount !== null && results.difficulty !== null && results.networkHashrate !== null;
  const status = hasCoreData
    ? warnings.length > 0
      ? 206   
      : 200  
    : 503;  

  return NextResponse.json(
    {
      data: results,
      warnings: warnings.length ? warnings : undefined,
    },
    { status }
  );
}