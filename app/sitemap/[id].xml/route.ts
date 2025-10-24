import { NextRequest, NextResponse } from 'next/server';
import { generateCryptoCoinsSitemaps } from '@/lib/sitemap';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params?.id;
    if (!rawId) {
      return NextResponse.json({ error: 'Sitemap id is required' }, { status: 400 });
    }
    const sitemapId = parseInt(rawId, 10);
    
    if (isNaN(sitemapId) || sitemapId < 1) {
      return NextResponse.json(
        { error: 'Invalid sitemap ID' },
        { status: 400 }
      );
    }
    
    // Generate all sitemaps
    let sitemaps = [];
    try {
      sitemaps = await generateCryptoCoinsSitemaps();
    } catch (sitemapError) {
      console.error('Error generating sitemaps:', sitemapError);
      // Return an empty sitemap as fallback
      const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
      
      return new NextResponse(emptySitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
        }
      });
    }
    
    // Find the requested sitemap
    const sitemap = sitemaps.find(s => s.index === sitemapId);
    
    // Special case for index 2 when we have very few Crypto Exchanges
    // This ensures the sitemap index will work properly even if we have few Crypto Exchanges
    if (!sitemap && sitemapId === 2) {
      // Return an empty sitemap for the Crypto Exchanges sitemap when we don't have enough Crypto Exchanges
      const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
      
      return new NextResponse(emptySitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
        }
      });
    }
    
    if (!sitemap) {
      return NextResponse.json(
        { error: 'Sitemap not found' },
        { status: 404 }
      );
    }
    
    // Return the sitemap content
    return new NextResponse(sitemap.content, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json(
      { error: 'Error generating sitemap' },
      { status: 500 }
    );
  }
} 