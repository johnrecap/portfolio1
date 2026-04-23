import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_PORT = 3000;

function loadEnvironment() {
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const envFiles = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];

  for (const envFile of envFiles) {
    dotenv.config({ path: envFile, override: false });
  }
}

function resolveProjectRoot() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const isBuiltServerDir =
    path.basename(currentDir) === 'server' &&
    path.basename(path.dirname(currentDir)) === 'dist';

  return isBuiltServerDir ? path.resolve(currentDir, '..', '..') : currentDir;
}

function parsePort(rawPort: string | undefined) {
  const port = Number(rawPort ?? DEFAULT_PORT);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  return port;
}

loadEnvironment();

const isProduction = process.env.NODE_ENV === 'production';
const projectRoot = resolveProjectRoot();
const host = process.env.HOST ?? DEFAULT_HOST;
const port = parsePort(process.env.PORT);

async function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  if (!isProduction) {
    const store = {
      projects: [
        { id: 1, title: 'Portfolio Platform', slug: 'portfolio-platform', category: 'Web', status: 'published', featured: true },
        { id: 2, title: 'E-Commerce App', slug: 'e-commerce-app', category: 'Mobile', status: 'published', featured: false },
      ],
      messages: [
        { id: 1, name: 'John Doe', email: 'john@example.com', message: 'Hello!', status: 'unread' },
      ],
    };

    // Keep mock data available only during local development.
    app.get('/api/mock/data', (_req, res) => {
      res.json(store);
    });

    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: projectRoot,
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
    return app;
  }

  const distPath = path.join(projectRoot, 'dist');
  app.use(express.static(distPath));
  app.get('/api/*', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  return app;
}

async function startServer() {
  const app = await createApp();
  const publicHost = host === '0.0.0.0' ? 'localhost' : host;

  app.listen(port, host, () => {
    console.log(`Server running on http://${publicHost}:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
