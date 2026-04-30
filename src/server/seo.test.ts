import assert from 'node:assert/strict';
import test from 'node:test';

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

test('buildRouteHeadTags uses the configured canonical host', () => {
  const html = buildRouteHeadTags('/', createPacket(), { siteUrl: 'https://portfolio.saeeddev.com' });

  assert.match(html, /<link rel="canonical" href="https:\/\/portfolio\.saeeddev\.com\/" \/>/);
  assert.match(html, /<meta property="og:url" content="https:\/\/portfolio\.saeeddev\.com\/" \/>/);
  assert.match(html, /"@type":"WebSite"/);
});

test('buildRouteHeadTags emits project metadata and SoftwareApplication JSON-LD', () => {
  const html = buildRouteHeadTags('/projects/shopnest-commerce', createPacket(), {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>ShopNest Commerce<\/title>/);
  assert.match(html, /<meta property="og:image" content="https:\/\/portfolio\.saeeddev\.com\/demo-previews\/ShopNest-Commerce\.png" \/>/);
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

test('buildRouteHeadTags falls back cleanly for unknown routes', () => {
  const html = buildRouteHeadTags('/unknown-route', createPacket(), {
    siteUrl: 'https://portfolio.saeeddev.com',
  });

  assert.match(html, /<title>Mohamed Studio<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/portfolio\.saeeddev\.com\/unknown-route" \/>/);
  assert.doesNotMatch(html, /SoftwareApplication|BlogPosting/);
});
