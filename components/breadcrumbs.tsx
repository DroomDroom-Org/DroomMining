"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui";
import { usePathname } from "next/navigation";
import CompoundCustomLink from "./custom-link";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname();

  return (
    <FadeIn>
      <nav
        aria-label="Breadcrumb"
        className={cn(
          "flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 tracking-wider",
          className
        )}
      >
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => {
            const isActive = item.href
              ? pathname === item.href
              : index === items.length - 1;
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center">
                {item.href ? (
                  <CompoundCustomLink
                    href={item.href}
                    className={cn(
                      "transition-colors duration-200 font-medium",
                      isActive
                        ? className
                        : "text-foreground hover:text-muted-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                  </CompoundCustomLink>
                ) : (
                  <span
                    className="font-medium text-gray-900 dark:text-white"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.name}
                  </span>
                )}
                {!isLast && (
                  <ChevronRight className="ml-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </FadeIn>
  );
}
