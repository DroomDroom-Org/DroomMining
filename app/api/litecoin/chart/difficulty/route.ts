import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const BASE_URL = 'https://api.minerstat.com/v2/coins-history';
const validTimespans = new Set(['all', '1year', '6months', '3months', '1months', '7days', '1days']);

function getDataInterval(timespan: string): number {
  const intervals: Record<string, number> = {
    '1days': 300,       
    '7days': 1800,     
    '1month': 7200,    
    '3months': 21600,  
    '6months': 43200, 
    '1year': 86400,    
    'all': 86400,  
  };
  return intervals[timespan] ?? 3600;
}

function getStartTimestamp(timespan: string): number | null {
  const now = Math.floor(Date.now() / 1000);
  const periods: Record<string, number> = {
    '1days': 1 * 24 * 60 * 60,
    '7days': 7 * 24 * 60 * 60,
    '1months': 30 * 24 * 60 * 60,
    '3months': 90 * 24 * 60 * 60,
    '6months': 180 * 24 * 60 * 60,
    '1year': 365 * 24 * 60 * 60,
  };

  return timespan === 'all' ? null : now - (periods[timespan] ?? 0);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let timespan = searchParams.get('timespan')?.toLowerCase() || 'all';

    if (!validTimespans.has(timespan)) {
      timespan = 'all';
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const url = `${BASE_URL}?time=${currentTime}&coin=LTC&algo=Scrypt`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data?.LTC || typeof data.LTC !== 'object') {
      throw new Error('Invalid response format from minerstat API: missing LTC data');
    }

    const startTimestamp = getStartTimestamp(timespan);
    const interval = getDataInterval(timespan);

    const rawPoints = Object.entries(data.LTC).map(([ts, values]) => {
      const timestamp = parseInt(ts, 10);
      const difficulty = Array.isArray(values) ? parseFloat(values[0] as string) : NaN;

      if (isNaN(timestamp) || isNaN(difficulty)) return null;

      return { x: timestamp, y: difficulty };
    }).filter((point): point is { x: number; y: number } => point !== null);

    const filteredPoints = startTimestamp === null
      ? rawPoints
      : rawPoints.filter(p => p.x >= startTimestamp);

    filteredPoints.sort((a, b) => a.x - b.x);

    const groups = new Map<number, number[]>();

    for (const point of filteredPoints) {
      const key = Math.floor(point.x / interval) * interval;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(point.y);
    }

    const difficultyData = Array.from(groups.entries())
      .map(([timestamp, values]) => ({
        x: timestamp,
        y: values.reduce((a, b) => a + b, 0) / values.length,
      }))
      .sort((a, b) => a.x - b.x);

    return NextResponse.json({
      data: difficultyData,
      timespan,
      count: difficultyData.length,
    });
  } catch (error) {
    console.error('Error in difficulty API:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch difficulty data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}