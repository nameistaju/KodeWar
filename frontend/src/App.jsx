import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/clients.css';
import './styles/footer.css';
import './styles/whatsapp.css';

import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/common/ScrollToTop';
import { PromotionProvider } from './context/PromotionContext';
import { AuthProvider } from './context/AuthContext';
import { ApplicationProvider } from './context/ApplicationContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApplicationProvider>
          <PromotionProvider>
            <ScrollToTop />
            <MainLayout>
              <AppRoutes />
            </MainLayout>
          </PromotionProvider>
        </ApplicationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

