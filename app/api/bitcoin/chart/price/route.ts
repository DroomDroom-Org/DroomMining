import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const BASE_URL = 'https://api.blockchain.info/charts/market-price';
const validTimespans = new Set(['all', '1year', '6months', '3months', '1months', '7days', '1days']);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let timespan = searchParams.get('timespan') || 'all';

    if (!validTimespans.has(timespan)) {
      timespan = 'all';
    }

    const url = `${BASE_URL}?timespan=${timespan}&format=json`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || !Array.isArray(data.values)) {
      throw new Error('Invalid response format from blockchain.info');
    }

    return NextResponse.json({ data: data.values });
  } catch (error) {
    console.error('Error in market-price API:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch market price data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}