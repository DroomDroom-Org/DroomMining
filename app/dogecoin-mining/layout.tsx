import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dogecoin Mining – Difficulty, Hashrate & Price Charts | DroomDroom",
  description:
    "Live Dogecoin mining stats: difficulty, network hashrate, block reward, price chart, and profitability calculator. Track historical trends and mining rewards in real-time.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/dogecoin/mining",
    siteName: "Mining Profit Calculator – DroomDroom",
    title: "Dogecoin Mining Dashboard – Live Difficulty & Hashrate",
    description:
      "Real-time Dogecoin difficulty, hashrate, block reward, price charts, and mining calculator.",
    images: [
      {
        url: "/mining/og-dogecoin-mining.jpg",
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
    title: "Dogecoin Mining Live Stats & Calculator | DroomDroom",
    description:
      "Track real-time Dogecoin difficulty, hashrate, price, and mining profitability instantly.",
    images: ["/mining/og-dogecoin-mining.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/dogecoin/mining",
  },
};

export default function DogecoinMiningLayout({
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