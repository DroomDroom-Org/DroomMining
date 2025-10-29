import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const endpoints = {
  blockCount: 'https://blockchain.info/q/getblockcount',
  difficulty: 'https://blockchain.info/q/getdifficulty',
  networkHashrate: 'https://mempool.space/api/v1/mining/hashrate/24h',
  volume: 'https://blockchain.info/q/totalbc',
  price: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
} as const;

const DIFFICULTY_RETARGET = 2016;
const BLOCK_TIME_TARGET = 600;

function getBlockReward(blockCount: number): number {
  const halvings = Math.floor(blockCount / 210_000);
  const initialReward = 50;
  return initialReward / Math.pow(2, halvings);
}

async function fetchValue(url: string, name: string): Promise<number> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    if (name === 'price' || name === 'networkHashrate') {
      const data = await res.json();

      if (name === 'price') {
        const price = data?.bitcoin?.usd;
        if (typeof price !== 'number' || price < 0) {
          throw new Error(`Invalid price data: ${JSON.stringify(data)}`);
        }
        return price;
      }

      if (name === 'networkHashrate') {
        const current = (data as any).currentHashrate;
        if (typeof current === 'number' && current > 0) {
          return current;
        }

        const hashrates = (data as any).hashrates;
        if (Array.isArray(hashrates) && hashrates.length > 0) {
          const latest = hashrates[hashrates.length - 1];
          if (typeof latest.avgHashrate === 'number' && latest.avgHashrate > 0) {
            return latest.avgHashrate;
          }
        }

        throw new Error('No valid hashrate found in response');
      }
    }

    const text = await res.text();
    const value = parseFloat(text);

    if (isNaN(value) || value < 0) {
      throw new Error(`Invalid numeric response: ${text}`);
    }

    return value;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Failed to fetch ${name}: ${message}`);
  }
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
    const [blockCount, difficulty, networkHashrate, volume, price] = await Promise.allSettled([
      fetchValue(endpoints.blockCount, 'blockCount'),
      fetchValue(endpoints.difficulty, 'difficulty'),
      fetchValue(endpoints.networkHashrate, 'networkHashrate'),
      fetchValue(endpoints.volume, 'volume'),
      fetchValue(endpoints.price, 'price'),
    ]).then((results) =>
      results.map((result, i) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          const endpointName = Object.keys(endpoints)[i];
          const errorMsg = result.reason?.message || 'Unknown error';
          errors.push(`${endpointName}: ${errorMsg}`);
          console.warn(`Partial failure in blockchain stats API [${endpointName}]:`, errorMsg);
          return null;
        }
      })
    );


    results.blockCount = blockCount ?? null;
    results.difficulty = difficulty ?? null;
    results.networkHashrate = networkHashrate ?? null;
    results.volume = volume ?? null;
    results.price = price ?? null;

    if (blockCount !== null) {
      results.blockReward = getBlockReward(blockCount);
    }

    const hasAnyData =
      results.blockCount !== null ||
      results.difficulty !== null ||
      results.networkHashrate !== null ||
      results.volume !== null ||
      results.price !== null;

    const status = hasAnyData && errors.length > 0 ? 206 : hasAnyData ? 200 : 503;

    return NextResponse.json(
      {
        data: results,
        warnings: errors.length > 0 ? errors : undefined,
      },
      { status }
    );
  } catch (error) {
    console.error('Critical error in blockchain stats API:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch blockchain statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
        data: results,
      },
      { status: 503 }
    );
  }
}