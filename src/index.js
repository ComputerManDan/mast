import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA functionality with error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('Service Worker registered successfully');
      })
      .catch(err => {
        console.warn('Service Worker registration failed:', err);
        console.warn('App will still work, but without offline support');
        // Don't throw - app should still work with camera even if SW fails
      });
  });
}

reportWebVitals();