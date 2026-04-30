export const LIGHTHOUSE_DEFAULT_BASE_URL = 'https://portfolio.saeeddev.com';

export const LIGHTHOUSE_ROUTES = [
  { id: 'home', path: '/' },
  { id: 'projects', path: '/projects' },
  { id: 'blog', path: '/blog' },
  { id: 'skills', path: '/skills' },
  { id: 'contact', path: '/contact' },
  { id: 'project-shopnest-commerce', path: '/projects/shopnest-commerce' },
];

export const LIGHTHOUSE_PROFILES = ['mobile', 'desktop'];

export const LIGHTHOUSE_THRESHOLDS = {
  home: {
    performance: 0.95,
    accessibility: 0.98,
    'best-practices': 1,
    seo: 1,
  },
  default: {
    performance: 0.9,
    accessibility: 0.98,
    'best-practices': 1,
    seo: 1,
  },
};

export const LIGHTHOUSE_OUTPUT_ROOT = '.agent/lighthouse';

