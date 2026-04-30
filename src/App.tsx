import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Lazy loading features
const HomePage = lazy(() => import('./features/catalog/pages/HomePage'));
const ProductDetailPage = lazy(() => import('./features/catalog/pages/ProductDetailPage'));
const CartPage = lazy(() => import('./features/cart/pages/CartPage'));
const AuthPage = lazy(() => import('./features/auth/pages/AuthPage'));
const AdminPage = lazy(() => import('./features/inventory/pages/AdminPage'));
const AdminUsersPage = lazy(() => import('./features/inventory/pages/AdminUsersPage'));
const AdminHeroPage = lazy(() => import('./features/inventory/pages/AdminHeroPage'));
const UploadPage = lazy(() => import('./features/inventory/pages/UploadPage'));
const SettingsPage = lazy(() => import('./features/auth/pages/SettingsPage'));
const SearchPage = lazy(() => import('./features/catalog/pages/SearchPage'));
const FavoritesPage = lazy(() => import('./features/catalog/pages/FavoritesPage'));
const MyStorePage = lazy(() => import('./features/inventory/pages/MyStorePage'));
const EditProductPage = lazy(() => import('./features/inventory/pages/EditProductPage'));

// Shared Loading Spinner
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-cream/10">
    <div className="w-8 h-8 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router 
      basename="/"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-brand-cream/10 text-brand-dark">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/hero" element={<AdminHeroPage />} />
            <Route path="/my-store" element={<MyStorePage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
        <Toaster richColors position="top-center" />
      </div>
    </Router>
  );
}

export default App;
