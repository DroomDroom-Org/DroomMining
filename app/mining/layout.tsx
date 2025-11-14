import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Crypto Mining Statistics, Calculators & Live Insights",
    default: "Crypto Mining Statistics, Calculators & Live Insights",
  },
  description:
    "Explore expert mining guides, real-time insights, calculators, and essential tools to help you mine smarter and boost long-term efficiency.",
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
    siteName: "Crypto Mining Statistics, Calculators & Live Insights",
    title: "Crypto Mining Statistics, Calculators & Live Insights",
    description:
      "Explore expert mining guides, real-time insights, calculators, and essential tools to help you mine smarter and boost long-term efficiency.",
    images: [
      {
        url: "https://bucket.droomdroom.online/eventbucket/1763124785199-219bd33b-177f-4987-9e3a-5ba52207265f.jpg",
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
    title: "Crypto Mining Statistics, Calculators & Live Insights",
    description:
      "Explore expert mining guides, real-time insights, calculators, and essential tools to help you mine smarter and boost long-term efficiency.",
    images: [
      "https://bucket.droomdroom.online/eventbucket/1763124785199-219bd33b-177f-4987-9e3a-5ba52207265f.jpg",
    ],
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
