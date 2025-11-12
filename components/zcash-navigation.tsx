"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "https://droomdroom.com/mining" },
  { name: "Zcash Mining", href: "https://droomdroom.com/zcash-mining" },
  {
    name: "Zcash Mining Calculator",
    href: "https://droomdroom.com/zcash-mining-calculator",
  },
];

export default function ZcashNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="border-b flex items-center space-x-6 py-3 overflow-x-auto">
        {navItems.map((item) => {
          let hrefPath: string;
          try {
            hrefPath = new URL(item.href).pathname;
          } catch {
            hrefPath = item.href;
          }

          const isActive = pathname === hrefPath;

          return (
            <Link
              key={item.name}
              href={item.href}
              target={item.href}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "text-zcash"
                  : "text-foreground hover:text-muted-foreground"
              )}
            >
              {item.name}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-zcash"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
