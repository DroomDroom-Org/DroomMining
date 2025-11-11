"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import CompoundCustomLink from "./custom-link";

const navItems = [
  { name: "Litecoin Mining", href: "/litecoin-mining" },
  { name: "Litecoin Mining Calculator", href: "/litecoin-mining-calculator" },
];

export default function LitecoinNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="border-b flex items-center  space-x-6 py-4 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <CompoundCustomLink
              key={item.name}
              href={item.href}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "text-litecoin"
                  : "text-foreground hover:text-muted-foreground"
              )}
            >
              {item.name}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-litecoin"
                  aria-hidden="true"
                />
              )}
            </CompoundCustomLink>
          );
        })}
      </div>
    </nav>
  );
}
