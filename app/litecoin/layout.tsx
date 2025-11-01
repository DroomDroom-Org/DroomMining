import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Litecoin Mining – Difficulty, Hashrate & Price Charts | DroomDroom",
  description:
    "Live Litecoin mining stats: difficulty, network hashrate, block reward, price chart, and profitability calculator. Track historical trends and mining rewards in real-time.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/litecoin/mining",
    siteName: "Mining Profit Calculator – DroomDroom",
    title: "Litecoin Mining Dashboard – Live Difficulty & Hashrate",
    description:
      "Real-time litecoin difficulty, hashrate, block reward, price charts, and mining calculator.",
    images: [
      {
        url: "/mining/og-litecoin-mining.jpg",
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
    title: "Litecoin Mining Live Stats & Calculator | DroomDroom",
    description:
      "Track real-time Litecoin difficulty, hashrate, price, and mining profitability instantly.",
    images: ["/mining/og-litecoin-mining.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/litecoin/mining",
  },
};

export default function LitecoinMiningLayout({
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