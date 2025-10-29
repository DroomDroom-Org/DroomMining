import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zcash Mining – Difficulty, Hashrate & Price Charts | DroomDroom",
  description:
    "Live Zcash mining stats: difficulty, network hashrate, block reward, price chart, and profitability calculator. Track historical trends and mining rewards in real-time.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/zcash/mining",
    siteName: "Mining Profit Calculator – DroomDroom",
    title: "Zcash Mining Dashboard – Live Difficulty & Hashrate",
    description:
      "Real-time zcash difficulty, hashrate, block reward, price charts, and mining calculator.",
    images: [
      {
        url: "/mining/og-zcash-mining.jpg",
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
    title: "Zcash Mining Live Stats & Calculator | DroomDroom",
    description:
      "Track real-time zcash difficulty, hashrate, price, and mining profitability instantly.",
    images: ["/mining/og-zcash-mining.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/zcash/mining",
  },
};

export default function ZcashMiningLayout({
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