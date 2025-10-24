import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const heightRes = await fetch('https://blockstream.info/api/blocks/tip/height', {
    });
    if (!heightRes.ok) throw new Error('Failed to fetch block height');
    const heightText = await heightRes.text(); 
    const height = parseInt(heightText.trim(), 10);
    if (isNaN(height)) throw new Error('Invalid block height');

    const blockRes = await fetch(`https://blockstream.info/api/block-height/${height}`, {
    });
    if (!blockRes.ok) throw new Error('Failed to fetch block data');
    const blockData = await blockRes.json();

    let globalHashrate = 0;
    try {
      const hashrateRes = await fetch(
        'https://blockchain.info/charts/hash-rate?timespan=1hour&format=json',
        { next: { revalidate: 300 } }
      );
      if (hashrateRes.ok) {
        const hashrateData = await hashrateRes.json();
        const latest = hashrateData.values?.[0]?.y;
        if (latest) globalHashrate = latest / 1_000_000; 
      }
    } catch (e) {
      console.warn('Hashrate fetch failed');
    }

    const subsidy = 50 >> Math.floor(height / 210000);
    const blockReward = Number((subsidy / 1).toFixed(8));

    const responseData = {
      blockHeight: height,
      difficulty: blockData.difficulty,
      blockReward,
      globalHashrate: Number(globalHashrate.toFixed(2)),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Bitcoin Stats API Error:', error);

    return NextResponse.json(
      {
        blockHeight: 920545,
        difficulty: 146716052770110,
        blockReward: 3.125,
        globalHashrate: 1145.71,
        timestamp: new Date().toISOString(),
        error: 'API failed, using fallback',
      },
      { status: 200 }
    );
  }
}