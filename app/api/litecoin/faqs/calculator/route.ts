import { NextRequest, NextResponse } from 'next/server';
import { litecoinCalculatorFaqs } from '@/constants/litecoin';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({
            data: litecoinCalculatorFaqs,
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