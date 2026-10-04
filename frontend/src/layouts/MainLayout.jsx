import React from 'react';
import { useLocation } from 'react-router-dom';
import Preloader from '../components/common/Preloader';
import CustomCursor from '../components/common/CustomCursor';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import WhatsAppButton from '../components/common/WhatsAppButton';

export default function MainLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="app-container admin-app-container">
        <CustomCursor />
        <div id="grain"></div>
        {children}
      </div>
    );
  }

  return (
    <div className="app-container">
      <Preloader />
      <CustomCursor />
      <div id="grain"></div>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
