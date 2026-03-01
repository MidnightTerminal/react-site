import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, TrendingUp, Clock, Star, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { allProducts } from '../data/products';
import { useCart, type Product } from '../context/CartContext';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingSearches = ['Leather Bag', 'Sneakers', 'Smart Watch', 'Summer Dress', 'Robot Kit'];
const recentSearches = ['Crossbody Bag', 'Wireless Earbuds', 'Running Shoes'];

const categoryRoutes: Record<string, string> = {
  Handbags: '/handbags',
  Clothing: '/clothing',
  Sneakers: '/sneakers',
  Gadgets: '/gadgets',
  Kids: '/kids',
};

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(allProducts.map((p) => p.category))];
    return cats;
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    let filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );
    if (activeCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }
    return filtered.slice(0, 8);
  }, [query, activeCategory]);

  const getDiscountPercent = (product: Product) => {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const handleProductClick = (product: Product) => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to the first matching category or stay
      const firstResult = results[0];
      if (firstResult) {
        const route = categoryRoutes[firstResult.category];
        if (route) {
          onClose();
          navigate(route);
        }
      }
    }
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Search Panel */}
      <div className="fixed inset-x-0 top-0 z-[90] max-h-[85vh] overflow-hidden animate-search-slide">
        <div className="bg-white shadow-2xl">
          {/* Search Input Area */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for handbags, sneakers, gadgets, clothing..."
                className="w-full pl-14 pr-14 py-5 text-lg bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </form>

            {/* Category filter pills */}
            {query.trim() && (
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results / Suggestions */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-6 overflow-y-auto max-h-[60vh]">
            {query.trim() ? (
              <>
                {results.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      {results.length} result{results.length !== 1 ? 's' : ''} found
                    </p>
                    {results.map((product) => {
                      const discount = getDiscountPercent(product);
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                          {/* Product emoji */}
                          <div
                            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center flex-shrink-0`}
                          >
                            <span className="text-2xl">{product.emoji}</span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-600 transition-colors truncate">
                                {product.name}
                              </h4>
                              {discount > 0 && (
                                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0">
                                  {discount}% OFF
                                </span>
                              )}
                              {product.isNew && !product.originalPrice && (
                                <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0">
                                  NEW
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-brand-600 font-medium">{product.category}</span>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs text-gray-500">{product.rating}</span>
                              </div>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-gray-400">{product.reviews} reviews</span>
                            </div>
                          </div>

                          {/* Price + Quick Add */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-right">
                              <p className="font-extrabold text-gray-900">${product.price}</p>
                              {product.originalPrice && (
                                <p className="text-xs text-gray-400 line-through">${product.originalPrice}</p>
                              )}
                            </div>
                            <button
                              onClick={(e) => handleQuickAdd(e, product)}
                              className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors shadow-md shadow-brand-200 opacity-0 group-hover:opacity-100"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-7 h-7 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No results found</h3>
                    <p className="text-sm text-gray-500">
                      Try searching for something else or check our categories.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Trending */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-brand-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Trending Searches</h3>
                  </div>
                  <div className="space-y-1">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSuggestionClick(term)}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-colors group"
                      >
                        <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-brand-500" />
                        <span>{term}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Searches</h3>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSuggestionClick(term)}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors group"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{term}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>

                  {/* Quick categories */}
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Quick Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {['👜 Handbags', '👗 Clothing', '👟 Sneakers', '⌚ Gadgets', '🧸 Kids'].map(
                        (cat) => (
                          <button
                            key={cat}
                            onClick={() => handleSuggestionClick(cat.split(' ')[1])}
                            className="px-3 py-2 bg-gray-100 rounded-xl text-xs font-medium text-gray-600 hover:bg-brand-100 hover:text-brand-700 transition-colors"
                          >
                            {cat}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
