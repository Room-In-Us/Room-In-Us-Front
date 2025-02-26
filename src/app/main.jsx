import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import ScrollToTop from '../shared/components/scrollToTopFunc.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <ScrollToTop />
        <App />
      </RecoilRoot>
    </BrowserRouter>
  </StrictMode>,
);
