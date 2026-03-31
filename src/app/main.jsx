import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import ScrollToTop from '../shared/utils/scrollToTopFunc.js';
import SeoHead from '../shared/seo/SeoHead.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <SeoHead />
        <ScrollToTop />
        <App />
      </RecoilRoot>
    </BrowserRouter>
  </StrictMode>,
);
