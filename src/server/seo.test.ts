import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createDefaultPageConfig,
  createDefaultProfileSettings,
  createDefaultSeoSettings,
  createDefaultSiteSettings,
} from '../lib/admin/defaults';
import { DEMO_BLOG_POSTS } from '../lib/demo-blog-posts';
import { PUBLIC_BOOTSTRAP_VERSION, type PublicBootstrapPacket } from '../lib/public-bootstrap';
import { buildRouteHeadTags } from './seo';

function createPacket(): PublicBootstrapPacket {
  return {
    version: PUBLIC_BOOTSTRAP_VERSION,
    generatedAt: 1,
    documents: {
      'settings/site': {
        id: 'site',
        siteName: 'Mohamed Studio',
        siteTagline: 'Bilingual product engineering portfolio.',
      },
      'settings/profile': {
        id: 'profile',
        displayName: 'Mohamed Saied',
        title: 'Product Engineer',
      },
      'settings/seo': {
        id: 'seo',
        defaultTitle: 'Mohamed Studio',
        defaultDescription: 'Portfolio, projects, and product engineering work.',
        defaultImage: '/og-image.png',
      },
      'pages/home': {
        id: 'home',
        title: 'Home',
        seo: {
          title: 'Portfolio Home',
          description: 'Selected projects and services.',
        },
      },
      'pages/projects': {
        id: 'projects',
        title: 'Projects',
      },
      'pages/blog': {
        id: 'blog',
        title: 'Blog',
      },
    },
    collections: {
      projects: [
        {
          id: 'shopnest',
          slug: 'shopnest-commerce',
          title: 'ShopNest Commerce',
          description: 'A commerce demo.',
          category: 'E-commerce Store',
          image: '/demo-previews/ShopNest-Commerce.png',
        },
      ],
      blogs: [
        {
          id: 'post-1',
          slug: 'performance-notes',
          title: 'Performance Notes',
          excerpt: 'How to improve web performance.',
          coverImage: '/blog/performance.png',
        },
      ],
    },
  };
}

function createDefaultSeoPacket(): PublicBootstrapPacket {
  return {
    version: PUBLIC_BOOTSTRAP_VERSION,
    generatedAt: 1,
    documents: {
      'settings/site': {
        id: 'site',
        ...createDefaultSiteSettings(),
      },
      'settings/profile': {
        id: 'profile',
        ...createDefaultProfileSettings(),
      },
      'settings/seo': {
        id: 'seo',
        ...createDefaultSeoSettings(),
      },
      'pages/home': {
        id: 'home',
        ...createDefaultPageConfig('home'),
      },
      'pages/about': {
        id: 'about',
        ...createDefaultPageConfig('about'),
      },
      'pages/projects': {
        id: 'projects',
        ...createDefaultPageConfig('projects'),
      },
      'pages/blog': {
        id: 'blog',
        ...createDefaultPageConfig('blog'),
      },
      'pages/contact': {
        id: 'contact',
        ...createDefaultPageConfig('contact'),
      },
    },
    collections: {
      projects: [],
      blogs: [],
    },
  };
}

test('buildRouteHeadTags uses the configured canonical host', () => {
  const html = buildRouteHeadTags('/', createPacket(), { siteUrl: 'https://portfolio.saeeddev.com' });

  assert.match(html, /<link data-rh="true" rel="canonical" href="https:\/\/portfolio\.saeeddev\.com\/" \/>/);
  assert.match(html, /<meta data-rh="true" name="robots" content="index, follow" \/>/);
  assert.match(html, /<meta data-rh="true" property="og:url" content="https:\/\/portfolio\.saeeddev\.com\/" \/>/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"Person"/);
});

