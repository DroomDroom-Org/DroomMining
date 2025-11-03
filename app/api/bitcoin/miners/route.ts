import { NextRequest, NextResponse } from 'next/server';
import { bitcoinMiners } from '@/constants/bitcoin';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      data: bitcoinMiners,
    });
  } catch (error) {
    console.error('Critical error in blockchain stats API:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch blockchain statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}