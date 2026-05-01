import type { PublicBootstrapCollectionItem, PublicBootstrapPacket } from '../lib/public-bootstrap.js';
import { DEMO_BLOG_POSTS } from '../lib/demo-blog-posts.js';

export const DEFAULT_CANONICAL_SITE_URL = 'https://portfolio.saeeddev.com';

const STATIC_ROUTE_SEO_TARGETS: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Mohamed Saied - React Developer for Websites and Dashboards',
    description:
      'React developer in Egypt building public websites, admin dashboards, internal tools, and bilingual Arabic-English web apps for small teams.',
  },
  '/about': {
    title: 'About Mohamed Saied - Product Engineer in Egypt',
    description:
      'Learn how Mohamed Saied builds websites, React dashboards, and internal tools with practical delivery for small teams and founders.',
  },
  '/projects': {
    title: 'React Dashboards, Web Apps, and Internal Tools Portfolio',
    description:
      'Explore live React dashboard demos, web app projects, CRM workflows, inventory systems, clinic tools, and e-commerce admin experiences.',
  },
  '/skills': {
    title: 'React, TypeScript, and Firebase Developer Skills',
    description:
      'A practical React, TypeScript, Firebase, and Node.js stack used to build dashboards, bilingual websites, and internal tools.',
  },
  '/blog': {
    title: 'Notes on React Dashboards, Web Apps, and Internal Tools',
    description:
      'Practical notes for founders and teams planning websites, React dashboards, internal tools, and bilingual web products.',
  },
  '/contact': {
    title: 'Hire Mohamed Saied for Websites and Dashboards',
    description:
      'Contact Mohamed Saied to discuss a website, React dashboard, internal tool, or bilingual Arabic-English web app project.',
  },
};

const DEMO_PROJECT_SEO_TARGETS: PublicBootstrapCollectionItem[] = [
  {
    id: 'shopnest-commerce-demo',
    slug: 'shopnest-commerce',
    title: 'ShopNest Commerce',
    description:
      'A working e-commerce web app demo with storefront browsing, cart, checkout, coupons, and an admin workspace for products and orders.',
    category: 'E-commerce Store',
    image: '/demo-previews/ShopNest-Commerce.png',
    seo: {
      title: 'React Ecommerce Dashboard Demo - ShopNest Commerce',
      description:
        'A React ecommerce dashboard and e-commerce admin dashboard demo with storefront browsing, cart, checkout, products, orders, and coupons.',
    },
  },
  {
    id: 'clinic-flow-manager-demo',
    slug: 'clinic-flow-manager',
    title: 'ClinicFlow Manager',
    description:
      'A working clinic operations dashboard demo with appointments, patients, doctors, billing, reports, and isolated editable visitor sessions.',
    category: 'Healthcare Dashboard',
    image: '/demo-previews/clinic-flow-manager.png',
    seo: {
      title: 'Clinic Management Dashboard Demo - ClinicFlow Manager',
      description:
        'A clinic management dashboard and healthcare admin dashboard demo with appointments, patients, doctors, billing, reports, and isolated sessions.',
    },
  },
  {
    id: 'agency-flow-crm-demo',
    slug: 'agency-flow-crm',
    title: 'AgencyFlow CRM',
    description:
      'A working CRM dashboard demo for small agencies with leads, deals, clients, tasks, reports, and isolated editable visitor sessions.',
    category: 'React Dashboard',
    image: '/demo-previews/agency-flow-crm.png',
    seo: {
      title: 'React CRM Dashboard Demo - AgencyFlow CRM',
      description:
        'A React CRM dashboard and agency CRM dashboard demo with leads, deals, clients, tasks, reports, and isolated editable visitor sessions.',
    },
  },
  {
    id: 'storeops-inventory-demo',
    slug: 'storeops-inventory',
    title: 'StoreOps Inventory',
    description:
      'A working inventory operations dashboard demo with products, suppliers, stock movements, sales orders, reports, and bilingual settings.',
    category: 'Inventory Dashboard',
    image: '/demo-previews/StoreOps-Inventory.png',
    seo: {
      title: 'Inventory Dashboard React Demo - StoreOps Inventory',
      description:
        'An inventory dashboard React demo and inventory management dashboard with products, suppliers, stock movements, sales orders, and reports.',
    },
  },
  {
    id: 'hireflow-ats-demo',
    slug: 'hireflow-ats',
    title: 'HireFlow ATS',
    description:
      'A working applicant tracking dashboard demo with jobs, candidates, hiring pipeline stages, interviews, evaluations, reports, and bilingual settings.',
    category: 'Recruiting Dashboard',
    image: '/demo-previews/hireflow-ats.png',
    seo: {
      title: 'Applicant Tracking System Dashboard Demo - HireFlow ATS',
      description:
        'An applicant tracking system dashboard and ATS dashboard React demo with jobs, candidates, draggable pipeline stages, interviews, and reports.',
    },
  },
];

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

  const staticRouteSeo = STATIC_ROUTE_SEO_TARGETS[normalizedPath];
  if (staticRouteSeo && !getStringField(pageSeo, 'title') && !getStringField(page, 'title')) {
    title = staticRouteSeo.title;
    description = staticRouteSeo.description;
  }
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
    const project = findBySlug(packet.collections.projects, slug) ?? findBySlug(DEMO_PROJECT_SEO_TARGETS, slug);
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
    const post = findBySlug(packet.collections.blogs, slug) ?? findBySlug(DEMO_BLOG_POSTS, slug);
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
