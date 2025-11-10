import { NextRequest, NextResponse } from 'next/server';
import { bitcoinCalculatorFaqs } from '@/constants/bitcoin';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({
            data: bitcoinCalculatorFaqs,
        });
    } catch (error) {
        console.error('Critical error in calculator faq api:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch calculator faq',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 503 }
        );
    }
}