test('buildRouteHeadTags emits project metadata and SoftwareApplication JSON-LD', () => {
  const html = buildRouteHeadTags('/projects/shopnest-commerce', createPacket(), {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>ShopNest Commerce<\/title>/);
  assert.match(html, /<meta data-rh="true" property="og:image" content="https:\/\/portfolio\.saeeddev\.com\/demo-previews\/ShopNest-Commerce\.png" \/>/);
  assert.match(html, /"@type":"SoftwareApplication"/);
});

test('buildRouteHeadTags emits blog metadata and BlogPosting JSON-LD', () => {
  const html = buildRouteHeadTags('/blog/performance-notes', createPacket(), {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>Performance Notes<\/title>/);
  assert.match(html, /How to improve web performance/);
  assert.match(html, /"@type":"BlogPosting"/);
});

test('bundled demo blog posts are complete enough for public SEO fallback', () => {
  assert.equal(DEMO_BLOG_POSTS.length, 5);

  const slugs = new Set<string>();
  for (const post of DEMO_BLOG_POSTS) {
    assert.ok(post.slug);
    assert.ok(!slugs.has(post.slug), `duplicate blog slug: ${post.slug}`);
    slugs.add(post.slug);

    assert.ok(post.title.includes('React') || post.title.includes('Dashboard'));
    assert.ok(post.titleAr);
    assert.ok(post.excerpt.length > 80);
    assert.ok(post.content.includes('## Technologies used'));
    assert.ok(post.content.includes('## Who it is useful for'));
    assert.ok(post.content.includes('## Search intent covered'));
    assert.ok(post.seo?.title);
    assert.ok(post.seo?.description);
    assert.ok(post.tags?.length && post.tags.length >= 4);
  }
});

test('buildRouteHeadTags emits bundled demo blog metadata when Firestore has no blog posts', () => {
  const html = buildRouteHeadTags('/blog/shopnest-commerce-react-ecommerce-dashboard', createDefaultSeoPacket(), {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>React Ecommerce Dashboard Demo - How ShopNest Commerce Works<\/title>/);
  assert.match(html, /React ecommerce dashboard demo works/);
  assert.match(html, /"@type":"BlogPosting"/);
});

test('buildRouteHeadTags falls back cleanly for unknown routes', () => {
  const html = buildRouteHeadTags('/unknown-route', createPacket(), {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>Mohamed Studio<\/title>/);
  assert.match(html, /<link data-rh="true" rel="canonical" href="https:\/\/portfolio\.saeeddev\.com\/unknown-route" \/>/);
  assert.doesNotMatch(html, /SoftwareApplication|BlogPosting/);
});

test('buildRouteHeadTags targets React developer service intent on the homepage', () => {
  const html = buildRouteHeadTags('/', createDefaultSeoPacket(), {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>Mohamed Saied - React Developer \| Egypt<\/title>/);
  assert.match(html, /Expert React developer in Egypt specializing in bilingual websites/);
});

test('buildRouteHeadTags targets Mohamed Saied identity intent on the about page', () => {
  const html = buildRouteHeadTags('/about', createDefaultSeoPacket(), {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>About Mohamed Saied - Product Engineer in Egypt<\/title>/);
  assert.match(html, /Learn how Mohamed Saied builds websites, React dashboards, and internal tools/);
});

test('buildRouteHeadTags targets dashboard and internal tools intent on the projects page', () => {
  const html = buildRouteHeadTags('/projects', createDefaultSeoPacket(), {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>React Dashboards, Web Apps, and Internal Tools Portfolio<\/title>/);
  assert.match(html, /Explore live React dashboard demos, web app projects, CRM workflows/);
});

test('buildRouteHeadTags targets stack credibility on the skills page', () => {
  const html = buildRouteHeadTags('/skills', createDefaultSeoPacket(), {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>React, TypeScript, and Firebase Developer Skills<\/title>/);
  assert.match(html, /used to build dashboards, bilingual websites, and internal tools/);
});

test('buildRouteHeadTags targets hiring intent on the contact page', () => {
  const html = buildRouteHeadTags('/contact', createDefaultSeoPacket(), {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>Hire Mohamed Saied for Websites and Dashboards<\/title>/);
  assert.match(html, /Contact Mohamed Saied to discuss a website, React dashboard, internal tool/);
});

test('buildRouteHeadTags uses keyword static fallbacks when bootstrap page data is missing', () => {
  const packet = createDefaultSeoPacket();
  packet.documents = {};

  const cases = [
    ['/', /Mohamed Saied - React Developer \| Egypt/, /Expert React developer in Egypt/],
    ['/about', /About Mohamed Saied - Product Engineer in Egypt/, /Learn how Mohamed Saied builds websites/],
    ['/projects', /React Dashboards, Web Apps, and Internal Tools Portfolio/, /Explore live React dashboard demos/],
    ['/skills', /React, TypeScript, and Firebase Developer Skills/, /bilingual websites, and internal tools/],
    ['/blog', /Notes on React Dashboards, Web Apps, and Internal Tools/, /Practical notes for founders/],
    ['/contact', /Hire Mohamed Saied for Websites and Dashboards/, /Contact Mohamed Saied to discuss a website/],
  ] as const;

  for (const [route, title, description] of cases) {
    const html = buildRouteHeadTags(route, packet, {
      siteUrl: 'https://portfolio.saeeddev.com',
    });

    assert.match(html, title);
    assert.match(html, description);
  }
});

test('buildRouteHeadTags removes exact duplicate SEO title and description text', () => {
  const packet = createDefaultSeoPacket();
  packet.documents['pages/home'] = {
    id: 'home',
    title: 'Mohamed Saied - React Developer for Websites and Dashboards | Mohamed Saied - React Developer for Websites and Dashboards',
    seo: {
      description:
        'React developer in Egypt building public websites, admin dashboards, internal tools, and bilingual Arabic-English web apps for small teams.React developer in Egypt building public websites, admin dashboards, internal tools, and bilingual Arabic-English web apps for small teams.',
    },
  };

  const html = buildRouteHeadTags('/', packet, {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>Mohamed Saied - React Developer \| Egypt<\/title>/);
  assert.doesNotMatch(html, /Dashboards \| Mohamed Saied/);
  assert.doesNotMatch(html, /small teams\.React developer/);
});

test('buildRouteHeadTags emits long-tail SEO metadata for bundled demo project routes', () => {
  const packet = createDefaultSeoPacket();
  const cases = [
    ['/projects/shopnest-commerce', /React Ecommerce Dashboard Demo/, /e-commerce admin dashboard/],
    ['/projects/storeops-inventory', /Inventory Dashboard React Demo/, /inventory management dashboard/],
    ['/projects/clinic-flow-manager', /Clinic Management Dashboard Demo/, /healthcare admin dashboard/],
    ['/projects/agency-flow-crm', /React CRM Dashboard Demo/, /agency CRM dashboard/],
    ['/projects/hireflow-ats', /Applicant Tracking System Dashboard Demo/, /ATS dashboard React/],
  ] as const;

  for (const [route, title, description] of cases) {
    const html = buildRouteHeadTags(route, packet, {
      siteUrl: 'https://portfolio.saeeddev.com',
    });

    assert.match(html, title);
    assert.match(html, description);
    assert.match(html, /"@type":"SoftwareApplication"/);
  }
});
