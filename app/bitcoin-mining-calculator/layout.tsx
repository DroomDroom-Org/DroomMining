import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitcoin Mining Calculator – Live Profitability & ROI",
  description:
    "Calculate Bitcoin mining profit in real-time. Enter hashrate, power, and electricity cost. Auto-fill with top ASIC miners. See daily BTC, revenue, ROI, and break-even time.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://droomdroom.com/mining/bitcoin/calculator",
    siteName: "DroomDroom",
    title: "Bitcoin Mining Calculator – Live Profitability & ROI",
    description:
      "Calculate Bitcoin mining profit in real-time. Enter hashrate, power, and electricity cost. Auto-fill with top ASIC miners. See daily BTC, revenue, ROI, and break-even time.",
    images: [
      {
        url: "https://droomdroom.com/mining/og-bitcoin-mining-calculator.jpg",
        width: 1200,
        height: 630,
        alt: "Bitcoin Mining Calculator – Live Profit & ROI Tracker",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@droomdroom",
    creator: "@droomdroom",
    title: "Bitcoin Mining Calculator – Live Profitability & ROI",
    description:
      "Calculate Bitcoin mining profit in real-time. Enter hashrate, power, and electricity cost. Auto-fill with top ASIC miners. See daily BTC, revenue, ROI, and break-even time.",
    images: ["https://droomdroom.com/mining/og-bitcoin-mining-calculator.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://droomdroom.com/mining/bitcoin/calculator",
  },

  metadataBase: new URL("https://droomdroom.com"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function BitcoinCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
