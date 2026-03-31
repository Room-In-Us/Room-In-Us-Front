import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_SEO, getSeoForPath } from './seoConfig';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });
}

function SeoHead() {
  const location = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(location.pathname);
    const title = seo.title || DEFAULT_SEO.title;
    const description = seo.description || DEFAULT_SEO.description;
    const image = seo.image || DEFAULT_SEO.image;

    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: seo.robots });

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.ogType });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Room-In-Us' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'ko_KR' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: seo.url });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });

    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: seo.canonicalUrl });
  }, [location.pathname]);

  return null;
}

export default SeoHead;
