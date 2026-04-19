import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { doc, getDocFromServer } from 'firebase/firestore';
import App from './App.tsx';
import './index.css';
import './i18n';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { db } from './lib/firebase';

async function probeFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

const isDevelopment =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

if (isDevelopment) {
  void probeFirestoreConnection();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
);
