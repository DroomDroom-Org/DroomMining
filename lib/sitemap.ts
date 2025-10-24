import { prisma } from './prisma';

const generateExchangeUrl = (slug: string) => {
  return `/crypto-exchanges/${slug}`;  
};

const CHUNK_SIZE = 200;
const SITE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.droomdroom.com';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Function to escape XML special characters
const escapeXml = (unsafe: string) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

export async function generateCryptoExchangesSitemaps() {
  try {
    // First get all asset basepaths for the first sitemap
    const assetBasepaths = await prisma.exchange.findMany({
      select: {
        slug: true
      },
      distinct: ['slug'], 
    });

  const availableBasepaths = assetBasepaths
    .map(asset => asset.slug)
    .filter(Boolean) as string[];

  // Generate first sitemap with static pages and asset category pages
  const firstSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${escapeXml(`${SITE_URL}${BASE_PATH}`)}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- BASE Asset Category Pages -->
  ${availableBasepaths.map(basePath => `
  <url>
    <loc>${escapeXml(`${SITE_URL}${BASE_PATH}/${basePath}`)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`;

  // Get all live Exchanges
  const exchanges = await prisma.exchange.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      updatedAt: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  // Calculate number of chunks needed for Exchanges
  const totalExchangeChunks = Math.ceil(exchanges.length / CHUNK_SIZE);
  // Initialize the sitemaps array with the first sitemap (static pages)
  const sitemaps = [{ index: 1, content: firstSitemap }];

  // Generate each Exchange chunk starting at index 2
    for (let i = 0; i < totalExchangeChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;
    const chunk = exchanges.slice(start, end);

    // Only create a sitemap if we have Exchanges in this chunk
    if (chunk.length > 0) {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk.map(exchange => `  <url>
    <loc>${escapeXml(`${SITE_URL}${generateExchangeUrl(exchange.slug)}`)}</loc>
    <lastmod>${exchange.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

      sitemaps.push({
        index: i + 2, // Start Exchange sitemaps at index 2
        content: sitemap
      });
    }
  }

  return sitemaps;
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    // Return a minimal sitemap with just the homepage in case of error
    return [{
      index: 1,
      content: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(`${SITE_URL}${BASE_PATH}`)}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
    }];
  }
}

export function generateSitemapIndex(sitemaps: { index: number }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${escapeXml(`${SITE_URL}/sitemap/${sitemap.index}.xml`)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
}

// // Function to mark an event for static generation
// export async function markEventForStaticGeneration(eventId: string) {
//   await prisma.event.update({
//     where: { id: eventId },
//     data: {
//       isStaticGenerated: true,
//       lastStaticGenerated: new Date()
//     }
//   });
// }

// // Function to check if an event needs static generation
// export async function needsStaticGeneration(eventId: string) {
//   const event = await prisma.event.findUnique({
//     where: { id: eventId },
//     select: {
//       isStaticGenerated: true,
//       lastStaticGenerated: true,
//       updatedAt: true
//     }
//   });

//   if (!event) return false;

//   // If never generated or updated after last generation
//   return !event.isStaticGenerated || 
//          (event.lastStaticGenerated && event.updatedAt > event.lastStaticGenerated);
// } 