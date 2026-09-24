import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeFirebaseData } from './services/firebase';

async function startCorebiq() {
  // Connect/hydrate Firebase before the existing application renders.
  // If Firebase is unavailable, the existing localStorage behavior continues.
  await initializeFirebaseData();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

void startCorebiq();
