import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Crypto Mining Statistics for Zcash (ZEC)",
  description:
    "Track real-time mining statistics of Zcash (ZEC) with clear data, performance trends, and insights to support better mining decisions.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://droomdroom.com/zcash-mining",
    siteName: "DroomDroom",
    title: "Live Crypto Mining Statistics for Zcash (ZEC)",
    description:
      "Track real-time mining statistics of Zcash (ZEC) with clear data, performance trends, and insights to support better mining decisions.",
    images: [
      {
        url: "https://bucket.droomdroom.online/eventbucket/1763145406174-Mining-statistics-Zcash.png",
        width: 1200,
        height: 630,
        alt: "Zcash Mining – Live Difficulty & Hashrate",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@droomdroom",
    creator: "@droomdroom",
    title: "Live Crypto Mining Statistics for Zcash (ZEC)",
    description:
      "Track real-time mining statistics of Zcash (ZEC) with clear data, performance trends, and insights to support better mining decisions.",
    images: [
      "https://bucket.droomdroom.online/eventbucket/1763145406174-Mining-statistics-Zcash.png",
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://droomdroom.com/zcash-mining",
  },
};

export default function ZcashMiningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
