import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';


const endpoints = {
  blockCount: 'https://blockchain.info/q/getblockcount',
  difficulty: 'https://blockchain.info/q/getdifficulty',
  networkHashrate: 'https://blockchain.info/q/hashrate',
  difficultyRetarget: 2016,
  volume: 'https://blockchain.info/q/totalbc',
};

function getBlockReward(blockCount: number): number {
  const halvings = Math.floor(blockCount / 210000);
  const initialReward = 50;
  return initialReward / Math.pow(2, halvings);
}

async function fetchValue(url: string): Promise<number> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch from ${url}`);
  const text = await res.text();
  return parseFloat(text);
}

export async function GET(request: NextRequest) {
  try {
    const [
      blockCount,
      difficulty,
      networkHashrate,
      volume,
    ] = await Promise.all([
      fetchValue(endpoints.blockCount),
      fetchValue(endpoints.difficulty),
      fetchValue(endpoints.networkHashrate),
      fetchValue(endpoints.volume),
    ]);

    const blockReward = getBlockReward(blockCount);

    return NextResponse.json({
      blockCount,
      difficulty,
      networkHashrate,
      blockReward,
      blockTime : 600,
      difficultyRetarget: endpoints.difficultyRetarget,
      volume,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
