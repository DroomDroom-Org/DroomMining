import { NextRequest, NextResponse } from 'next/server';
import { bitcoinHalvingFaqs } from '@/constants/bitcoin';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({
            data: bitcoinHalvingFaqs,
        });
    } catch (error) {
        console.error('Critical error in halving faq api:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch halving faq',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 503 }
        );
    }
}