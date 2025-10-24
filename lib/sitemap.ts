import { prisma } from './prisma';

const generateCoinMiningUrl = (name: string) => {
  return `/mining/${name}`;
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

export async function generateCryptoCoinsSitemaps() {
  try {
    // First get all asset basepaths for the first sitemap
    const assetBasepaths = await prisma.coin.findMany({
      select: {
        name: true
      },
      distinct: ['name'],
    });

    const availableBasepaths = assetBasepaths
      .map(asset => asset.name)
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

    const coins = await prisma.coin.findMany({
      select: {
        id: true,
        name: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const totalCoinChunks = Math.ceil(coins.length / CHUNK_SIZE);
    const sitemaps = [{ index: 1, content: firstSitemap }];

    for (let i = 0; i < totalCoinChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = start + CHUNK_SIZE;
      const chunk = coins.slice(start, end);

      if (chunk.length > 0) {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk.map(coin => `  <url>
    <loc>${escapeXml(`${SITE_URL}${generateCoinMiningUrl(coin.name)}`)}</loc>
    <lastmod>${coin.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

        sitemaps.push({
          index: i + 2,
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