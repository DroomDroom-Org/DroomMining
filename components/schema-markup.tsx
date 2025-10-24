"use client";

import Script from "next/script";

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
}

export function OrganizationSchema({ name, url, logo, description }: OrganizationSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    ...(logo && { "logo": logo }),
    ...(description && { "description": description }) ,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Worldwide",
      "addressRegion": "Worldwide",   
      "addressCountry": "Worldwide"
    }
  };
  
  return (
    <Script
      id="organization-schema-markup"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      strategy="afterInteractive"
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string, url: string }[] }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "WebPage",
        "@id": item.url,
        "name": item.name,
        "url": item.url
      }
    }))
  };
  
  return (
    <Script
      id="breadcrumb-schema-markup"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      strategy="afterInteractive"
    />
  );
}
