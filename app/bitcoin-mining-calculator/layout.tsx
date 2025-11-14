import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Mining Profit Calculator for Bitcoin (BTC)",
  description:
    "Calculate mining profitability instantly with accurate estimates for Bitcoin (BTC), helping you plan smarter and optimize returns.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://droomdroom.com/bitcoin-mining-calculator",
    siteName: "DroomDroom",
    title: "Crypto Mining Profit Calculator for Bitcoin (BTC)",
    description:
      "Calculate mining profitability instantly with accurate estimates for Bitcoin (BTC), helping you plan smarter and optimize returns.",
    images: [
      {
        url: "https://bucket.droomdroom.online/eventbucket/1763144738980-Mining-Calculator-Bitcoin.png",
        width: 1200,
        height: 630,
        alt: "Crypto Mining Profit Calculator for Bitcoin (BTC)",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@droomdroom",
    creator: "@droomdroom",
    title: "Crypto Mining Profit Calculator for Bitcoin (BTC)",
    description:
      "Calculate mining profitability instantly with accurate estimates for Bitcoin (BTC), helping you plan smarter and optimize returns.",
    images: [
      "https://bucket.droomdroom.online/eventbucket/1763144738980-Mining-Calculator-Bitcoin.png",
    ],
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
    canonical: "https://droomdroom.com/bitcoin-mining-calculator",
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
