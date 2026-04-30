import type { PublicBootstrapCollectionItem, PublicBootstrapPacket } from '../lib/public-bootstrap.js';

export const DEFAULT_CANONICAL_SITE_URL = 'https://portfolio.saeeddev.com';

type RouteSeoOptions = {
  siteUrl?: string;
};

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getStringField(value: unknown, field: string) {
  if (typeof value !== 'object' || value === null || !(field in value)) {
    return '';
  }

  const fieldValue = (value as Record<string, unknown>)[field];
  return typeof fieldValue === 'string' ? fieldValue.trim() : '';
}

function getObjectField(value: unknown, field: string) {
  if (typeof value !== 'object' || value === null || !(field in value)) {
    return {};
  }

  const fieldValue = (value as Record<string, unknown>)[field];
  return typeof fieldValue === 'object' && fieldValue !== null ? fieldValue : {};
}

function resolveSiteUrl(explicitSiteUrl?: string) {
  const siteUrl = explicitSiteUrl || process.env.PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_CANONICAL_SITE_URL;
  return siteUrl.replace(/\/$/, '');
}

function normalizeRoutePath(routePath: string) {
  const cleanPath = routePath.split('?')[0] || '/';
  return cleanPath === '/' ? '/' : cleanPath.replace(/\/$/, '');
}

function absoluteUrl(siteUrl: string, value: string) {
  if (!value) {
    return '';
  }

  try {
    return new URL(value).toString();
  } catch {
    return `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`;
  }
}

function findBySlug(items: PublicBootstrapCollectionItem[] | undefined, slug: string) {
  return items?.find((item) => getStringField(item, 'slug') === slug) ?? null;
}

function resolveEntityTitle(entity: unknown, fallback: string) {
  const seo = getObjectField(entity, 'seo');
  return getStringField(seo, 'title') || getStringField(entity, 'title') || fallback;
}

function resolveEntityDescription(entity: unknown, fallback: string) {
  const seo = getObjectField(entity, 'seo');
  return (
    getStringField(seo, 'description') ||
    getStringField(entity, 'description') ||
    getStringField(entity, 'excerpt') ||
    fallback
  );
}

function resolveEntityImage(entity: unknown) {
  const seo = getObjectField(entity, 'seo');
  return (
    getStringField(seo, 'image') ||
    getStringField(entity, 'coverImage') ||
    getStringField(entity, 'image')
  );
}

export function buildRouteHeadTags(routePath: string, packet: PublicBootstrapPacket, options: RouteSeoOptions = {}) {
  const siteUrl = resolveSiteUrl(options.siteUrl);
  const normalizedPath = normalizeRoutePath(routePath);
  const canonicalUrl = `${siteUrl}${normalizedPath === '/' ? '/' : normalizedPath}`;
  const pageId =
    normalizedPath === '/'
      ? 'home'
      : normalizedPath.split('/').filter(Boolean)[0] ?? 'home';
  const page = packet.documents[`pages/${pageId}`];
  const site = packet.documents['settings/site'];
  const seo = packet.documents['settings/seo'];
  const profile = packet.documents['settings/profile'];
  const pageSeo = getObjectField(page, 'seo');
  const fallbackTitle = getStringField(seo, 'defaultTitle') || getStringField(site, 'siteName') || 'Mohamed Studio';
  const fallbackDescription =
    getStringField(seo, 'defaultDescription') ||
    getStringField(site, 'siteTagline') ||
    'Portfolio, projects, and product engineering work by Mohamed Saied.';

  let title = getStringField(pageSeo, 'title') || getStringField(page, 'title') || fallbackTitle;
  let description = getStringField(pageSeo, 'description') || fallbackDescription;
  let image = getStringField(pageSeo, 'image') || getStringField(seo, 'defaultImage');
  let pageType = 'website';
  const jsonLd: Array<Record<string, unknown>> = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: getStringField(site, 'siteName') || 'Mohamed Studio',
      url: `${siteUrl}/`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: getStringField(profile, 'displayName') || 'Mohamed Saied',
      url: `${siteUrl}/`,
      jobTitle: getStringField(profile, 'title') || undefined,
    },
  ];

  const [, collectionName, slug] = normalizedPath.split('/');
  if (collectionName === 'projects' && slug) {
    const project = findBySlug(packet.collections.projects, slug);
    if (project) {
      title = resolveEntityTitle(project, title);
      description = resolveEntityDescription(project, description);
      image = resolveEntityImage(project) || image;
      pageType = 'article';
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: title,
        url: canonicalUrl,
        description,
        image: absoluteUrl(siteUrl, image),
        applicationCategory: getStringField(project, 'category') || undefined,
      });
    }
  }

  if (collectionName === 'blog' && slug) {
    const post = findBySlug(packet.collections.blogs, slug);
    if (post) {
      title = resolveEntityTitle(post, title);
      description = resolveEntityDescription(post, description);
      image = resolveEntityImage(post) || image;
      pageType = 'article';
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        url: canonicalUrl,
        description,
        image: absoluteUrl(siteUrl, image),
        author: {
          '@type': 'Person',
          name: getStringField(profile, 'displayName') || 'Mohamed Saied',
        },
      });
    }
  }

  const absoluteImage = absoluteUrl(siteUrl, image);
  const tags = [
    `<title>${escapeHtmlAttribute(title)}</title>`,
    `<meta name="description" content="${escapeHtmlAttribute(description)}" />`,
    `<link rel="canonical" href="${escapeHtmlAttribute(canonicalUrl)}" />`,
    `<meta property="og:type" content="${escapeHtmlAttribute(pageType)}" />`,
    `<meta property="og:title" content="${escapeHtmlAttribute(title)}" />`,
    `<meta property="og:description" content="${escapeHtmlAttribute(description)}" />`,
    `<meta property="og:url" content="${escapeHtmlAttribute(canonicalUrl)}" />`,
    `<meta property="og:site_name" content="${escapeHtmlAttribute(getStringField(site, 'siteName') || 'Mohamed Studio')}" />`,
    `<meta name="twitter:card" content="${absoluteImage ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${escapeHtmlAttribute(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtmlAttribute(description)}" />`,
  ];

  if (absoluteImage) {
    tags.push(`<meta property="og:image" content="${escapeHtmlAttribute(absoluteImage)}" />`);
    tags.push(`<meta name="twitter:image" content="${escapeHtmlAttribute(absoluteImage)}" />`);
  }

  tags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`);
  return tags.join('');
}
