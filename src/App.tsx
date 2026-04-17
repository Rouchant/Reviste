import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy loading features
const HomePage = lazy(() => import('./features/catalog/pages/HomePage'));
const ProductDetailPage = lazy(() => import('./features/catalog/pages/ProductDetailPage'));
const CartPage = lazy(() => import('./features/cart/pages/CartPage'));
const AuthPage = lazy(() => import('./features/auth/pages/AuthPage'));
const AdminPage = lazy(() => import('./features/inventory/pages/AdminPage'));
const MyGarmentsPage = lazy(() => import('./features/inventory/pages/MyGarmentsPage'));
const UploadPage = lazy(() => import('./features/inventory/pages/UploadPage'));
const SettingsPage = lazy(() => import('./features/auth/pages/SettingsPage'));
const SearchPage = lazy(() => import('./features/catalog/pages/SearchPage'));

// Shared Loading Spinner
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-cream/10">
    <div className="w-8 h-8 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-cream/10 text-brand-dark">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/my-garments" element={<MyGarmentsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
