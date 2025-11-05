"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Container, Flex } from "./ui";
import { FadeIn } from "./ui/animation";
import MarqueeScroll from "./marquee-scroll";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";

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

export default function Header({
  menus,
  tokens,
}: {
  menus: Menu[];
  tokens: Token[];
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({});
  const dropdownTimeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const [hoveringDropdowns, setHoveringDropdowns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    return () => {
      Object.values(dropdownTimeoutRefs.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  const handleThemeToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleDropdownEnter = (menuText: string) => {
    if (dropdownTimeoutRefs.current[menuText]) {
      clearTimeout(dropdownTimeoutRefs.current[menuText]);
      delete dropdownTimeoutRefs.current[menuText];
    }
    setHoveringDropdowns(prev => ({ ...prev, [menuText]: true }));
    setDropdownStates(prev => ({ ...prev, [menuText]: true }));
  };

  const handleDropdownLeave = (menuText: string) => {
    setHoveringDropdowns(prev => ({ ...prev, [menuText]: false }));
    dropdownTimeoutRefs.current[menuText] = setTimeout(() => {
      if (!hoveringDropdowns[menuText]) {
        setDropdownStates(prev => ({ ...prev, [menuText]: false }));
      }
    }, 300);
  };

  const handleDropdownContentEnter = (menuText: string) => {
    if (dropdownTimeoutRefs.current[menuText]) {
      clearTimeout(dropdownTimeoutRefs.current[menuText]);
      delete dropdownTimeoutRefs.current[menuText];
    }
    setHoveringDropdowns(prev => ({ ...prev, [menuText]: true }));
  };

  const handleDropdownContentLeave = (menuText: string) => {
    setHoveringDropdowns(prev => ({ ...prev, [menuText]: false }));
    dropdownTimeoutRefs.current[menuText] = setTimeout(() => {
      setDropdownStates(prev => ({ ...prev, [menuText]: false }));
    }, 150);
  };

  if (!mounted) {
    return null;
  }

  const handleNavClick = (path: string) => {
    const url = `https://droomdroom.com${path}`;
    window.open(url, "_blank");
  };


  return (
    <header className="sticky top-0 z-50">
      <div className="bg-background">
        <div className="bg-background border-b border-border px-10">
          <Flex justify="center" align="center" className="py-3 md:py-4">
            <div
              className="absolute left-10
                         cursor-pointer"
              onClick={handleThemeToggle}
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                           w-[40px] h-[12px]
                           bg-secondary/50 dark:bg-secondary/50
                           transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                           rounded-full
                           cursor-pointer"
              />
              <div
                className={cn(
                  "absolute w-[24px] h-[24px] rounded-full flex items-center justify-center",
                  "transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                  "shadow-md cursor-pointer hover:scale-105",
                  isAnimating ? "scale-90" : "scale-100",
                  resolvedTheme === "dark"
                    ? "left-full -translate-x-[22px] -translate-y-1/2 top-1/2 bg-primary"
                    : "left-0 translate-x-[-2px] -translate-y-1/2 top-1/2 bg-white"
                )}
              >
                {resolvedTheme === "dark" ? (
                  <span className="text-sm text-white transform transition-transform duration-300">
                    🌙
                  </span>
                ) : (
                  <span className="text-sm transform transition-transform duration-300 text-primary">
                    ☀️
                  </span>
                )}
              </div>
            </div>

            <a href="/" className="flex items-center">
              <FadeIn>
                <Image
                  className="h-[22px] md:h-[26px] w-auto transform transition-transform duration-300 hover:scale-105"
                  src={`https://droomdroom.com/price/DroomDroom_${
                    resolvedTheme === "light" ? "Black" : "White"
                  }.svg`}
                  alt="DroomDroom Logo"
                  width={180}
                  height={30}
                  priority
                />
              </FadeIn>
            </a>
          </Flex>
        </div>

        <div className="w-full bg-background border-b border-border overflow-x-auto scrollbar-hide">
          <div className="w-full px-2 sm:px-4">
            <nav className="flex justify-start sm:justify-center items-center py-3">
              <ul className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6 xl:space-x-8 min-w-max whitespace-nowrap">
                {menus.length > 0 &&
                  menus.map((item, index) => {
                    if (item.type === "link") {
                      return (
                        <li key={`${item.text}-${index}`} className="flex-shrink-0">
                          <button
                            onClick={() => handleNavClick(item.url!)}
                            className={cn(
                              "relative font-bold text-sm sm:text-base md:text-lg whitespace-nowrap px-2 py-1 group",
                              "text-foreground hover:text-primary transition-colors duration-300 ease-in-out",
                              "rounded-lg"
                            )}
                          >
                            <span className="relative z-10 transition-transform duration-300 ease-in-out group-hover:scale-105">
                              {item.text}
                            </span>
                          </button>
                        </li>
                      );
                    } else if (item.type === "dropdown" && item.items && item.items.length > 0) {
                      const isOpen = dropdownStates[item.text] || false;
                      return (
                        <li key={`${item.text}-${index}`} className="flex-shrink-0 relative">
                          <DropdownMenu
                            open={isOpen}
                            onOpenChange={(open) => setDropdownStates(prev => ({ ...prev, [item.text]: open }))}
                          >
                            <DropdownMenuTrigger asChild>
                              <button
                                onMouseEnter={() => handleDropdownEnter(item.text)}
                                onMouseLeave={() => handleDropdownLeave(item.text)}
                                className="relative font-bold text-sm sm:text-base md:text-lg whitespace-nowrap px-2 py-1 flex items-center group
                                     text-foreground hover:text-primary transition-all duration-300 ease-in-out border-none outline-none"
                              >
                                <span className="relative z-10 transition-transform duration-300 ease-in-out group-hover:scale-105">
                                  {item.text}
                                </span>
                                <div className="ml-1 transition-transform duration-300 ease-in-out">
                                  {isOpen ? (
                                    <ChevronUp className="h-4 w-4 transform rotate-0 transition-transform duration-200" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 transform rotate-0 transition-transform duration-200" />
                                  )}
                                </div>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className={cn(
                                "w-48 bg-gradient-to-br from-background/95 to-background/90",
                                "backdrop-blur-md border border-border/50 shadow-lg rounded-lg",
                                "transition-all duration-200 ease-in-out",
                                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                                "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                                "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                                "relative overflow-hidden"
                              )}
                              sideOffset={2}
                              onMouseEnter={() => handleDropdownContentEnter(item.text)}
                              onMouseLeave={() => handleDropdownContentLeave(item.text)}
                              onPointerEnter={() => handleDropdownContentEnter(item.text)}
                              onPointerLeave={() => handleDropdownContentLeave(item.text)}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-30 pointer-events-none" />
                              {item.items.map((subItem) => (
                                <DropdownMenuItem
                                  key={subItem.text}
                                  onClick={() => handleNavClick(subItem.url)}
                                  className={cn(
                                    "w-full text-base cursor-pointer px-4 py-2",
                                    "text-foreground hover:text-primary",
                                    "transition-all duration-200 ease-in-out",
                                    "hover:bg-primary/10",
                                    "focus:bg-primary/10",
                                    "relative group"
                                  )}
                                >
                                  <span className="text-foreground hover:text-foreground transition-transform duration-200 ease-in-out group-hover:translate-x-1 truncate">
                                    {subItem.text}
                                  </span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </li>
                      );
                    }
                    return null;
                  })}
              </ul>
            </nav>
          </div>
        </div>

        {tokens && tokens.length > 0 && (
          <MarqueeScroll
            tokens={tokens.length < 8 ? [...tokens, ...tokens] : tokens}
          />
        )}
      </div>
    </header>
  );
}