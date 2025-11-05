// @ts-ignore
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/toaster";
import { OrganizationSchema } from "@/components/schema-markup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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

interface RootLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  url: string;
  type: "link";
}

interface Menu {
  text: string;
  url?: string;
  type: "link" | "dropdown";
  items?: MenuItem[];
}

interface Token {
  id: string;
  name: string;
  ticker: string;
  price: number;
  priceChange24h: number;
  imageUrl: string;
}

interface SocialLink {
  text: string;
  url: string;
  iconUrl: string;
  color: string;
}

interface FooterLink {
  text: string;
  url: string;
}

interface FooterData {
  socials: SocialLink[];
  company: FooterLink[];
  "quick-links": FooterLink[];
}

async function fetchMenus(): Promise<Menu[]> {
  try {
    const response = await fetch(
      "https://api.droomdroom.online/api/v1/header-menu",
      {
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch menu items");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

async function fetchFooterData(): Promise<FooterData> {
  try {
    const response = await fetch("https://droomdroom.com/api/v1/footer-menu", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch footer data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return {
      socials: [],
      company: [],
      "quick-links": [],
    };
  }
}

const fetchTokens = async (): Promise<Token[]> => {
  try {
    const response = await fetch(
      `https://droomdroom.com/price/api/marquee-tokens`,
      {
        next: { revalidate: 120 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch marquee tokens: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching marquee tokens:", error);
    return [];
  }
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const [menus, tokens, footerData] = await Promise.all([
    fetchMenus(),
    fetchTokens(),
    fetchFooterData(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <script>
        var clickRankAi = document.createElement("script"); clickRankAi.src =
        "https://js.clickrank.ai/seo/a2f08e6a-dc8a-4b26-849f-098224a52825/script?"
        + new Date().getTime(); clickRankAi.async = true;
        document.head.appendChild(clickRankAi);
      </script>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <OrganizationSchema
            name="Mining Token Calculator - DroomDroom"
            url={process.env.NEXT_PUBLIC_APP_URL || "https://droomdroom.com"}
            logo={`${
              process.env.NEXT_PUBLIC_APP_URL || "https://droomdroom.com"
            }/price/DroomDroom_light.svg`}
            description="Calculate mining profitability for Bitcoin, Zcash, Litecoin, and Monero. Track hash rates, power usage, difficulty, rewards, and earnings in real-time to maximize crypto mining profits."
          />

          <div className="relative flex min-h-screen w-full flex-col antialiased bg-background text-foreground">
            <Header menus={menus} tokens={tokens} />
            <main className="flex-1 w-full">{children}</main>
            <Footer footerData={footerData} />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
