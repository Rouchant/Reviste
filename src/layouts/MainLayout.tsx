import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream/30">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default MainLayout;
