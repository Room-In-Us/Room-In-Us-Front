import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.jsx';
import { RecoilRoot } from 'recoil';
import ScrollToTop from './utils/scrollToTopFunc.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <RecoilRoot>
          <ScrollToTop/>
          <App />
        </RecoilRoot>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
