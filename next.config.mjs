/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/mining',
  publicRuntimeConfig: {
    basePath: '/mining',
    apiPath: '/mining/api',
    cmcImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bucket.droomdroom.online',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.png',
      },
      {
        source: '/favicon.ico',
        destination: `${process.env.NEXT_PUBLIC_BASEPATH || '/mining'}/favicon.png`,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
