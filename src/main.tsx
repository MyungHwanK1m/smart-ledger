// beforeinstallprompt를 놓치지 않도록 가장 먼저 로드 (React 마운트 전에 발생할 수 있음)
import './lib/pwa';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
