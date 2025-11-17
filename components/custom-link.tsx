"use client";

import React from "react";
import Link from "next/link";
import { LinkProps } from "next/link";
import { CSSProperties } from "react";

// Define the base props without href to avoid type conflicts
interface BaseCustomLinkProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  title?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

// Extend LinkProps but make href required
interface CustomLinkProps extends BaseCustomLinkProps {
  href: string;
}

// Helper function to normalize internal paths
// Removes /token-sales from paths since Next.js basePath handles it automatically
const normalizeHref = (href: string): string => {
  // Don't modify external URLs
  if (
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  // Split href into path and query string
  const [path, query] = href.split("?");

  let normalizedPath = path;

  // Remove /token-sales from internal paths
  // Handle both /token-sales and /token-sales/ at the start
  if (path.startsWith("/mining")) {
    normalizedPath = path.replace("/mining", "/");
  } else if (path === "/mining") {
    normalizedPath = "/";
  }

  // Reconstruct href with query string if it exists
  return query ? `${normalizedPath}?${query}` : normalizedPath;
};

// Create the base CustomLink component
const CustomLink = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
  (
    { href, children, className, style, onClick, title, target, rel, ...props },
    ref
  ) => {
    // If href is undefined, render children in a span
    if (!href) {
      return (
        <span className={className} style={style}>
          {children}
        </span>
      );
    }

    // Handle external links
    if (
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return (
        <a
          ref={ref}
          href={href}
          className={className}
          style={style}
          onClick={onClick}
          title={title}
          target={target || "_blank"}
          rel={rel || "noopener noreferrer nofollow"}
          {...props}
        >
          {children}
        </a>
      );
    }

    // Handle DroomDroom links
    if (href.startsWith("https://droomdroom.com")) {
      return (
        <a
          ref={ref}
          href={href}
          className={className}
          style={style}
          onClick={onClick}
          title={title}
          target={target || "_blank"}
          rel={rel || "noopener noreferrer"}
          {...props}
        >
          {children}
        </a>
      );
    }

    // Normalize internal links (remove /token-sales prefix)
    const normalizedHref = normalizeHref(href);

    const baseUrl =
      process.env.NEXT_PUBLIC_URL || "https://www.droomdroom.com";
    let fullUrl = baseUrl

    if(normalizedHref.endsWith("/mining")) {
      fullUrl += "/mining"
    } else {
      fullUrl += `/${normalizedHref}`
    }

    // By default, use Link for internal links
    return (
      <Link
        ref={ref}
        href={fullUrl}
        className={className}
        style={style}
        onClick={onClick}
        title={title}
        target={target}
        rel={rel}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

// Create the Link variant
const CustomLinkLink = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
  (
    { href, children, className, style, onClick, title, target, rel, ...props },
    ref
  ) => {
    // Handle external links
    if (
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return (
        <a
          ref={ref}
          href={href}
          className={className}
          style={style}
          onClick={onClick}
          title={title}
          target={target || "_blank"}
          rel={rel || "noopener noreferrer nofollow"}
          {...props}
        >
          {children}
        </a>
      );
    }

    // Handle DroomDroom links
    if (href.startsWith("https://droomdroom.com")) {
      return (
        <a
          ref={ref}
          href={href}
          className={className}
          style={style}
          onClick={onClick}
          title={title}
          target={target || "_blank"}
          rel={rel || "noopener noreferrer"}
          {...props}
        >
          {children}
        </a>
      );
    }

    // Normalize internal links (remove /token-sales prefix)
    const normalizedHref = normalizeHref(href);

    // By default, use Link for internal links
    return (
      <Link
        ref={ref}
        href={normalizedHref}
        className={className}
        style={style}
        onClick={onClick}
        title={title}
        target={target}
        rel={rel}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

// Create the Anchor variant
const CustomLinkAnchor = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
  (
    { href, children, className, style, onClick, title, target, rel, ...props },
    ref
  ) => {
    return (
      <a
        ref={ref}
        href={href}
        className={className}
        style={style}
        onClick={onClick}
        title={title}
        target={target || "_blank"}
        rel={rel || "noopener noreferrer nofollow"}
        {...props}
      >
        {children}
      </a>
    );
  }
);

// Add display names for better debugging
CustomLink.displayName = "CustomLink";
CustomLinkLink.displayName = "CustomLink.Link";
CustomLinkAnchor.displayName = "CustomLink.a";

// Create the compound component
// The main CustomLink already uses Link by default for internal links,
// so we don't need to change the default behavior
const CompoundCustomLink = Object.assign(CustomLink, {
  Link: CustomLinkLink,
  a: CustomLinkAnchor,
});

// Export named exports for better module resolution
export { CustomLinkLink as Link, CustomLinkAnchor as Anchor };

export default CompoundCustomLink;
