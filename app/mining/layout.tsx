import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Mining Profit Calculator",
    default: "Mining Profit Calculator | DroomDroom",
  },
  description:
    "Estimate mining profitability for Bitcoin, Zcash, Litecoin, and Monero. Compare hash rates, power usage, mining difficulty, and rewards in real-time to maximize crypto mining profits.",
  icons: {
    icon: "/mining/favicon.png",
    shortcut: "/mining/favicon.png",
    apple: "/mining/favicon-192x192.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_URL || "https://droomdroom.com"
  ),
  openGraph: {
    type: "website",
    siteName: "Mining Profit Calculator",
    title: "Crypto Mining Profit Calculator",
    description:
      "Mining earnings calculator for Bitcoin (BTC), Zcash (ZEC), Litecoin (LTC), and Monero (XMR). Track mining rewards, difficulty, hash power, and costs with real-time data.",
    images: [
      {
        url: "/mining/mining-calculator-og.jpg",
        width: 1200,
        height: 630,
        alt: "Crypto Mining Profit Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@droomdroom",
    creator: "@droomdroom",
    title: "Crypto Mining Profit Calculator | DroomDroom",
    description:
      "Calculate mining profitability across Bitcoin, Zcash, Litecoin, and Monero using hash power, difficulty, and energy costs.",
    images: ["/mining/mining-calculator-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MiningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
