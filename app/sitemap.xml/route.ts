import { NextRequest, NextResponse } from 'next/server';
import { generateCryptoExchangesSitemaps, generateSitemapIndex } from '@/lib/sitemap';

export async function GET(request: NextRequest) {
  try {
    // Generate all sitemaps to determine how many we have
    const sitemaps = await generateCryptoExchangesSitemaps();
    
    // Create a list of just the sitemap indexes
    const sitemapIndexes = sitemaps.map(sitemap => ({
      index: sitemap.index
    }));
    
    // Ensure we have at least two sitemaps: one for static pages, one for Crypto Exchanges
    // This is a safeguard in case we have very few Crypto Exchanges
    if (sitemapIndexes.length === 1) {
        sitemapIndexes.push({
        index: 2 // Add a second sitemap index for Crypto Exchanges
      });
    }
    
    // Generate the sitemap index
    const sitemapIndex = generateSitemapIndex(sitemapIndexes);
    
    // Return the sitemap index content
    return new NextResponse(sitemapIndex, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    return NextResponse.json(
      { error: 'Error generating sitemap index' },
      { status: 500 }
    );
  }
} 