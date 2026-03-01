import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { HomePage } from './pages/HomePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { HandbagsPage } from './pages/HandbagsPage';
import { ClothingPage } from './pages/ClothingPage';
import { SneakersPage } from './pages/SneakersPage';
import { GadgetsPage } from './pages/GadgetsPage';
import { KidsPage } from './pages/KidsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { ScrollToTop } from './components/ScrollToTop';

export function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/handbags" element={<HandbagsPage />} />
            <Route path="/clothing" element={<ClothingPage />} />
            <Route path="/sneakers" element={<SneakersPage />} />
            <Route path="/gadgets" element={<GadgetsPage />} />
            <Route path="/kids" element={<KidsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
