import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './app/providers';
import App from './App';
import './index.css';

async function enableMocking() {
  // On active MSW seulement si le flag VITE_ENABLE_MSW est explicitement à "true"
  // -> ça découple le mocking du mode dev/prod, tu gardes le contrôle
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') {
    return; // on sort direct, MSW n'est jamais importé -> pas d'interception réseau
  }
  const { worker } = await import('./mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>
  );
});