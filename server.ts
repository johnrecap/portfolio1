import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  // Mocked API Data Store
  const store = {
    projects: [
      { id: 1, title: 'Portfolio Platform', slug: 'portfolio-platform', category: 'Web', status: 'published', featured: true },
      { id: 2, title: 'E-Commerce App', slug: 'e-commerce-app', category: 'Mobile', status: 'published', featured: false },
    ],
    messages: [
      { id: 1, name: 'John Doe', email: 'john@example.com', message: 'Hello!', status: 'unread' }
    ]
  };

  app.get('/api/mock/data', (req, res) => {
    res.json(store);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
