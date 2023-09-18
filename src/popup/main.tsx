import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import StoreProvider from '../common/store/storeProvider.tsx';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('react-root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
