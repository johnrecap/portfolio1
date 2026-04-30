import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const publicDir = path.join(rootDir, 'public');
const siteUrl = (process.env.PUBLIC_SITE_URL || process.env.SITE_URL || 'https://portfolio.saeeddev.com').replace(/\/$/, '');

const staticRoutes = [
  '/',
  '/about',
  '/projects',
  '/projects/shopnest-commerce',
  '/projects/clinic-flow-manager',
  '/projects/agency-flow-crm',
  '/projects/storeops-inventory',
  '/projects/hireflow-ats',
  '/blog',
  '/skills',
  '/contact',
];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createSitemap(routes) {
  const urls = routes
    .map((route) => {
      const loc = `${siteUrl}${route === '/' ? '/' : route}`;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function createRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, 'sitemap.xml'), createSitemap(staticRoutes), 'utf8');
await writeFile(path.join(publicDir, 'robots.txt'), createRobotsTxt(), 'utf8');
console.log(`Generated sitemap.xml and robots.txt for ${siteUrl}`);
