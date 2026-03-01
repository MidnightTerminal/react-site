import { useState } from 'react';
import { Heart, ShoppingBag, Star, Eye, Check } from 'lucide-react';
import { useCart, type Product } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

export function ProductCard({ product }: { product: Product }) {
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();

  const liked = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem(product);
  };

  // Compute dynamic badge
  const getBadge = () => {
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
  };

  const badge = getBadge();

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 block"
    >
      {/* Image area */}
      <div className={`relative bg-gradient-to-br ${product.gradient} p-10 flex items-center justify-center min-h-[280px] sm:min-h-[300px]`}>
        <span className="text-8xl sm:text-9xl group-hover:scale-110 transition-transform duration-500">
          {product.emoji}
        </span>

        {badge && (
          <span className={`absolute top-4 left-4 ${badge.color} text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md`}>
            {badge.text}
          </span>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        {/* Quick actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={handleToggleLike}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-colors ${
              liked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
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
            onClick={handleAddToCart}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
              justAdded
                ? 'bg-emerald-500 text-white shadow-emerald-200 scale-110'
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200 hover:shadow-lg'
            }`}
          >
            {justAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Link>
  );
}
