import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Crypto Mining Statistics for Dogecoin  (DOGE)",
  description:
    "Track real-time mining statistics of Dogecoin (DOGE) with clear data, performance trends, and insights to support better mining decisions.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://droomdroom.com/dogecoin-mining",
    siteName: "DroomDroom",
    title: "Live Crypto Mining Statistics for Dogecoin  (DOGE)",
    description:
      "Track real-time mining statistics of Dogecoin (DOGE) with clear data, performance trends, and insights to support better mining decisions.",
    images: [
      {
        url: "https://bucket.droomdroom.online/pricebucket/og-images/coin-74-1763126118964.png",
        width: 1200,
        height: 630,
        alt: "Dogecoin Mining – Live Difficulty & Hashrate",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@droomdroom",
    creator: "@droomdroom",
    title: "Live Crypto Mining Statistics for Dogecoin  (DOGE)",
    description:
      "Track real-time mining statistics of Dogecoin (DOGE) with clear data, performance trends, and insights to support better mining decisions.",
    images: [
      "https://bucket.droomdroom.online/pricebucket/og-images/coin-74-1763126118964.png",
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://droomdroom.com/dogecoin-mining",
  },
};

export default function DogecoinMiningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
