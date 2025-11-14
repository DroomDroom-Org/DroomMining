import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Mining Profit Calculator for Zcash (ZEC)",
  description:
    "Calculate mining profitability instantly with accurate estimates for Zcash (ZEC), helping you plan smarter and optimize returns.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://droomdroom.com/zcash-mining-calculator",
    siteName: "DroomDroom",
    title: "Crypto Mining Profit Calculator for Zcash (ZEC)",
    description:
      "Calculate mining profitability instantly with accurate estimates for Zcash (ZEC), helping you plan smarter and optimize returns.",
    images: [
      {
        url: "https://bucket.droomdroom.online/pricebucket/og-images/coin-1437-1763126118964.png",
        width: 1200,
        height: 630,
        alt: "Zcash Mining Calculator – Live Profit & ROI Tracker",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@droomdroom",
    creator: "@droomdroom",
    title: "Crypto Mining Profit Calculator for Zcash (ZEC)",
    description:
      "Calculate mining profitability instantly with accurate estimates for Zcash (ZEC), helping you plan smarter and optimize returns.",
    images: [
      "https://bucket.droomdroom.online/pricebucket/og-images/coin-1437-1763126118964.png",
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
    canonical: "https://droomdroom.com/zcash-mining-calculator",
  },

  metadataBase: new URL("https://droomdroom.com"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function ZcashCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
