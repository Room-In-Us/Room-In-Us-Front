import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import ScrollToTop from '../shared/utils/scrollToTopFunc';
import SeoHead from '../shared/seo/SeoHead';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('createRoot(...): Target container is not a DOM element.');
}

createRoot(rootElement).render(
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
