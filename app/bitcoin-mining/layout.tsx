import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Crypto Mining Statistics for Bitcoin (BTC)",
  description:
    "Track real-time mining statistics of Bitcoin (BTC) with clear data, performance trends, and insights to support better mining decisions.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://droomdroom.com/bitcoin-mining",
    siteName: "Live Crypto Mining Statistics for Bitcoin (BTC)",
    title: "Live Crypto Mining Statistics for Bitcoin (BTC)",
    description:
      "Track real-time mining statistics of Bitcoin (BTC) with clear data, performance trends, and insights to support better mining decisions.",
    images: [
      {
        url: "https://bucket.droomdroom.online/eventbucket/1763144814180-Mining-statistics-Bitcoin.png",
        width: 1200,
        height: 630,
        alt: "Live Crypto Mining Statistics for Bitcoin (BTC)",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@droomdroom",
    creator: "@droomdroom",
    title: "Live Crypto Mining Statistics for Bitcoin (BTC)",
    description:
      "Track real-time mining statistics of Bitcoin (BTC) with clear data, performance trends, and insights to support better mining decisions.",
    images: ["https://bucket.droomdroom.online/eventbucket/1763144814180-Mining-statistics-Bitcoin.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://droomdroom.com/bitcoin-mining",
  },
};

export default function BitcoinMiningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
