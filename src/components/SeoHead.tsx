import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SeoHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogType?: 'website' | 'product' | 'article' | 'place' | 'profile';
  ogImage?: string;
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const BASE_URL = 'https://coffee-site-ivory.vercel.app';
const DEFAULT_TITLE = 'NOIR ROAST | Single-Estate Specialty Coffee & South Indian Kaapi';
const DEFAULT_DESCRIPTION =
  'Artisanal single-estate shade-grown South Indian specialty coffee. Slow cast-iron convection drum roasting in Chikmagalur and Indiranagar, Bengaluru. Express courier dispatch across India.';
const DEFAULT_IMAGE = `${BASE_URL}/assets/hero-beans.jpg`;
const DEFAULT_KEYWORDS =
  'specialty coffee india, single estate arabica, filter kaapi, chikmagalur coffee beans, malabar monsooned coffee, peaberry coffee beans, indiranagar bangalore roastery, buy fresh roasted coffee online, south indian brass filter coffee';

/**
 * Universal SEO, AEO, AIO, LLMO & Schema.org Head Controller
 * Dynamically updates document metadata, OpenGraph, Twitter Cards,
 * canonical links, and injects Schema.org JSON-LD structured data.
 */
export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  keywords = DEFAULT_KEYWORDS,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  noIndex = false,
  breadcrumbs,
  jsonLd,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Title
    const finalTitle = title ? `${title} | NOIR ROAST` : DEFAULT_TITLE;
    document.title = finalTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attributeName, attributeValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Helper to update or create link tags
    const setLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // 2. Canonical URL
    const canonicalUrl = canonical
      ? canonical.startsWith('http')
        ? canonical
        : `${BASE_URL}${canonical}`
      : `${BASE_URL}${location.pathname}`;
    setLinkTag('canonical', canonicalUrl);

    // 3. Meta Description & Keywords
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'author', 'NOIR ROAST Kaapi Artisans');

    // 4. Open Graph Tags
    setMetaTag('property', 'og:site_name', 'NOIR ROAST');
    setMetaTag('property', 'og:locale', 'en_IN');
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@noirroast');
    setMetaTag('name', 'twitter:creator', '@noirroast');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`);

    // 6. Geo & Regional Targeting (Local SEO & Geo)
    setMetaTag('name', 'geo.region', 'IN-KA');
    setMetaTag('name', 'geo.placename', 'Bengaluru, Karnataka, India');
    setMetaTag('name', 'geo.position', '12.9716;77.6412');
    setMetaTag('name', 'ICBM', '12.9716, 77.6412');

    // 7. Dynamic JSON-LD Structured Data Injection
    const scriptId = 'noir-page-jsonld';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const scriptsToAdd: Array<Record<string, unknown>> = [];

    // Auto-generate BreadcrumbList schema if breadcrumbs are passed
    if (breadcrumbs && breadcrumbs.length > 0) {
      scriptsToAdd.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url}`,
        })),
      });
    }

    // Add custom page JSON-LD
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        scriptsToAdd.push(...jsonLd);
      } else {
        scriptsToAdd.push(jsonLd);
      }
    }

    if (scriptsToAdd.length > 0) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(scriptsToAdd.length === 1 ? scriptsToAdd[0] : {
        '@context': 'https://schema.org',
        '@graph': scriptsToAdd,
      });
      document.head.appendChild(script);
    }

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, canonical, keywords, ogType, ogImage, noIndex, breadcrumbs, jsonLd, location.pathname]);

  return null;
};
