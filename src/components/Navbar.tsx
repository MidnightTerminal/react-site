import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { SearchOverlay } from './SearchOverlay';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Handbags', to: '/handbags' },
  { label: 'Clothing', to: '/clothing' },
  { label: 'Sneakers', to: '/sneakers' },
  { label: 'Gadgets', to: '/gadgets' },
  { label: 'Kids', to: '/kids' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { toggleCart, totalItems } = useCart();
  const { toggleWishlist, wishlistCount } = useWishlist();
  const location = useLocation();

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-700 text-white text-xs py-2 text-center tracking-wide">
        🎉 FREE SHIPPING on orders over $50 — Use code <span className="font-bold">SHOPVIBE</span> at checkout!
      </div>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-200 group-hover:shadow-brand-300 transition-shadow">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
                ShopVibe
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="block h-0.5 bg-brand-600 rounded-full mt-0.5 mx-auto w-4" />
                    )}
                  </Link>
                );
              })}
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-all duration-200 flex items-center gap-1">
                More <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                onClick={toggleWishlist}
                className="hidden sm:flex p-2.5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all relative"
              >
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-once">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </button>

              <button className="hidden sm:flex p-2.5 rounded-xl text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all">
                <User className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="p-2.5 rounded-xl text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all relative group"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-once">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                ) : (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-300 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    0
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in-up">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {/* Mobile Wishlist */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  toggleWishlist();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ml-auto">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
