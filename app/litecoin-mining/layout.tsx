import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Crypto Mining Statistics for Litecoin (LTC)",
  description:
    "Track real-time mining statistics of Litecoin (LTC) with clear data, performance trends, and insights to support better mining decisions.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://droomdroom.com/litecoin-mining",
    siteName: "DroomDroom",
    title: "Live Crypto Mining Statistics for Litecoin (LTC)",
    description:
      "Track real-time mining statistics of Litecoin (LTC) with clear data, performance trends, and insights to support better mining decisions.",
    images: [
      {
        url: "https://bucket.droomdroom.online/eventbucket/1763145265157-Mining-statistics-Litecoin.png",
        width: 1200,
        height: 630,
        alt: "Litecoin Mining – Live Difficulty & Hashrate",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@droomdroom",
    creator: "@droomdroom",
    title: "Live Crypto Mining Statistics for Litecoin (LTC)",
    description:
      "Track real-time mining statistics of Litecoin (LTC) with clear data, performance trends, and insights to support better mining decisions.",
    images: [
      "https://bucket.droomdroom.online/eventbucket/1763145265157-Mining-statistics-Litecoin.png",
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://droomdroom.com/litecoin-mining",
  },
};

export default function LitecoinMiningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
