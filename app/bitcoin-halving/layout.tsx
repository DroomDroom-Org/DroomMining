import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitcoin Halving Explained: Timeline, Impact & Key Insights",
  description:
    "Get a clear breakdown of Bitcoin halving, including dates, impact on supply, and market insights to help you prepare confidently.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://droomdroom.com/bitcoin-halving",
    siteName: "DroomDroom",
    title: "Bitcoin Halving Explained: Timeline, Impact & Key Insights",
    description:
      "Get a clear breakdown of Bitcoin halving, including dates, impact on supply, and market insights to help you prepare confidently.",
    images: [
      {
        url: "https://bucket.droomdroom.online/eventbucket/1763144972462-28f954c2-ee9c-4a9f-9739-44a57beaaa8c.jpg",
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
    title: "Bitcoin Halving Explained: Timeline, Impact & Key Insights",
    description:
      "Get a clear breakdown of Bitcoin halving, including dates, impact on supply, and market insights to help you prepare confidently.",
    images: [
      "https://bucket.droomdroom.online/eventbucket/1763144972462-28f954c2-ee9c-4a9f-9739-44a57beaaa8c.jpg",
    ],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://droomdroom.com/bitcoin-halving",
  },
};

export default function BitcoinHalvingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
