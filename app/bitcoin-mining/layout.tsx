import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitcoin Mining – Difficulty, Hashrate & Price Charts | DroomDroom",
  description:
    "Live Bitcoin mining stats: difficulty, network hashrate, block reward, price chart, and profitability calculator. Track historical trends and mining rewards in real-time.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/bitcoin/mining",
    siteName: "Mining Profit Calculator – DroomDroom",
    title: "Bitcoin Mining Dashboard – Live Difficulty & Hashrate",
    description:
      "Real-time Bitcoin difficulty, hashrate, block reward, price charts, and mining calculator.",
    images: [
      {
        url: "/mining/og-bitcoin-mining.jpg",
        width: 1200,
        height: 630,
        alt: "Bitcoin Mining – Live Difficulty & Hashrate",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@droomdroom",
    creator: "@droomdroom",
    title: "Bitcoin Mining Live Stats & Calculator | DroomDroom",
    description:
      "Track Bitcoin difficulty, hashrate, price, and mining profitability instantly.",
    images: ["/mining/og-bitcoin-mining.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/bitcoin/mining",
  },
};

export default function BitcoinMiningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}