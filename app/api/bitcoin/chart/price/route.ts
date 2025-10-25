import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';


const BASE_URL = 'https://api.blockchain.info/charts/market-price';
const validTimespans = new Set(['all', '1year', '6months', '3months', '1months', '7days', '1days']);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let timespan = searchParams.get('timespan') || 'all';
  if (!validTimespans.has(timespan)) timespan = 'all';

  const url = `${BASE_URL}?timespan=${timespan}&format=json`;
  const res = await fetch(url);
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch price data' }, { status: 500 });
  const data = await res.json();
  return NextResponse.json(data);
}
