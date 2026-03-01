import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  ChevronRight,
  X,
  Star,
  ArrowUpDown,
  Sparkles,
  TruckIcon,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { AddToCartToast } from '../components/AddToCartToast';
import { Newsletter } from '../components/Newsletter';
import { ProductCard } from '../components/ProductCard';
import { type Product } from '../context/CartContext';

interface CategoryPageProps {
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  heroGradient: string;
  heroTextColor?: string;
  products: Product[];
  subCategories: string[];
  priceRanges: { label: string; min: number; max: number }[];
}

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

export function CategoryPage({
  title,
  subtitle,
  description,
  emoji,
  heroGradient,
  products,
  subCategories,
  priceRanges,
}: CategoryPageProps) {
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedSubCat, setSelectedSubCat] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showOnSale, setShowOnSale] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Filter by sub-category
    if (selectedSubCat) {
      result = result.filter((p) => p.name.toLowerCase().includes(selectedSubCat.toLowerCase()));
    }

    // Filter by price range
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    }

    // Filter by rating
    if (selectedRating !== null) {
      result = result.filter((p) => p.rating >= selectedRating);
    }

    // Filter by sale
    if (showOnSale) {
      result = result.filter((p) => p.originalPrice);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedSubCat, selectedPriceRange, selectedRating, showOnSale, sortBy, priceRanges]);

  const activeFilterCount = [selectedSubCat, selectedPriceRange !== null, selectedRating, showOnSale].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedSubCat(null);
    setSelectedPriceRange(null);
    setSelectedRating(null);
    setShowOnSale(false);
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Sub-categories */}
      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Category</h4>
        <div className="space-y-1.5">
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubCat(selectedSubCat === sub ? null : sub)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                selectedSubCat === sub
                  ? 'bg-brand-100 text-brand-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Price Range</h4>
        <div className="space-y-1.5">
          {priceRanges.map((range, idx) => (
            <button
              key={range.label}
              onClick={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                selectedPriceRange === idx
                  ? 'bg-brand-100 text-brand-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Rating</h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${
                selectedRating === rating
                  ? 'bg-brand-100 text-brand-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* On Sale */}
      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Offers</h4>
        <label className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
          <input
            type="checkbox"
            checked={showOnSale}
            onChange={(e) => setShowOnSale(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-gray-600">On Sale Only</span>
        </label>
      </div>

      {/* Clear all */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full text-center text-sm text-brand-600 hover:text-brand-700 font-semibold py-2"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CartDrawer />
      <WishlistDrawer />
      <AddToCartToast />

      {/* Hero Banner */}
      <section className={`relative overflow-hidden ${heroGradient}`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 text-white/70">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{title}</span>
          </nav>

          <div className="flex items-center justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{emoji}</span>
                <span className="text-white/60 text-sm font-medium uppercase tracking-widest">{subtitle}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
                {title}
              </h1>
              <p className="text-white/80 text-lg max-w-md">
                {description}
              </p>
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <TruckIcon className="w-4 h-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <RotateCcw className="w-4 h-4" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block text-[10rem] opacity-20 animate-float">
              {emoji}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Bar: Sort + View toggle + Filter toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <p className="text-gray-500 text-sm">
              Showing <span className="font-bold text-gray-900">{filteredAndSorted.length}</span> of{' '}
              <span className="font-bold text-gray-900">{products.length}</span> products
            </p>
            {activeFilterCount > 0 && (
              <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter btn */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-brand-300 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent border-none outline-none cursor-pointer text-sm pr-2"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* View toggle */}
            <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setGridView('grid')}
                className={`p-2.5 transition-colors ${
                  gridView === 'grid' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridView('list')}
                className={`p-2.5 transition-colors ${
                  gridView === 'list' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active filters chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-500 mr-1">Active:</span>
            {selectedSubCat && (
              <button
                onClick={() => setSelectedSubCat(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold hover:bg-brand-200 transition-colors"
              >
                {selectedSubCat}
                <X className="w-3 h-3" />
              </button>
            )}
            {selectedPriceRange !== null && (
              <button
                onClick={() => setSelectedPriceRange(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold hover:bg-brand-200 transition-colors"
              >
                {priceRanges[selectedPriceRange].label}
                <X className="w-3 h-3" />
              </button>
            )}
            {selectedRating !== null && (
              <button
                onClick={() => setSelectedRating(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold hover:bg-brand-200 transition-colors"
              >
                {selectedRating}★ & Up
                <X className="w-3 h-3" />
              </button>
            )}
            {showOnSale && (
              <button
                onClick={() => setShowOnSale(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold hover:bg-brand-200 transition-colors"
              >
                On Sale
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-brand-600 underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-gray-900">Filters</h3>
              </div>
              {sidebarContent}
            </div>
          </aside>

          {/* Mobile Filters Drawer */}
          {mobileFiltersOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl animate-slide-in overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                      <h3 className="font-bold text-gray-900">Filters</h3>
                    </div>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  {sidebarContent}
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full mt-6 bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors"
                  >
                    Show {filteredAndSorted.length} Results
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filteredAndSorted.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : gridView === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSorted.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSorted.map((product) => (
                  <ListProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}

// List view product card
function ListProductCard({ product }: { product: Product }) {
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex">
      <div className={`relative bg-gradient-to-br ${product.gradient} p-6 flex items-center justify-center w-48 shrink-0`}>
        <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
          {product.emoji}
        </span>
        {product.badge && (
          <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-md`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <p className="text-xs font-medium text-brand-600 uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors text-lg">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-md">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              justAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-brand-600 text-white hover:bg-brand-700'
            }`}
          >
            {justAdded ? (
              <>
                <Star className="w-4 h-4 fill-current" />
                Added!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// end of file
