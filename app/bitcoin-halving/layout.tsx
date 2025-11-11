import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Bitcoin Halving 2028 Countdown – Next BTC Halving Date & History | DroomDroom",
  description:
    "Live Bitcoin Halving countdown to 2028. Track blocks remaining, reward drop from 3.125 to 1.5625 BTC, past halvings, price impact, and FAQs. Updated every second.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/bitcoin-halving",
    siteName: "DroomDroom",
    title: "Bitcoin Halving 2028 Countdown – Live Tracker",
    description:
      "Real-time countdown to the next Bitcoin halving in 2028. See blocks left, reward reduction, historical data, and price impact.",
    images: [
      {
        url: "/halving/og-bitcoin-halving.jpg",
        width: 1200,
        height: 630,
        alt: "Bitcoin Halving 2028 – Live Countdown & History",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@droomdroom",
    creator: "@droomdroom",
    title: "Bitcoin Halving 2028 Countdown | DroomDroom",
    description:
      "Live tracker for the next Bitcoin halving event. Blocks remaining, reward drop, and historical halvings.",
    images: ["/halving/og-bitcoin-halving.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/bitcoin-halving",
  },
};

export default function BitcoinHalvingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
