import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-pink/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand-pink/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <main className="w-full flex justify-center p-4">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
