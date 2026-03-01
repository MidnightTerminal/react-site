import { useState } from 'react';
import { Heart, ShoppingBag, Star, Eye, Check } from 'lucide-react';
import { useCart, type Product } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

const products: Product[] = [
  {
    id: 1,
    name: 'Leather Crossbody Bag',
    price: 89.99,
    originalPrice: 129.99,
    category: 'Handbags',
    rating: 4.8,
    reviews: 324,
    emoji: '👜',
    gradient: 'from-pink-100 to-rose-100',
  },
  {
    id: 2,
    name: 'Floral Summer Dress',
    price: 54.99,
    category: 'Clothing',
    isNew: true,
    rating: 4.7,
    reviews: 189,
    emoji: '👗',
    gradient: 'from-purple-100 to-violet-100',
  },
  {
    id: 3,
    name: 'Air Max Retro Sneakers',
    price: 129.99,
    originalPrice: 159.99,
    category: 'Sneakers',
    rating: 4.9,
    reviews: 542,
    emoji: '👟',
    gradient: 'from-blue-100 to-indigo-100',
  },
  {
    id: 4,
    name: 'Smart Watch Pro X',
    price: 199.99,
    category: 'Gadgets',
    badge: 'Best Seller',
    badgeColor: 'bg-emerald-500',
    rating: 4.8,
    reviews: 876,
    emoji: '⌚',
    gradient: 'from-emerald-100 to-teal-100',
  },
  {
    id: 5,
    name: 'Educational Robot Kit',
    price: 45.99,
    originalPrice: 59.99,
    category: 'Kids',
    rating: 4.6,
    reviews: 213,
    emoji: '🤖',
    gradient: 'from-amber-100 to-orange-100',
  },
  {
    id: 6,
    name: 'Designer Tote Bag',
    price: 119.99,
    category: 'Handbags',
    isNew: true,
    rating: 4.7,
    reviews: 156,
    emoji: '💼',
    gradient: 'from-rose-100 to-pink-100',
  },
  {
    id: 7,
    name: 'Wireless Earbuds Pro',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Gadgets',
    rating: 4.9,
    reviews: 1024,
    emoji: '🎧',
    gradient: 'from-cyan-100 to-blue-100',
  },
  {
    id: 8,
    name: 'Casual Linen Blazer',
    price: 74.99,
    category: 'Clothing',
    isNew: true,
    rating: 4.5,
    reviews: 98,
    emoji: '🧥',
    gradient: 'from-violet-100 to-purple-100',
  },
];

const filters = ['All', 'Handbags', 'Clothing', 'Sneakers', 'Gadgets', 'Kids'];

function getBadge(product: Product) {
  if (product.originalPrice && product.originalPrice > product.price) {
    const percent = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
    return { text: `${percent}% OFF`, color: 'bg-red-500' };
  }
  if (product.isNew) {
    return { text: 'New', color: 'bg-brand-600' };
  }
  if (product.badge) {
    return { text: product.badge, color: product.badgeColor || 'bg-gray-700' };
  }
  return null;
}

export function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();

  const filteredProducts =
    activeFilter === 'All'
      ? products
      : products.filter((p) => p.category === activeFilter);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-brand-600 font-semibold text-sm tracking-wider uppercase mb-3">
            Handpicked for You
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Featured Products
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            Trending items our customers can't stop talking about
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeFilter === f
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const justAdded = addedIds.has(product.id);
            const liked = isInWishlist(product.id);
            const badge = getBadge(product);
            return (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 block"
              >
                {/* Image area */}
                <div className={`relative bg-gradient-to-br ${product.gradient} p-10 flex items-center justify-center min-h-[280px] sm:min-h-[300px]`}>
                  <span className="text-8xl sm:text-9xl group-hover:scale-110 transition-transform duration-500">
                    {product.emoji}
                  </span>

                  {badge && (
                    <span
                      className={`absolute top-4 left-4 ${badge.color} text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md`}
                    >
                      {badge.text}
                    </span>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                  {/* Quick actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlistItem(product);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-colors ${
                        liked
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="w-9 h-9 rounded-xl bg-white text-gray-600 hover:text-brand-600 flex items-center justify-center shadow-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <p className="text-xs font-medium text-brand-600 uppercase tracking-wider">
                    {product.category}
                  </p>
                  <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-extrabold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
                        justAdded
                          ? 'bg-emerald-500 text-white shadow-emerald-200 scale-110'
                          : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200 hover:shadow-lg'
                      }`}
                    >
                      {justAdded ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-14">
          <Link
            to="/handbags"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold text-sm hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
          >
            View All Products
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
